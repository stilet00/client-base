const firebaseAdmin = require("firebase-admin");
const { getCollections } = require("../database/collections");
const googleFirebaseApp = firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.cert(
		JSON.parse(process.env.GOOGLE_ACCOUNT_CREDENTIALS),
	),
});
const nodemailer = require("nodemailer");

const credentialsForNodeMailer = JSON.parse(
	process.env.CREDENTIALS_FOR_NODEMAILER,
);

const getUserIdTokenFromRequest = (request) => {
	try {
		return request.header("authorization").split(" ")[1].toString();
	} catch (err) {
		throw new Error("Someting went wrong with authorization header");
	}
};
const changeUserPassword = async (request, response) => {
	const { email } = request.body;
	try {
		const userRecord = await firebaseAdmin.auth().getUserByEmail(email);
		if (userRecord) {
			const resetLink = await firebaseAdmin
				.auth()
				.generatePasswordResetLink(email);
			await sendResetEmail(email, resetLink);

			return response
				.status(200)
				.json({ message: "Password reset link sent successfully." });
		}
		return response.status(404).json({ error: "User not found." });
	} catch (err) {
		console.error(err.message);
		return response.status(500).json({ error: "Internal server error." });
	}
};
const isAuthenticated = (request, response, next) => {
	try {
		const clientIdToken = getUserIdTokenFromRequest(request);
		googleFirebaseApp
			.auth()
			.verifyIdToken(clientIdToken)
			.then((decodedToken) => {
				if (decodedToken) {
					next();
				} else {
					response.sendStatus(401);
				}
			})
			.catch((error) => {
				if (!!error.message) {
					console.error(error.message);
				} else {
					console.error(error);
				}
				response.sendStatus(401);
			});
	} catch (error) {
		console.error(
			"Error: Something went wrong with checking user's authentication",
		);
		response.sendStatus(401);
	}
};

async function sendResetEmail(email, resetLink) {
	const transporter = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: credentialsForNodeMailer.user,
			pass: credentialsForNodeMailer.pass,
		},
	});
	const mailOptions = {
		from: '"Sunrise agency" <sunrise-agency@gmail.com>',
		to: email,
		subject: "Password Reset Request",
		text: `Click the link below to reset your password:\n${resetLink}`,
	};
	await transporter.sendMail(mailOptions);
}

async function isAdmin(request, response, next) {
	const idToken = request.header("Authorization");
	const tokenParts = idToken.split(" ");
	const cleanedIdToken = tokenParts[1].trim();

	try {
		const decodedToken = await firebaseAdmin
			.auth()
			.verifyIdToken(cleanedIdToken);
		const userFromToken = decodedToken.email;
		const admin = await getCollections().collectionAdmins.findOne({
			registeredEmail: userFromToken,
		});
		if (!admin) {
			return response.status(401).json({
				error: "You don't have permission to do this action 😡",
			});
		}

		next();
	} catch (error) {
		console.error("Error verifying token:", error);
		response.sendStatus(403);
	}
}

const adminRules = [isAuthenticated, isAdmin];

module.exports = {
	isAuthenticated,
	changeUserPassword,
	firebaseAdmin,
	adminRules,
	isAdmin,
	adminRules,
};
