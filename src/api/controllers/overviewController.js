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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOverviewData = void 0;
var sharedFunctions_1 = require("../../sharedFunctions/sharedFunctions");
var collections_1 = require("../database/collections");
var getMomentUTC = require("../utils/utils").getMomentUTC;
var getOverviewData = function (req, res) {
	return __awaiter(void 0, void 0, void 0, function () {
		var selectedYear,
			BalanceDay,
			Translator,
			Client,
			Payment,
			yearFilter,
			startOfYear,
			endOfYear,
			balanceDays,
			yearTotal,
			startOfMonth,
			endOfCurrentDay,
			currentMonthBalanceDays,
			currentMonthTotal,
			svadbaMonthTotal,
			startOfPreviousMonth,
			endOfPreviousMonth,
			previousMonthBalanceDays,
			previousMonthTotal,
			svadbaPreviousMonthTotal,
			calculatePercentageDifference,
			monthPercentageDifference,
			svadbaPercentageDifference,
			datingMonthTotal,
			datingPreviousMonthTotal,
			datingPercentageDifference,
			translators,
			activeTranslators,
			clientsCount,
			payments,
			paymentSums,
			totalPayments,
			totalProfit,
			categorySums,
			overviewData,
			error_1;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					_a.trys.push([0, 12, , 13]);
					selectedYear = req.query.selectedYear;
					return [
						4 /*yield*/,
						(0, collections_1.getCollections)().collectionBalanceDays,
					];
				case 1:
					BalanceDay = _a.sent();
					return [
						4 /*yield*/,
						(0, collections_1.getCollections)().collectionTranslators,
					];
				case 2:
					Translator = _a.sent();
					return [
						4 /*yield*/,
						(0, collections_1.getCollections)().collectionClients,
					];
				case 3:
					Client = _a.sent();
					return [
						4 /*yield*/,
						(0, collections_1.getCollections)().collectionStatements,
					];
				case 4:
					Payment = _a.sent();
					yearFilter = selectedYear || getMomentUTC().format("YYYY");
					startOfYear = getMomentUTC(yearFilter, "YYYY")
						.startOf("year")
						.toISOString();
					endOfYear = getMomentUTC(yearFilter, "YYYY")
						.endOf("year")
						.toISOString();
					return [
						4 /*yield*/,
						BalanceDay.find({
							dateTimeId: {
								$gte: startOfYear,
								$lte: endOfYear,
							},
						}).exec(),
					];
				case 5:
					balanceDays = _a.sent();
					yearTotal = balanceDays.reduce(function (sum, day) {
						return (
							sum +
							(0, sharedFunctions_1.calculateBalanceDaySum)(day.statistics)
						);
					}, 0);
					startOfMonth = getMomentUTC().startOf("month").toISOString();
					endOfCurrentDay = getMomentUTC().endOf("day").toISOString();
					return [
						4 /*yield*/,
						BalanceDay.find({
							dateTimeId: {
								$gte: startOfMonth,
								$lte: endOfCurrentDay,
							},
						}).exec(),
					];
				case 6:
					currentMonthBalanceDays = _a.sent();
					currentMonthTotal = currentMonthBalanceDays.reduce(function (
						sum,
						day,
					) {
						return (
							sum +
							(0, sharedFunctions_1.calculateBalanceDaySum)(day.statistics)
						);
					}, 0);
					svadbaMonthTotal = currentMonthBalanceDays.reduce(function (
						sum,
						day,
					) {
						return (
							sum +
							(0, sharedFunctions_1.calculateBalanceDaySum)(
								day.statistics,
								true,
							)
						);
					}, 0);
					startOfPreviousMonth = getMomentUTC()
						.subtract(1, "month")
						.startOf("month")
						.toISOString();
					endOfPreviousMonth = getMomentUTC()
						.subtract(1, "month")
						.endOf("month")
						.toISOString();
					return [
						4 /*yield*/,
						BalanceDay.find({
							dateTimeId: {
								$gte: startOfPreviousMonth,
								$lte: endOfPreviousMonth,
							},
						}).exec(),
					];
				case 7:
					previousMonthBalanceDays = _a.sent();
					previousMonthTotal = previousMonthBalanceDays.reduce(function (
						sum,
						day,
					) {
						return (
							sum +
							(0, sharedFunctions_1.calculateBalanceDaySum)(day.statistics)
						);
					}, 0);
					svadbaPreviousMonthTotal = previousMonthBalanceDays.reduce(function (
						sum,
						day,
					) {
						return (
							sum +
							(0, sharedFunctions_1.calculateBalanceDaySum)(
								day.statistics,
								true,
							)
						);
					}, 0);
					calculatePercentageDifference = function (current, previous) {
						return previous === 0 ? 0 : ((current - previous) / previous) * 100;
					};
					monthPercentageDifference = calculatePercentageDifference(
						currentMonthTotal,
						previousMonthTotal,
					);
					svadbaPercentageDifference = calculatePercentageDifference(
						svadbaMonthTotal,
						svadbaPreviousMonthTotal,
					);
					datingMonthTotal = currentMonthTotal - svadbaMonthTotal;
					datingPreviousMonthTotal =
						previousMonthTotal - svadbaPreviousMonthTotal;
					datingPercentageDifference = calculatePercentageDifference(
						datingMonthTotal,
						datingPreviousMonthTotal,
					);
					return [
						4 /*yield*/,
						Translator.find({
							"suspended.status": false,
						}).exec(),
					];
				case 8:
					translators = _a.sent();
					activeTranslators = translators.filter(function (translator) {
						return !translator.suspended.status;
					}).length;
					return [4 /*yield*/, Client.countDocuments().exec()];
				case 9:
					clientsCount = _a.sent();
					return [
						4 /*yield*/,
						Payment.find({
							date: {
								$gte: startOfYear,
								$lte: endOfYear,
							},
						}).exec(),
					];
				case 10:
					payments = _a.sent();
					return [
						4 /*yield*/,
						Payment.aggregate([
							{
								$match: {
									date: {
										$gte: new Date(
											"".concat(selectedYear, "-01-01T00:00:00.000Z"),
										),
										$lte: new Date(
											"".concat(selectedYear, "-12-31T23:59:59.999Z"),
										),
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
				case 11:
					paymentSums = _a.sent();
					totalPayments = payments.reduce(function (sum, payment) {
						return sum + payment.amount;
					}, 0);
					totalProfit =
						yearTotal - Math.floor(yearTotal * 0.45) - totalPayments;
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
					overviewData = __assign(
						{
							clients: clientsCount,
							activeTranslators: activeTranslators,
							monthTotal: currentMonthTotal.toFixed(0),
							svadbaMonthTotal: svadbaMonthTotal.toFixed(0),
							previousMonthTotal: previousMonthTotal.toFixed(0),
							svadbaPreviousMonthTotal: svadbaPreviousMonthTotal.toFixed(0),
							yearTotal: yearTotal.toFixed(0),
							totalPayments: totalPayments,
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
					return [3 /*break*/, 13];
				case 12:
					error_1 = _a.sent();
					console.error(error_1);
					res.status(500).json({ error: "Internal Server Error" });
					return [3 /*break*/, 13];
				case 13:
					return [2 /*return*/];
			}
		});
	});
};
exports.getOverviewData = getOverviewData;
