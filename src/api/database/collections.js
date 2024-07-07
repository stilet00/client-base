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
var mongoose_1 = __importDefault(require("mongoose"));
var businessAdminsDatabaseModels_1 = require("../models/businessAdminsDatabaseModels");
if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
	throw new Error(
		"DATABASE and DATABASE_PASSWORD environment variables are required",
	);
}
var DBConnectionCredentials = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD,
);
var changeDatabaseInConnectionString =
	require("./utils").changeDatabaseInConnectionString;
var TaskSchema = require("../models/taskListDatabaseModels").TaskSchema;
var ClientSchema = require("../models/clientsDatabase").ClientSchema;
var _a = require("../models/translatorsDatabaseModels"),
	TranslatorSchema = _a.TranslatorSchema,
	BalanceDaySchema = _a.BalanceDaySchema;
var PaymentSchema = require("../models/statementsDatabaseModels").PaymentSchema;
var AdminSchema = require("../models/adminDatabaseModels").AdminSchema;
var collections = new Map();
var CollectionNames;
(function (CollectionNames) {
	CollectionNames["CollectionTasks"] = "collectionTasks";
	CollectionNames["CollectionClients"] = "collectionClients";
	CollectionNames["CollectionTranslators"] = "collectionTranslators";
	CollectionNames["CollectionStatements"] = "collectionStatements";
	CollectionNames["CollectionAdmins"] = "collectionAdmins";
	CollectionNames["CollectionBalanceDays"] = "collectionBalanceDays";
	CollectionNames["CollectionBusinessAdmins"] = "collectionBusinessAdmins";
})(CollectionNames || (CollectionNames = {}));
var connectToDatabase = function () {
	return __awaiter(void 0, void 0, void 0, function () {
		var clientBaseDB,
			Task,
			Client,
			Translator,
			Admin,
			Statement,
			BalanceDay,
			BusinessAdmin;
		return __generator(this, function (_a) {
			try {
				clientBaseDB = mongoose_1.default.createConnection(
					changeDatabaseInConnectionString(
						DBConnectionCredentials,
						"clientBase",
					),
				);
				Task = clientBaseDB.model("Task", TaskSchema, "tasksCollection");
				Client = clientBaseDB.model(
					"Client",
					ClientSchema,
					"clientsCollection",
				);
				Translator = clientBaseDB.model(
					"Translator",
					TranslatorSchema,
					"translatorCollection",
				);
				Admin = clientBaseDB.model("Admin", AdminSchema, "adminCollection");
				Statement = clientBaseDB.model(
					"Statement",
					new mongoose_1.default.Schema(PaymentSchema, {
						collection: "statementsCollection",
					}),
				);
				BalanceDay = clientBaseDB.model(
					"BalanceDay",
					BalanceDaySchema,
					"balanceDayCollection",
				);
				BusinessAdmin = clientBaseDB.model(
					"BusinessAdmin",
					businessAdminsDatabaseModels_1.BusinessAdminSchema,
					"businessAdminsCollection",
				);
				collections.set("collectionTasks", Task);
				collections.set("collectionClients", Client);
				collections.set("collectionClientsOnTranslators", Client);
				collections.set("collectionTranslators", Translator);
				collections.set("collectionAdmins", Admin);
				collections.set("collectionStatements", Statement);
				collections.set("collectionBalanceDays", BalanceDay);
				collections.set("collectionBusinessAdmins", BusinessAdmin);
			} catch (error) {
				console.error(error);
			}
			return [2 /*return*/];
		});
	});
};
var getCollections = function () {
	return Object.values(CollectionNames).reduce(function (
		collectionsObject,
		collectionName,
	) {
		collectionsObject[collectionName] = collections.get(collectionName);
		return collectionsObject;
	}, {});
};
module.exports = {
	connectToDatabase: connectToDatabase,
	getCollections: getCollections,
};
