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
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var mongoose_1 = __importDefault(require("mongoose"));
var getCollections = require("../database/collections").getCollections;
var _a = require("../email-api/financeEmailAPI"),
	sendEmailTemplateToAdministrators = _a.sendEmailTemplateToAdministrators,
	sendEmailTemplateToTranslators = _a.sendEmailTemplateToTranslators;
var PersonalPenaltiesSchema =
	require("../models/translatorsDatabaseModels").PersonalPenaltiesSchema;
var getMomentUTC = require("../utils/utils").getMomentUTC;
var getAllTranslators = function (req, res) {
	return __awaiter(void 0, void 0, void 0, function () {
		var hasSearchQuery, hasShouldGetClients, query, translators, error_1;
		var _a, _b;
		return __generator(this, function (_c) {
			switch (_c.label) {
				case 0:
					_c.trys.push([0, 2, , 3]);
					hasSearchQuery = !!((_a = req.query) === null || _a === void 0
						? void 0
						: _a.searchQuery);
					hasShouldGetClients = !!((_b = req.query) === null || _b === void 0
						? void 0
						: _b.shouldGetClients);
					query = getCollections().collectionTranslators.find();
					if (hasShouldGetClients) {
						query = query.populate("clients");
					}
					return [4 /*yield*/, query.exec()];
				case 1:
					translators = _c.sent();
					res.send(translators);
					return [3 /*break*/, 3];
				case 2:
					error_1 = _c.sent();
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
function getLastVirtualGift(req, res) {
	return __awaiter(this, void 0, void 0, function () {
		var BalanceDay, balanceDay, error_2;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					_a.trys.push([0, 3, , 4]);
					if (!req.params.id) {
						res.send("Отсутствует id переводчика");
						return [2 /*return*/];
					}
					return [4 /*yield*/, getCollections().collectionBalanceDays];
				case 1:
					BalanceDay = _a.sent();
					return [
						4 /*yield*/,
						BalanceDay.findOne({
							translator: new mongodb_1.ObjectId(req.params.id),
							$or: [
								{ "statistics.virtualGiftsSvadba": { $gt: 0 } },
								{ "statistics.virtualGiftsDating": { $gt: 0 } },
							],
						}),
					];
				case 2:
					balanceDay = _a.sent();
					if (!balanceDay) {
						res.send("Не найдено подарков");
						return [2 /*return*/];
					}
					res.send(balanceDay.dateTimeId);
					return [3 /*break*/, 4];
				case 3:
					error_2 = _a.sent();
					if (error_2 instanceof Error) {
						res.status(500).send(error_2.message);
					} else {
						res.status(500).send("An error occurred");
					}
					return [3 /*break*/, 4];
				case 4:
					return [2 /*return*/];
			}
		});
	});
}
var addNewTranslator = function (req, res) {
	return __awaiter(void 0, void 0, void 0, function () {
		var Translator, translator, result, error_3;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					_a.trys.push([0, 3, , 4]);
					return [4 /*yield*/, getCollections().collectionTranslators];
				case 1:
					Translator = _a.sent();
					if (!req.body) {
						res.send("Ошибка при загрузке переводчика");
						return [2 /*return*/];
					}
					translator = new Translator(req.body);
					return [4 /*yield*/, translator.save()];
				case 2:
					result = _a.sent();
					res.send(result._id);
					return [3 /*break*/, 4];
				case 3:
					error_3 = _a.sent();
					console.error(error_3);
					res.sendStatus(500);
					return [3 /*break*/, 4];
				case 4:
					return [2 /*return*/];
			}
		});
	});
};
var updateTranslator = function (req, res) {
	return __awaiter(void 0, void 0, void 0, function () {
		var Translator, newTranslatorData, translator, message, err_1, error_4;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					_a.trys.push([0, 7, , 8]);
					return [4 /*yield*/, getCollections().collectionTranslators];
				case 1:
					Translator = _a.sent();
					newTranslatorData = {
						name: req.body.name,
						surname: req.body.surname,
						clients: req.body.clients,
						statistics: req.body.statistics,
						suspended: req.body.suspended,
						personalPenalties: req.body.personalPenalties,
						email: req.body.email,
						wantsToReceiveEmails: req.body.wantsToReceiveEmails,
					};
					translator = new Translator(newTranslatorData);
					_a.label = 2;
				case 2:
					_a.trys.push([2, 5, , 6]);
					return [4 /*yield*/, translator.validate()];
				case 3:
					_a.sent();
					return [
						4 /*yield*/,
						Translator.updateOne(
							{ _id: new mongodb_1.ObjectId(req.params.id) },
							{ $set: newTranslatorData },
						),
					];
				case 4:
					_a.sent();
					message = "Translator has been saved";
					res.send(message);
					return [3 /*break*/, 6];
				case 5:
					err_1 = _a.sent();
					if (err_1) {
						return [2 /*return*/, res.status(400).send(err_1)];
					}
					return [3 /*break*/, 6];
				case 6:
					return [3 /*break*/, 8];
				case 7:
					error_4 = _a.sent();
					if (error_4 instanceof Error) {
						res.status(500).send(error_4.message);
					} else {
						res.status(500).send("An error occurred");
					}
					return [3 /*break*/, 8];
				case 8:
					return [2 /*return*/];
			}
		});
	});
};
var deleteTranslator = function (req, res) {
	getCollections().collectionTranslators.deleteOne(
		{ _id: new mongodb_1.ObjectId(req.params.id) },
		function (err, docs) {
			if (err) {
				return res.sendStatus(500);
			}
			res.sendStatus(200);
		},
	);
};
var sendDailyEmails = function (req, res) {
	return __awaiter(void 0, void 0, void 0, function () {
		var Translator,
			startOfPreviousMonth,
			endOfYesterday,
			queryForBalanceDays,
			queryForClients,
			translators,
			arrayOfTranslatorNames,
			error_5;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					_a.trys.push([0, 3, , 4]);
					return [4 /*yield*/, getCollections().collectionTranslators];
				case 1:
					Translator = _a.sent();
					startOfPreviousMonth = getMomentUTC()
						.subtract(1, "month")
						.startOf("month")
						.format();
					endOfYesterday = getMomentUTC()
						.subtract(1, "days")
						.endOf("day")
						.format();
					queryForBalanceDays = {
						dateTimeId: {
							$gte: startOfPreviousMonth,
							$lte: endOfYesterday,
						},
					};
					queryForClients = {
						suspended: false,
					};
					return [
						4 /*yield*/,
						Translator.find({
							"suspended.status": false,
							wantsToReceiveEmails: true,
							email: { $exists: true, $ne: "" },
						})
							.populate({
								path: "statistics",
								match: queryForBalanceDays,
								populate: {
									path: "client",
								},
							})
							.populate({
								path: "clients",
								match: queryForClients,
							})
							.exec(),
					];
				case 2:
					translators = _a.sent();
					if (translators.length === 0) {
						res.status(200).send("No translators found");
						return [2 /*return*/];
					}
					arrayOfTranslatorNames = __spreadArray([], translators, true).map(
						function (translator) {
							return translator.email;
						},
					);
					sendEmailTemplateToTranslators(translators);
					sendEmailTemplateToAdministrators(translators);
					res.status(200).send(arrayOfTranslatorNames);
					return [3 /*break*/, 4];
				case 3:
					error_5 = _a.sent();
					console.error("An error occurred:", error_5);
					res.status(500).send("An error occurred");
					return [3 /*break*/, 4];
				case 4:
					return [2 /*return*/];
			}
		});
	});
};
var assignClientToTranslator = function (req, res) {
	return __awaiter(void 0, void 0, void 0, function () {
		var _a,
			clientId,
			translatorId,
			collections,
			Translators,
			Clients,
			translatorResult,
			clientResult,
			error_6;
		return __generator(this, function (_b) {
			switch (_b.label) {
				case 0:
					_b.trys.push([0, 4, , 5]);
					(_a = req.body),
						(clientId = _a.clientId),
						(translatorId = _a.translatorId);
					return [4 /*yield*/, getCollections()];
				case 1:
					collections = _b.sent();
					Translators = collections.collectionTranslators;
					Clients = collections.collectionClients;
					return [
						4 /*yield*/,
						Translators.updateOne(
							{ _id: new mongodb_1.ObjectId(translatorId) },
							{ $addToSet: { clients: new mongodb_1.ObjectId(clientId) } },
						),
					];
				case 2:
					translatorResult = _b.sent();
					return [
						4 /*yield*/,
						Clients.updateOne(
							{ _id: new mongodb_1.ObjectId(clientId) },
							{
								$addToSet: {
									translators: new mongodb_1.ObjectId(translatorId),
								},
							},
						),
					];
				case 3:
					clientResult = _b.sent();
					if (
						translatorResult.nModified === 0 &&
						clientResult.nModified === 0
					) {
						res.status(400).send("Client and translator are already connected");
					} else {
						res
							.status(200)
							.send("Client and translator successfully connected");
					}
					return [3 /*break*/, 5];
				case 4:
					error_6 = _b.sent();
					console.error("An error occurred:", error_6);
					res.status(500).send("An error occurred");
					return [3 /*break*/, 5];
				case 5:
					return [2 /*return*/];
			}
		});
	});
};
var PersonalPenalties = mongoose_1.default.model(
	"PersonalPenalties",
	PersonalPenaltiesSchema,
);
var addPersonalPenaltyToTranslator = function (req, res) {
	return __awaiter(void 0, void 0, void 0, function () {
		var collections,
			Translator,
			_a,
			translatorId,
			dateTimeId,
			amount,
			description,
			translator,
			penalty,
			error_7;
		return __generator(this, function (_b) {
			switch (_b.label) {
				case 0:
					_b.trys.push([0, 4, , 5]);
					return [4 /*yield*/, getCollections()];
				case 1:
					collections = _b.sent();
					Translator = collections.collectionTranslators;
					(_a = req.body),
						(translatorId = _a.translator),
						(dateTimeId = _a.dateTimeId),
						(amount = _a.amount),
						(description = _a.description);
					return [4 /*yield*/, Translator.findById(translatorId)];
				case 2:
					translator = _b.sent();
					if (!translator) {
						return [2 /*return*/, res.status(404).send("Translator not found")];
					}
					penalty = new PersonalPenalties({
						translator: translatorId,
						dateTimeId: dateTimeId,
						amount: amount,
						description: description,
					});
					translator.personalPenalties.push(penalty);
					return [4 /*yield*/, translator.save()];
				case 3:
					_b.sent();
					res
						.status(200)
						.send("Personal penalty successfully added to translator");
					return [3 /*break*/, 5];
				case 4:
					error_7 = _b.sent();
					console.error("An error occurred:", error_7);
					res.status(500).send("An error occurred");
					return [3 /*break*/, 5];
				case 5:
					return [2 /*return*/];
			}
		});
	});
};
var getPersonalPenalties = function (req, res) {
	return __awaiter(void 0, void 0, void 0, function () {
		var _a,
			translatorId,
			dateTimeFilter,
			collections,
			Translator,
			dateTimeFilterMoment,
			startOfMonth,
			endOfMonth,
			selectedTranslator,
			error_8;
		var _b;
		return __generator(this, function (_c) {
			switch (_c.label) {
				case 0:
					_c.trys.push([0, 3, , 4]);
					(_a = req.query),
						(translatorId = _a.translatorId),
						(dateTimeFilter = _a.dateTimeFilter);
					return [4 /*yield*/, getCollections()];
				case 1:
					collections = _c.sent();
					Translator = collections.collectionTranslators;
					dateTimeFilterMoment = getMomentUTC(dateTimeFilter);
					startOfMonth = dateTimeFilterMoment.startOf("month").format();
					endOfMonth = dateTimeFilterMoment.endOf("month").format();
					return [
						4 /*yield*/,
						Translator.findById(translatorId).populate({
							path: "personalPenalties",
							match: {
								dateTimeId: {
									$gte: startOfMonth,
									$lte: endOfMonth,
								},
							},
						}),
					];
				case 2:
					selectedTranslator = _c.sent();
					res.send(
						(_b =
							selectedTranslator === null || selectedTranslator === void 0
								? void 0
								: selectedTranslator.personalPenalties) !== null &&
							_b !== void 0
							? _b
							: [],
					);
					return [3 /*break*/, 4];
				case 3:
					error_8 = _c.sent();
					console.error(
						"An error occurred while getting personal penalties:",
						error_8,
					);
					res.status(500).send("An error occurred");
					return [3 /*break*/, 4];
				case 4:
					return [2 /*return*/];
			}
		});
	});
};
var toggleSuspendClientResolver = function (req, res) {
	return __awaiter(void 0, void 0, void 0, function () {
		var _a, translatorId, clientId, Client, client, error_9, errorMessage;
		return __generator(this, function (_b) {
			switch (_b.label) {
				case 0:
					_b.trys.push([0, 7, , 8]);
					(_a = req.body),
						(translatorId = _a.translatorId),
						(clientId = _a.clientId);
					if (!translatorId || !clientId) {
						return [
							2 /*return*/,
							res.status(400).send("Translator or client id is missing"),
						];
					}
					return [4 /*yield*/, getCollections().collectionClients];
				case 1:
					Client = _b.sent();
					return [4 /*yield*/, Client.findOne({ _id: clientId })];
				case 2:
					client = _b.sent();
					if (!client.suspendedTranslators.includes(translatorId))
						return [3 /*break*/, 4];
					return [
						4 /*yield*/,
						Client.updateOne(
							{ _id: clientId },
							{ $pull: { suspendedTranslators: translatorId } },
						),
					];
				case 3:
					_b.sent();
					res.status(200).send("Client unsuspended successfully");
					return [3 /*break*/, 6];
				case 4:
					return [
						4 /*yield*/,
						Client.updateOne(
							{ _id: clientId },
							{ $addToSet: { suspendedTranslators: translatorId } },
						),
					];
				case 5:
					_b.sent();
					res.status(200).send("Client suspended successfully");
					_b.label = 6;
				case 6:
					return [3 /*break*/, 8];
				case 7:
					error_9 = _b.sent();
					errorMessage = "An error occurred while toggling client suspension";
					console.error(errorMessage, error_9);
					res.status(500).send(errorMessage);
					return [3 /*break*/, 8];
				case 8:
					return [2 /*return*/];
			}
		});
	});
};
module.exports = {
	getAllTranslators: getAllTranslators,
	getLastVirtualGift: getLastVirtualGift,
	addNewTranslator: addNewTranslator,
	updateTranslator: updateTranslator,
	deleteTranslator: deleteTranslator,
	sendDailyEmails: sendDailyEmails,
	assignClientToTranslator: assignClientToTranslator,
	addPersonalPenaltyToTranslator: addPersonalPenaltyToTranslator,
	getPersonalPenalties: getPersonalPenalties,
	toggleSuspendClientResolver: toggleSuspendClientResolver,
};
