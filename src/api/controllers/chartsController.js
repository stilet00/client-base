"use strict";
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
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCharts = void 0;
var moment_1 = __importDefault(require("moment"));
var getCollections = require("../database/collections").getCollections;
var _a = require("../../sharedFunctions/sharedFunctions"),
	calculateBalanceDaySum = _a.calculateBalanceDaySum,
	getNumberWithHundreds = _a.getNumberWithHundreds;
var constants_1 = require("../../constants/constants");
var getMomentUTC = require("../utils/utils").getMomentUTC;
var getCharts = function (req, res) {
	return __awaiter(void 0, void 0, void 0, function () {
		var _a,
			yearFilter,
			monthFilter,
			BalanceDay,
			query,
			momentFromYearFilter,
			startOfYearFilter,
			endOfYearFilter,
			_b,
			startMonth,
			endMonth,
			year,
			startOfMonthFilter,
			endOfMonthFilter,
			balanceDays,
			yearChartsArray,
			monthCount,
			defaultMonth,
			stringMonth,
			daysInMonth,
			_loop_1,
			dayCount,
			error_1;
		return __generator(this, function (_c) {
			switch (_c.label) {
				case 0:
					_c.trys.push([0, 3, , 4]);
					(_a = req.query),
						(yearFilter = _a.yearFilter),
						(monthFilter = _a.monthFilter);
					return [4 /*yield*/, getCollections().collectionBalanceDays];
				case 1:
					BalanceDay = _c.sent();
					query = {};
					if (yearFilter) {
						momentFromYearFilter = getMomentUTC(yearFilter, "YYYY");
						startOfYearFilter = momentFromYearFilter
							.startOf("year")
							.toISOString();
						endOfYearFilter = momentFromYearFilter.endOf("year").toISOString();
						query.dateTimeId = {
							$gte: startOfYearFilter,
							$lte: endOfYearFilter,
						};
					}
					if (monthFilter && typeof monthFilter === "string") {
						(_b = monthFilter.split("-").map(Number)),
							(startMonth = _b[0]),
							(endMonth = _b[1]);
						year = yearFilter
							? getMomentUTC(yearFilter, "YYYY").year()
							: getMomentUTC().year();
						startOfMonthFilter = getMomentUTC({
							year: year,
							month: startMonth - 1,
						})
							.startOf("month")
							.toISOString();
						endOfMonthFilter = getMomentUTC({
							year: year,
							month: (endMonth || startMonth) - 1,
						})
							.endOf("month")
							.toISOString();
						if (!query.dateTimeId) {
							query.dateTimeId = {};
						}
						query.dateTimeId.$gte = startOfMonthFilter;
						query.dateTimeId.$lte = endOfMonthFilter;
					}
					return [4 /*yield*/, BalanceDay.find(query).lean().exec()];
				case 2:
					balanceDays = _c.sent();
					yearChartsArray = [];
					for (monthCount = 1; monthCount <= 12; monthCount++) {
						defaultMonth = new constants_1.DEFAULT_MONTH_CHART(
							yearFilter,
							monthCount,
						);
						stringMonth = defaultMonth.month;
						daysInMonth = (0, moment_1.default)(
							yearFilter + "-" + stringMonth,
							"YYYY-MM",
						)
							.hours(12)
							.utc()
							.daysInMonth();
						_loop_1 = function (dayCount) {
							var currentDayDate = (0, moment_1.default)(
								""
									.concat(dayCount, "-")
									.concat(monthCount, "-")
									.concat(yearFilter),
								"D-M-YYYY",
							)
								.hours(12)
								.utc()
								.format();
							var arrayOfBalanceDayForCurrentDate = balanceDays.filter(
								function (balanceDay) {
									return getMomentUTC(balanceDay.dateTimeId).isSame(
										currentDayDate,
										"day",
									);
								},
							);
							var daySum = arrayOfBalanceDayForCurrentDate.reduce(function (
								sum,
								current,
							) {
								return sum + calculateBalanceDaySum(current.statistics);
							}, 0);
							if (daySum) {
								defaultMonth.values[dayCount - 1] =
									getNumberWithHundreds(daySum);
							}
						};
						for (dayCount = 1; dayCount <= daysInMonth; dayCount++) {
							_loop_1(dayCount);
						}
						if (
							defaultMonth.values.reduce(function (sum, current) {
								return sum + Number(current);
							}, 0)
						) {
							yearChartsArray.unshift(defaultMonth);
						}
					}
					res.send(yearChartsArray);
					return [3 /*break*/, 4];
				case 3:
					error_1 = _c.sent();
					if (error_1 instanceof Error) {
						console.error(error_1.message);
					}
					res.sendStatus(500);
					return [3 /*break*/, 4];
				case 4:
					return [2 /*return*/];
			}
		});
	});
};
exports.getCharts = getCharts;
