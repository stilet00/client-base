"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var businessAdminsController_1 = require("../controllers/businessAdminsController");
var adminRules = require("../firebase/firebaseAdmin").adminRules;
var businessAdminsURL = require("./routes").businessAdminsURL;
var router = express_1.default.Router();
router.get(
	businessAdminsURL,
	adminRules,
	businessAdminsController_1.getAllBusinessAdmins,
);
// router.get(
//     translatorsURL + 'last-gift/:id',
//     isAuthenticated,
//     getLastVirtualGift
// )
// router.get(translatorsURL + 'send-emails', adminRules, sendEmailsToTranslators)
router.post(
	businessAdminsURL,
	adminRules,
	businessAdminsController_1.saveBusinessAdmin,
);
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
exports.default = router;
