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
router.post(
	businessAdminsURL,
	adminRules,
	businessAdminsController_1.saveBusinessAdmin,
);
router.delete(
	"".concat(businessAdminsURL, ":id"),
	adminRules,
	businessAdminsController_1.deleteBusinessAdmin,
);
exports.default = router;
