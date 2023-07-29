const firebaseAdmin = require('firebase-admin')
const googleFirebaseApp = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(
        JSON.parse(process.env.GOOGLE_ACCOUNT_CREDENTIALS)
    ),
})
const nodemailer = require('nodemailer')

const credentialsForNodeMailer = JSON.parse(
    process.env.CREDENTIALS_FOR_NODEMAILER
)

const getUserIdTokenFromRequest = request => {
    try {
        return request.header('authorization').split(' ')[1].toString()
    } catch (err) {
        throw new Error('Someting went wrong with authorization header')
    }
}
const changeUserPassword = async (request, response) => {
    const { email } = request.body
    try {
        const userRecord = await firebaseAdmin.auth().getUserByEmail(email)
        if (userRecord) {
            // Generate the password reset link using Firebase Auth API
            const resetLink = await firebaseAdmin
                .auth()
                .generatePasswordResetLink(email)
            await sendResetEmail(email, resetLink)
        }
    } catch (err) {
        console.log(err.message)
    }
}
const checkIfUserIsAuthenticatedBeforeExecute = ({
    callBack,
    response,
    request,
}) => {
    try {
        const clientIdToken = getUserIdTokenFromRequest(request)
        googleFirebaseApp
            .auth()
            .verifyIdToken(clientIdToken)
            .then(decodedToken => {
                if (decodedToken) {
                    callBack()
                }
            })
            .catch(error => {
                console.log(error)
                response.sendStatus(401)
            })
    } catch (error) {
        console.log(
            "Error: Something went wrong with checking user's authentication"
        )
        response.sendStatus(401)
    }
}

async function sendResetEmail(email, resetLink) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: credentialsForNodeMailer.user,
            pass: credentialsForNodeMailer.pass,
        },
    })
    const mailOptions = {
        from: '"Sunrise agency" <sunrise-agency@gmail.com>',
        to: email,
        subject: 'Password Reset Request',
        text: `Click the link below to reset your password:\n${resetLink}`,
    }
    await transporter.sendMail(mailOptions)
}

module.exports = {
    checkIfUserIsAuthenticatedBeforeExecute,
    changeUserPassword,
}
