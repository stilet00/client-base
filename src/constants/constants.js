"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYONEER_COMISSION =
	exports.TRANSLATORS_SALARY_PERCENT =
	exports.BOT_LIST =
	exports.DEFAULT_STATEMENT =
	exports.FINANCE_COMMENTS =
	exports.FINANCE_SENDERS =
	exports.SUNRISE_AGENCY_ID =
	exports.DEFAULT_TRANSLATOR =
	exports.DEFAULT_ERROR =
	exports.EMPTY_BALANCE_DAY =
	exports.DEFAULT_MONTH_CHART =
	exports.DEFAULT_PENALTY =
	exports.DEFAULT_CLIENT =
	exports.localStorageTokenKey =
	exports.inactivityPeriod =
	exports.arrayOfYearsForSelectFilter =
	exports.appStartYear =
	exports.previousDay =
	exports.previousMonth =
	exports.currentMonth =
	exports.previousYear =
	exports.currentYear =
		void 0;
var sharedFunctions_1 = require("../sharedFunctions/sharedFunctions");
var moment_1 = __importDefault(require("moment"));
exports.currentYear = (0, moment_1.default)().utc().format("YYYY");
exports.previousYear = (0, moment_1.default)()
	.utc()
	.subtract(1, "year")
	.format("YYYY");
exports.currentMonth = (0, moment_1.default)().utc().format("M");
exports.previousMonth = (0, moment_1.default)()
	.utc()
	.subtract(1, "month")
	.format("M");
exports.previousDay = (0, moment_1.default)()
	.utc()
	.subtract(1, "day")
	.format("D");
exports.appStartYear = 2022;
exports.arrayOfYearsForSelectFilter = creatArrayOfYears();
exports.inactivityPeriod = 1000 * 60 * 20;
exports.localStorageTokenKey = "clientBaseUserToken";
exports.DEFAULT_CLIENT = {
	name: "",
	surname: "",
	bankAccount: "",
	instagramLink: "",
	suspended: false,
	svadba: {
		login: "",
		password: "",
	},
	dating: {
		login: "",
		password: "",
	},
	image: "",
};
var DEFAULT_PENALTY = /** @class */ (function () {
	function DEFAULT_PENALTY(translatorId, dateTimeId) {
		this.dateTimeId = dateTimeId;
		this.amount = 0;
		this.description = "";
		this.translator = translatorId;
	}
	return DEFAULT_PENALTY;
})();
exports.DEFAULT_PENALTY = DEFAULT_PENALTY;
var DEFAULT_MONTH_CHART = /** @class */ (function () {
	function DEFAULT_MONTH_CHART(year, month) {
		this.year = year;
		this.month = (0, sharedFunctions_1.getStringMonthNumber)(month);
		this.days = (0, sharedFunctions_1.getTotalDaysOfMonth)(year, month);
		this.values = [];
	}
	return DEFAULT_MONTH_CHART;
})();
exports.DEFAULT_MONTH_CHART = DEFAULT_MONTH_CHART;
var EMPTY_BALANCE_DAY = /** @class */ (function () {
	function EMPTY_BALANCE_DAY(translatorId, clientId, dateTimeId) {
		this.dateTimeId = dateTimeId;
		this.client = { _id: clientId };
		this.translator = { _id: translatorId };
		this.statistics = {
			chats: 0,
			letters: 0,
			dating: 0,
			virtualGiftsSvadba: 0,
			virtualGiftsDating: 0,
			photoAttachments: 0,
			phoneCalls: 0,
			voiceMessages: 0,
			penalties: 0,
			comments: "",
		};
	}
	return EMPTY_BALANCE_DAY;
})();
exports.EMPTY_BALANCE_DAY = EMPTY_BALANCE_DAY;
exports.DEFAULT_ERROR = {
	status: false,
	text: null,
};
exports.DEFAULT_TRANSLATOR = {
	name: "",
	surname: "",
	suspended: {
		status: false,
		time: null,
	},
	email: null,
};
exports.SUNRISE_AGENCY_ID = "62470d5dffe20600169edac1";
function creatArrayOfYears() {
	var arrayWithYears = [];
	var lengthOfArrayWithYears =
		Number(exports.currentYear) - exports.appStartYear;
	for (var i = 0; i < lengthOfArrayWithYears + 1; i++) {
		arrayWithYears.unshift(String(exports.appStartYear + i));
	}
	return arrayWithYears;
}
exports.FINANCE_SENDERS = {
	anton: "Anton",
	agency: "Agency",
	oleksandr: "Oleksandr",
};
exports.FINANCE_COMMENTS = {
	salary: "salary",
	paymentToScout: "Payment to scout",
	paymentToBot: "Payment to bot",
	paymentToTranslator: "Payment to translator",
};
exports.DEFAULT_STATEMENT = {
	receiver: "",
	amount: 0,
	sender: exports.FINANCE_SENDERS.agency,
	comment: exports.FINANCE_COMMENTS.salary,
	date: (0, moment_1.default)().utc(),
};
exports.BOT_LIST = [
	{ id: "Chat4me7210Sunrise", label: "Chat4me" },
	{ id: "Sender7210Sunrise", label: "Sender" },
];
exports.TRANSLATORS_SALARY_PERCENT = 0.45;
exports.PAYONEER_COMISSION = 0.968;
