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
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
					});
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
var __generator =
	(this && this.__generator) ||
	function (thisArg, body) {
		var _ = {
				label: 0,
				sent: function () {
					if (t[0] & 1) throw t[1];
					return t[1];
				},
				trys: [],
				ops: [],
			},
			f,
			y,
			t,
			g;
		return (
			(g = { next: verb(0), throw: verb(1), return: verb(2) }),
			typeof Symbol === "function" &&
				(g[Symbol.iterator] = function () {
					return this;
				}),
			g
		);
		function verb(n) {
			return function (v) {
				return step([n, v]);
			};
		}
		function step(op) {
			if (f) throw new TypeError("Generator is already executing.");
			while ((g && ((g = 0), op[0] && (_ = 0)), _))
				try {
					if (
						((f = 1),
						y &&
							(t =
								op[0] & 2
									? y["return"]
									: op[0]
										? y["throw"] || ((t = y["return"]) && t.call(y), 0)
										: y.next) &&
							!(t = t.call(y, op[1])).done)
					)
						return t;
					if (((y = 0), t)) op = [op[0] & 2, t.value];
					switch (op[0]) {
						case 0:
						case 1:
							t = op;
							break;
						case 4:
							_.label++;
							return { value: op[1], done: false };
						case 5:
							_.label++;
							y = op[1];
							op = [0];
							continue;
						case 7:
							op = _.ops.pop();
							_.trys.pop();
							continue;
						default:
							if (
								!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
								(op[0] === 6 || op[0] === 2)
							) {
								_ = 0;
								continue;
							}
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
								_.label = op[1];
								break;
							}
							if (op[0] === 6 && _.label < t[1]) {
								_.label = t[1];
								t = op;
								break;
							}
							if (t && _.label < t[2]) {
								_.label = t[2];
								_.ops.push(op);
								break;
							}
							if (t[2]) _.ops.pop();
							_.trys.pop();
							continue;
					}
					op = body.call(thisArg, _);
				} catch (e) {
					op = [6, e];
					y = 0;
				} finally {
					f = t = 0;
				}
			if (op[0] & 5) throw op[1];
			return { value: op[0] ? op[1] : void 0, done: true };
		}
	};
var __spreadArray =
	(this && this.__spreadArray) ||
	function (to, from, pack) {
		if (pack || arguments.length === 2)
			for (var i = 0, l = from.length, ar; i < l; i++) {
				if (ar || !(i in from)) {
					if (!ar) ar = Array.prototype.slice.call(from, 0, i);
					ar[i] = from[i];
				}
			}
		return to.concat(ar || Array.prototype.slice.call(from));
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOverviewData = void 0;
var sharedFunctions_1 = require("../../sharedFunctions/sharedFunctions");
var collections_1 = require("../database/collections");
var getMomentUTC = require("../utils/utils").getMomentUTC;
var getBalanceDaysForYear = function (yearFilter) {
	return __awaiter(void 0, void 0, void 0, function () {
		var BalanceDay, startOfYear, endOfYear;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					return [
						4 /*yield*/,
						(0, collections_1.getCollections)().collectionBalanceDays,
					];
				case 1:
					BalanceDay = _a.sent();
					startOfYear = getMomentUTC(yearFilter, "YYYY")
						.startOf("year")
						.toISOString();
					endOfYear = getMomentUTC(yearFilter, "YYYY")
						.endOf("year")
						.toISOString();
					return [
						4 /*yield*/,
						BalanceDay.find({
							dateTimeId: { $gte: startOfYear, $lte: endOfYear },
						}).exec(),
					];
				case 2:
					return [2 /*return*/, _a.sent()];
			}
		});
	});
};
var calculatePercentageDifference = function (current, previous) {
	return previous === 0 ? 0 : ((current - previous) / previous) * 100;
};
var getPaymentSums = function (year) {
	return __awaiter(void 0, void 0, void 0, function () {
		var Payment, paymentSums, totalPayments, categorySums;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					return [
						4 /*yield*/,
						(0, collections_1.getCollections)().collectionStatements,
					];
				case 1:
					Payment = _a.sent();
					return [
						4 /*yield*/,
						Payment.aggregate([
							{
								$match: {
									date: {
										$gte: new Date("".concat(year, "-01-01T00:00:00.000Z")),
										$lte: new Date("".concat(year, "-12-31T23:59:59.999Z")),
									},
								},
							},
							{
								$group: {
									_id: "$comment",
									totalAmount: { $sum: "$amount" },
								},
							},
						]).exec(),
					];
				case 2:
					paymentSums = _a.sent();
					totalPayments = paymentSums.reduce(function (sum, payment) {
						return sum + payment.totalAmount;
					}, 0);
					categorySums = paymentSums.reduce(
						function (acc, payment) {
							switch (payment._id) {
								case "salary":
									acc.clientsSalary = payment.totalAmount.toFixed(0);
									break;
								case "Payment to scout":
									acc.paymentToScout = payment.totalAmount.toFixed(0);
									break;
								case "Payment to bot":
									acc.paymentToBot = payment.totalAmount.toFixed(0);
									break;
								case "Payment to translator":
									acc.paymentToTranslator = payment.totalAmount.toFixed(0);
									break;
							}
							return acc;
						},
						{
							clientsSalary: "0",
							paymentToScout: "0",
							paymentToBot: "0",
							paymentToTranslator: "0",
						},
					);
					return [
						2 /*return*/,
						{ totalPayments: totalPayments, categorySums: categorySums },
					];
			}
		});
	});
};
var calculateMonthTotal = function () {
	var args_1 = [];
	for (var _i = 0; _i < arguments.length; _i++) {
		args_1[_i] = arguments[_i];
	}
	return __awaiter(
		void 0,
		__spreadArray([], args_1, true),
		void 0,
		function (monthOffset) {
			var BalanceDay,
				startOfMonth,
				endOfMonth,
				balanceDays,
				monthTotal,
				svadbaMonthTotal;
			if (monthOffset === void 0) {
				monthOffset = 0;
			}
			return __generator(this, function (_a) {
				switch (_a.label) {
					case 0:
						return [
							4 /*yield*/,
							(0, collections_1.getCollections)().collectionBalanceDays,
						];
					case 1:
						BalanceDay = _a.sent();
						startOfMonth = getMomentUTC()
							.subtract(monthOffset, "month")
							.startOf("month")
							.toISOString();
						endOfMonth = getMomentUTC()
							.subtract(monthOffset, "month")
							.endOf("month")
							.toISOString();
						return [
							4 /*yield*/,
							BalanceDay.find({
								dateTimeId: { $gte: startOfMonth, $lte: endOfMonth },
							}).exec(),
						];
					case 2:
						balanceDays = _a.sent();
						monthTotal = balanceDays.reduce(function (sum, day) {
							return (
								sum +
								(0, sharedFunctions_1.calculateBalanceDaySum)(day.statistics)
							);
						}, 0);
						svadbaMonthTotal = balanceDays.reduce(function (sum, day) {
							return (
								sum +
								(0, sharedFunctions_1.calculateBalanceDaySum)(
									day.statistics,
									true,
								)
							);
						}, 0);
						return [
							2 /*return*/,
							{ monthTotal: monthTotal, svadbaMonthTotal: svadbaMonthTotal },
						];
				}
			});
		},
	);
};
var getOverviewData = function (req, res) {
	return __awaiter(void 0, void 0, void 0, function () {
		var selectedYear,
			yearFilter,
			balanceDays,
			yearTotal,
			_a,
			currentMonthTotal,
			svadbaMonthTotal,
			_b,
			previousMonthTotal,
			svadbaPreviousMonthTotal,
			monthPercentageDifference,
			svadbaPercentageDifference,
			datingPercentageDifference,
			Translator,
			Client,
			translators,
			clientsCount,
			activeTranslators,
			_c,
			totalPayments,
			categorySums,
			totalProfit,
			overviewData,
			error_1;
		return __generator(this, function (_d) {
			switch (_d.label) {
				case 0:
					_d.trys.push([0, 9, , 10]);
					selectedYear = req.query.selectedYear;
					yearFilter = selectedYear || getMomentUTC().format("YYYY");
					return [4 /*yield*/, getBalanceDaysForYear(yearFilter)];
				case 1:
					balanceDays = _d.sent();
					yearTotal = balanceDays.reduce(function (sum, day) {
						return (
							sum +
							(0, sharedFunctions_1.calculateBalanceDaySum)(day.statistics)
						);
					}, 0);
					return [4 /*yield*/, calculateMonthTotal()];
				case 2:
					(_a = _d.sent()),
						(currentMonthTotal = _a.monthTotal),
						(svadbaMonthTotal = _a.svadbaMonthTotal);
					return [4 /*yield*/, calculateMonthTotal(1)];
				case 3:
					(_b = _d.sent()),
						(previousMonthTotal = _b.monthTotal),
						(svadbaPreviousMonthTotal = _b.svadbaMonthTotal);
					monthPercentageDifference = calculatePercentageDifference(
						currentMonthTotal,
						previousMonthTotal,
					);
					svadbaPercentageDifference = calculatePercentageDifference(
						svadbaMonthTotal,
						svadbaPreviousMonthTotal,
					);
					datingPercentageDifference = calculatePercentageDifference(
						currentMonthTotal - svadbaMonthTotal,
						previousMonthTotal - svadbaPreviousMonthTotal,
					);
					return [
						4 /*yield*/,
						(0, collections_1.getCollections)().collectionTranslators,
					];
				case 4:
					Translator = _d.sent();
					return [
						4 /*yield*/,
						(0, collections_1.getCollections)().collectionClients,
					];
				case 5:
					Client = _d.sent();
					return [
						4 /*yield*/,
						Translator.find({
							"suspended.status": false,
						}).exec(),
					];
				case 6:
					translators = _d.sent();
					return [4 /*yield*/, Client.countDocuments().exec()];
				case 7:
					clientsCount = _d.sent();
					activeTranslators = translators.length;
					return [4 /*yield*/, getPaymentSums(yearFilter)];
				case 8:
					(_c = _d.sent()),
						(totalPayments = _c.totalPayments),
						(categorySums = _c.categorySums);
					totalProfit =
						yearTotal - Math.floor(yearTotal * 0.45) - totalPayments;
					overviewData = __assign(
						{
							clients: clientsCount,
							activeTranslators: activeTranslators,
							monthTotal: currentMonthTotal.toFixed(0),
							svadbaMonthTotal: svadbaMonthTotal.toFixed(0),
							previousMonthTotal: previousMonthTotal.toFixed(0),
							svadbaPreviousMonthTotal: svadbaPreviousMonthTotal.toFixed(0),
							yearTotal: yearTotal.toFixed(0),
							totalPayments: totalPayments.toFixed(0),
							totalProfit: totalProfit.toFixed(0),
							monthPercentageDifference: Math.round(monthPercentageDifference),
							svadbaPercentageDifference: Math.round(
								svadbaPercentageDifference,
							),
							datingPercentageDifference: Math.round(
								datingPercentageDifference,
							),
						},
						categorySums,
					);
					res.status(200).json(overviewData);
					return [3 /*break*/, 10];
				case 9:
					error_1 = _d.sent();
					console.error(error_1);
					res.status(500).json({ error: "Internal Server Error" });
					return [3 /*break*/, 10];
				case 10:
					return [2 /*return*/];
			}
		});
	});
};
exports.getOverviewData = getOverviewData;
