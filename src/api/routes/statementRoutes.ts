import express from "express";
const { isAuthenticated, adminRules } = require("../firebase/firebaseAdmin");
const {
	getAllStatements,
	createStatement,
	deleteStatement,
} = require("../controllers/statementController");
const { financeStatementsURL } = require("./routes");

const router = express.Router();

router.get(financeStatementsURL + "get", isAuthenticated, getAllStatements);
router.post(financeStatementsURL + "add", adminRules, createStatement);
router.delete(financeStatementsURL + ":id", adminRules, deleteStatement);

export default router;
