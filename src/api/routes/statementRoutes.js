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
var _b = require("../controllers/statementController"),
	getAllStatements = _b.getAllStatements,
	createStatement = _b.createStatement,
	deleteStatement = _b.deleteStatement;
var financeStatementsURL = require("./routes").financeStatementsURL;
var router = express_1.default.Router();
router.get(financeStatementsURL + "get", isAuthenticated, getAllStatements);
router.post(financeStatementsURL + "add", adminRules, createStatement);
router.delete(financeStatementsURL + ":id", adminRules, deleteStatement);
exports.default = router;
