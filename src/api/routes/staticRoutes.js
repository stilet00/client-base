"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var rootURL = require("./routes").rootURL;
var router = express_1.default.Router();
var sendIndexHtml = function (req, res) {
	res.sendFile(__dirname + "/build/index.html");
};
router.get(rootURL + "chart/", sendIndexHtml);
router.get(rootURL + "chart?", sendIndexHtml);
router.get(rootURL + "overview/?", sendIndexHtml);
router.get(rootURL + "clients/true?", sendIndexHtml);
router.get(rootURL + "clients/?", sendIndexHtml);
router.get(rootURL + "tasks/?", sendIndexHtml);
router.get(rootURL + "translators/?", sendIndexHtml);
router.get(rootURL + "finances/?", sendIndexHtml);
exports.default = router;
