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
var getNumberWithHundreds =
	require("../../sharedFunctions/sharedFunctions").getNumberWithHundreds;
var getMomentUTC = require("../utils/utils").getMomentUTC;
var fetchRawBalanceDays = function (year) {
	return __awaiter(void 0, void 0, void 0, function () {
		var BalanceDay,
			momentFromYearFilter,
			startOfYearFilter,
			endOfYearFilter,
			rawResults;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					return [4 /*yield*/, getCollections().collectionBalanceDays];
				case 1:
					BalanceDay = _a.sent();
					momentFromYearFilter = getMomentUTC(year, "YYYY");
					startOfYearFilter = momentFromYearFilter.startOf("year").toDate();
					endOfYearFilter = momentFromYearFilter.endOf("year").toDate();
					return [
						4 /*yield*/,
						BalanceDay.aggregate([
							{
								$match: {
									dateTimeId: {
										$gte: startOfYearFilter,
										$lte: endOfYearFilter,
									},
								},
							},
							{
								$group: {
									_id: {
										year: { $year: "$dateTimeId" },
										month: { $month: "$dateTimeId" },
										day: { $dayOfMonth: "$dateTimeId" },
									},
									totalSum: {
										$sum: {
											$subtract: [
												{
													$add: [
														"$statistics.chats",
														"$statistics.letters",
														"$statistics.dating",
														"$statistics.virtualGiftsSvadba",
														"$statistics.virtualGiftsDating",
														"$statistics.photoAttachments",
														"$statistics.phoneCalls",
														"$statistics.voiceMessages",
													],
												},
												"$statistics.penalties",
											],
										},
									},
								},
							},
							{
								$group: {
									_id: { year: "$_id.year", month: "$_id.month" },
									days: { $push: "$_id.day" },
									values: { $push: "$totalSum" },
								},
							},
							{
								$project: {
									year: "$_id.year",
									month: { $toString: "$_id.month" },
									days: 1,
									values: 1,
								},
							},
							{ $sort: { year: -1, month: -1 } },
						]),
					];
				case 2:
					rawResults = _a.sent();
					return [2 /*return*/, rawResults];
			}
		});
	});
};
var formatYearChartsArray = function (rawResults) {
	return rawResults.map(function (monthData) {
		var year = monthData.year.toString();
		var month = monthData.month;
		var daysInMonth = (0, moment_1.default)(
			"".concat(year, "-").concat(month),
			"YYYY-MM",
		).daysInMonth();
		var fullDays = Array.from({ length: daysInMonth }, function (_, i) {
			return i + 1;
		});
		var fullValues = Array(daysInMonth).fill(null);
		monthData.days.forEach(function (day, index) {
			var value = monthData.values[index];
			var dayIndex = fullDays.indexOf(day);
			if (dayIndex !== -1) {
				fullValues[dayIndex] = getNumberWithHundreds(value);
			}
		});
		return {
			year: year,
			month: month,
			days: fullDays,
			values: fullValues,
		};
	});
};
var getCharts = function (req, res) {
	return __awaiter(void 0, void 0, void 0, function () {
		var yearFilter, currentYear, rawResults, yearChartsArray, error_1;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					_a.trys.push([0, 2, , 3]);
					yearFilter = req.query.yearFilter;
					currentYear = yearFilter ? yearFilter : getMomentUTC().format("YYYY");
					return [4 /*yield*/, fetchRawBalanceDays(currentYear)];
				case 1:
					rawResults = _a.sent();
					yearChartsArray = formatYearChartsArray(rawResults);
					res.send(yearChartsArray);
					return [3 /*break*/, 3];
				case 2:
					error_1 = _a.sent();
					if (error_1 instanceof Error) {
						console.error(error_1.message);
					}
					res.sendStatus(500);
					return [3 /*break*/, 3];
				case 3:
					return [2 /*return*/];
			}
		});
	});
};
exports.getCharts = getCharts;
