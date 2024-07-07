"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var isAuthenticated = require("../firebase/firebaseAdmin").isAuthenticated;
var _a = require("../controllers/balanceDayController"),
	getBalanceDay = _a.getBalanceDay,
	createBalanceDay = _a.createBalanceDay,
	updateBalanceDay = _a.updateBalanceDay,
	getBalanceDaysForTranslators = _a.getBalanceDaysForTranslators,
	getAllBalanceDays = _a.getAllBalanceDays,
	getCurrentMonthTotal = _a.getCurrentMonthTotal,
	getBalanceDayForSelectedDate = _a.getBalanceDayForSelectedDate;
var balanceDayURL = require("./routes").balanceDayURL;
var router = express_1.default.Router();
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
exports.default = router;
