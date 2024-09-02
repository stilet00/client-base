import express from "express";

const { changeUserPassword } = require("../firebase/firebaseAdmin");
const { getCollections } = require("../database/collections");
const { rootURL } = require("./routes");

const router = express.Router();

router.post(rootURL + "reset-password", changeUserPassword);

router.post(rootURL + "isAdmin", async (req, res) => {
	const userEmail = req.body.email;
	const admin = await getCollections().collectionAdmins.findOne({
		registeredEmail: userEmail,
	});

	res.send(!!admin);
});

export default router;
