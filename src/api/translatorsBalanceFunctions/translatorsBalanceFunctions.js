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
Object.defineProperty(exports, "__esModule", { value: true });
var getMomentUTC = require("../utils/utils").getMomentUTC;
var calculateBalanceDaySum = function (targetObject, onlySvadba, category) {
	var _a;
	if (onlySvadba === void 0) {
		onlySvadba = false;
	}
	if (category === void 0) {
		category = null;
	}
	if (onlySvadba) {
		var svadbaObject = __assign(__assign({}, targetObject), {
			dating: 0,
			virtualGiftsDating: 0,
		});
		var arrayOfNumberValues = Object.values(svadbaObject).filter(
			function (value) {
				return typeof value === "number";
			},
		);
		var svadbaSum = arrayOfNumberValues.reduce(function (sum, current) {
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
};
var calculatePercentDifference = function (currentSum, previousSum) {
	var difference =
		currentSum > previousSum
			? ((currentSum - previousSum) * 100) / currentSum
			: ((previousSum - currentSum) * 100) / previousSum;
	var result = isNaN(difference) ? 0 : parseFloat(difference.toFixed(1));
	if (result % 1 === 0) {
		return {
			progressIsPositive: currentSum > previousSum,
			value: parseFloat(result.toFixed(0)),
		};
	}
	return {
		progressIsPositive: currentSum > previousSum,
		value: result,
	};
};
var getCurrentMonthPenalties = function (penalties) {
	if (!penalties) return "0";
	var currentDate = getMomentUTC();
	var onlyCurMonthPenalties = penalties.filter(function (_a) {
		var dateTimeId = _a.dateTimeId;
		return getMomentUTC(dateTimeId).isSame(currentDate, "month");
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
module.exports = {
	calculatePercentDifference: calculatePercentDifference,
	getCurrentMonthPenalties: getCurrentMonthPenalties,
	calculateBalanceDaySum: calculateBalanceDaySum,
};
