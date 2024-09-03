"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var isAuthenticated = require("../firebase/firebaseAdmin").isAuthenticated;
var getCharts = require("../controllers/chartsController").getCharts;
var chartsURL = require("./routes").chartsURL;
var router = express_1.default.Router();
router.get(chartsURL, isAuthenticated, getCharts);
exports.default = router;
