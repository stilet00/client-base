"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var _a = require("../firebase/firebaseAdmin"),
	isAuthenticated = _a.isAuthenticated,
	adminRules = _a.adminRules;
var _b = require("../controllers/translatorController"),
	getLastVirtualGift = _b.getLastVirtualGift,
	getAllTranslators = _b.getAllTranslators,
	addNewTranslator = _b.addNewTranslator,
	updateTranslator = _b.updateTranslator,
	deleteTranslator = _b.deleteTranslator,
	sendDailyEmails = _b.sendDailyEmails,
	assignClientToTranslator = _b.assignClientToTranslator,
	addPersonalPenaltyToTranslator = _b.addPersonalPenaltyToTranslator,
	getPersonalPenalties = _b.getPersonalPenalties,
	toggleSuspendClientResolver = _b.toggleSuspendClientResolver;
var _c = require("./routes"),
	translatorsURL = _c.translatorsURL,
	personalPenaltiesURL = _c.personalPenaltiesURL;
var router = express_1.default.Router();
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
exports.default = router;
