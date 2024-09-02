import express from "express";
const { isAuthenticated } = require("../firebase/firebaseAdmin");
const {
	getBalanceDay,
	createBalanceDay,
	updateBalanceDay,
	getBalanceDaysForTranslators,
	getAllBalanceDays,
	getCurrentMonthTotal,
	getBalanceDayForSelectedDate,
} = require("../controllers/balanceDayController");

const { balanceDayURL } = require("./routes");

const router = express.Router();

router.post(balanceDayURL + "create", isAuthenticated, createBalanceDay);
router.put(balanceDayURL + "update", isAuthenticated, updateBalanceDay);
router.get(
	balanceDayURL + "translators",
	isAuthenticated,
	getBalanceDaysForTranslators,
);
router.get(balanceDayURL + "all", isAuthenticated, getAllBalanceDays);
router.get(balanceDayURL, isAuthenticated, getBalanceDay);
router.get(
	balanceDayURL + "current-month-total",
	isAuthenticated,
	getCurrentMonthTotal,
);
router.get(
	balanceDayURL + "clients-statistics",
	isAuthenticated,
	getAllBalanceDays,
);
router.get(
	balanceDayURL + "selected-date",
	isAuthenticated,
	getBalanceDayForSelectedDate,
);

export default router;
