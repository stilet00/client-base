import express from "express";
const { isAuthenticated, adminRules } = require("../firebase/firebaseAdmin");
const {
	getLastVirtualGift,
	getAllTranslators,
	addNewTranslator,
	updateTranslator,
	deleteTranslator,
	sendDailyEmails,
	assignClientToTranslator,
	addPersonalPenaltyToTranslator,
	getPersonalPenalties,
	toggleSuspendClientResolver,
} = require("../controllers/translatorController");
const { translatorsURL, personalPenaltiesURL } = require("./routes");

const router = express.Router();

router.get(translatorsURL + "get", isAuthenticated, getAllTranslators);
router.get(
	translatorsURL + "last-gift/:id",
	isAuthenticated,
	getLastVirtualGift,
);
router.get(translatorsURL + "send-emails", adminRules, sendDailyEmails);
router.post(translatorsURL + "add", adminRules, addNewTranslator);
router.put(
	translatorsURL + "suspend-client",
	adminRules,
	toggleSuspendClientResolver,
);
router.put(
	translatorsURL + "assign-client",
	isAuthenticated,
	assignClientToTranslator,
);
router.put(translatorsURL + ":id", adminRules, updateTranslator);
router.delete(translatorsURL + ":id", adminRules, deleteTranslator);

router.post(
	personalPenaltiesURL + "create",
	adminRules,
	addPersonalPenaltyToTranslator,
);
router.get(personalPenaltiesURL + "get", getPersonalPenalties);

export default router;
