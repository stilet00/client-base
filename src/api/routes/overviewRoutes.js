"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var overviewController_1 = require("../controllers/overviewController");
var overviewURL = require("./routes").overviewURL;
var isAuthenticated = require("../firebase/firebaseAdmin").isAuthenticated;
var router = express_1.default.Router();
router.get(
	"".concat(overviewURL, "/get"),
	isAuthenticated,
	overviewController_1.getOverviewData,
);
exports.default = router;
