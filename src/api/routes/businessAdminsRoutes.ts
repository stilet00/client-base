import express from "express";
import {
	getAllBusinessAdmins,
	saveBusinessAdmin,
} from "../controllers/businessAdminsController";
const { adminRules } = require("../firebase/firebaseAdmin");
const { businessAdminsURL } = require("./routes");

const router = express.Router();

router.get(businessAdminsURL, adminRules, getAllBusinessAdmins);
// router.get(
//     translatorsURL + 'last-gift/:id',
//     isAuthenticated,
//     getLastVirtualGift
// )
// router.get(translatorsURL + 'send-emails', adminRules, sendEmailsToTranslators)
router.post(businessAdminsURL, adminRules, saveBusinessAdmin);
// router.put(
//     translatorsURL + 'suspend-client',
//     adminRules,
//     toggleSuspendClientResolver
// )
// router.put(
//     translatorsURL + 'assign-client',
//     isAuthenticated,
//     assignClientToTranslator
// )
// router.put(translatorsURL + ':id', adminRules, updateTranslator)
// router.delete(translatorsURL + ':id', adminRules, deleteTranslator)

// router.post(
//     personalPenaltiesURL + 'create',
//     adminRules,
//     addPersonalPenaltyToTranslator
// )
// router.get(personalPenaltiesURL + 'get', getPersonalPenalties)

export default router;
