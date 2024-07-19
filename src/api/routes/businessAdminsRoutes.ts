import express from "express";
import {
	getAllBusinessAdmins,
	saveBusinessAdmin,
	deleteBusinessAdmin,
} from "../controllers/businessAdminsController";
const { adminRules } = require("../firebase/firebaseAdmin");
const { businessAdminsURL } = require("./routes");

const router = express.Router();

router.get(businessAdminsURL, adminRules, getAllBusinessAdmins);
router.post(businessAdminsURL, adminRules, saveBusinessAdmin);
router.delete(`${businessAdminsURL}:id`, adminRules, deleteBusinessAdmin);

export default router;
