"use strict";
var __assign =
	(this && this.__assign) ||
	function () {
		__assign =
			Object.assign ||
			function (t) {
				for (var s, i = 1, n = arguments.length; i < n; i++) {
					s = arguments[i];
					for (var p in s)
						if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
				}
				return t;
			};
		return __assign.apply(this, arguments);
	};
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentMonthPenalties =
	exports.convertDateToIsoString =
	exports.getStartOfPreviousDayInUTC =
	exports.getMomentUTC =
	exports.saveUserIdTokenToLocalStorage =
	exports.getNumberWithHundreds =
	exports.calculatePercentDifference =
	exports.getClientsRating =
	exports.getMiddleValueFromArray =
	exports.getSumFromArray =
	exports.getStringMonthNumber =
	exports.calculateTranslatorMonthTotal =
	exports.getTotalDaysOfMonth =
	exports.calculateBalanceDaySum =
		void 0;
var moment_1 = __importDefault(require("moment"));
var constants_1 = require("../constants/constants");
function calculateBalanceDaySum(targetObject, onlySvadba, category) {
	var _a;
	if (onlySvadba === void 0) {
		onlySvadba = false;
	}
	if (onlySvadba) {
		var svadbaObject = __assign(__assign({}, targetObject), {
			dating: 0,
			virtualGiftsDating: 0,
		});
		var svadbaSum = Object.values(svadbaObject).reduce(function (sum, current) {
			return typeof current === "number" ? sum + current : sum;
		}, 0);
		return svadbaSum - svadbaObject.penalties * 2;
	} else if (category) {
		var categorizedObject =
			((_a = {}), (_a[category] = targetObject[category]), _a);
		var categorySum = Object.values(categorizedObject).reduce(function (
			sum,
			current,
		) {
			return typeof current === "number" ? sum + current : sum;
		}, 0);
		return categorySum;
	} else {
		var arrayToSum = Object.values(targetObject);
		var sumResult = arrayToSum.reduce(function (sum, current) {
			return typeof current === "number" ? sum + current : sum;
		}, 0);
		return sumResult - targetObject.penalties * 2;
	}
}
exports.calculateBalanceDaySum = calculateBalanceDaySum;
function getTotalDaysOfMonth(year, monthNumber) {
	var stringMonth = monthNumber < 9 ? "0" + monthNumber : monthNumber;
	var totalDays = [];
	for (
		var i = 1;
		i <=
		(0, exports.getMomentUTC)(
			year + "-" + stringMonth,
			"YYYY-MM",
		).daysInMonth();
		i++
	) {
		totalDays.push(i);
	}
	return totalDays;
}
exports.getTotalDaysOfMonth = getTotalDaysOfMonth;
var calculateTranslatorMonthTotal = function (
	balanceDays,
	forFullMonth,
	onlySvadba,
	category,
) {
	if (forFullMonth === void 0) {
		forFullMonth = true;
	}
	if (onlySvadba === void 0) {
		onlySvadba = false;
	}
	var total;
	if (forFullMonth) {
		total =
			balanceDays === null || balanceDays === void 0
				? void 0
				: balanceDays.reduce(function (sum, current) {
						return (
							sum +
							calculateBalanceDaySum(current.statistics, onlySvadba, category)
						);
					}, 0);
	} else {
		var balanceDaysForCurrentPartOFMonth =
			balanceDays === null || balanceDays === void 0
				? void 0
				: balanceDays.filter(function (_a) {
						var dateTimeId = _a.dateTimeId;
						return (0, exports.getMomentUTC)(dateTimeId).isSameOrBefore(
							(0, exports.getMomentUTC)(),
							"day",
						);
					});
		total =
			balanceDaysForCurrentPartOFMonth === null ||
			balanceDaysForCurrentPartOFMonth === void 0
				? void 0
				: balanceDaysForCurrentPartOFMonth.reduce(function (sum, current) {
						return (
							sum +
							calculateBalanceDaySum(current.statistics, onlySvadba, category)
						);
					}, 0);
	}
	return getNumberWithHundreds(total);
};
exports.calculateTranslatorMonthTotal = calculateTranslatorMonthTotal;
function getStringMonthNumber(monthNumber) {
	return monthNumber < 10 ? "0" + monthNumber : String(monthNumber);
}
exports.getStringMonthNumber = getStringMonthNumber;
function getSumFromArray(arrayOfNumbers) {
	return arrayOfNumbers.reduce(function (sum, current) {
		return sum + current;
	}, 0);
}
exports.getSumFromArray = getSumFromArray;
function getMiddleValueFromArray(arrayOfNumbers) {
	var sum = getSumFromArray(arrayOfNumbers);
	if (arrayOfNumbers.length === 0) {
		return 0;
	}
	return Math.round(sum / arrayOfNumbers.length);
}
exports.getMiddleValueFromArray = getMiddleValueFromArray;
function getClientsRating(MiddleMonthSum) {
	if (MiddleMonthSum === void 0) {
		MiddleMonthSum = 0;
	}
	return MiddleMonthSum >= 80
		? 5
		: MiddleMonthSum >= 60
			? 4
			: MiddleMonthSum >= 40
				? 3
				: MiddleMonthSum >= 20
					? 2
					: MiddleMonthSum >= 10
						? 1
						: 0;
}
exports.getClientsRating = getClientsRating;
function calculatePercentDifference(currentSum, previousSum) {
	if (currentSum === 0 && previousSum === 0) {
		return 0;
	}
	var difference =
		currentSum > previousSum
			? ((currentSum - previousSum) * 100) / currentSum
			: ((previousSum - currentSum) * 100) / previousSum;
	if (isNaN(difference)) {
		return 0;
	}
	var result = parseFloat(difference.toFixed(1));
	return result % 1 === 0 ? Math.round(result) : result;
}
exports.calculatePercentDifference = calculatePercentDifference;
function getNumberWithHundreds(number) {
	return Number(
		number === null || number === void 0 ? void 0 : number.toFixed(2),
	);
}
exports.getNumberWithHundreds = getNumberWithHundreds;
function saveUserIdTokenToLocalStorage(idToken) {
	window.localStorage.setItem(constants_1.localStorageTokenKey, idToken);
}
exports.saveUserIdTokenToLocalStorage = saveUserIdTokenToLocalStorage;
var getMomentUTC = function (date, format) {
	if (date === void 0) {
		date = undefined;
	}
	if (format === void 0) {
		format = undefined;
	}
	return (0, moment_1.default)(date, format).utc();
};
exports.getMomentUTC = getMomentUTC;
function getStartOfPreviousDayInUTC() {
	return (0, exports.getMomentUTC)().subtract(1, "day").startOf("day");
}
exports.getStartOfPreviousDayInUTC = getStartOfPreviousDayInUTC;
function convertDateToIsoString(selectedDate) {
	return (0, moment_1.default)(selectedDate).utc().startOf("day").format();
}
exports.convertDateToIsoString = convertDateToIsoString;
var getCurrentMonthPenalties = function (penalties) {
	if (!penalties) return "0";
	var currentDate = (0, exports.getMomentUTC)();
	var onlyCurMonthPenalties = penalties.filter(function (_a) {
		var dateTimeId = _a.dateTimeId;
		return (0, exports.getMomentUTC)(dateTimeId).isSame(currentDate, "month");
	});
	var totalPenaltiesForCurMonth = onlyCurMonthPenalties.reduce(function (
		acc,
		currentPenalty,
	) {
		var amount =
			(currentPenalty === null || currentPenalty === void 0
				? void 0
				: currentPenalty.amount) || 0;
		return acc + amount;
	}, 0);
	return totalPenaltiesForCurMonth.toString();
};
exports.getCurrentMonthPenalties = getCurrentMonthPenalties;
