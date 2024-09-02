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
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var _a = require("./src/api/firebase/firebaseAdmin"),
	isAuthenticated = _a.isAuthenticated,
	adminRules = _a.adminRules;
var connectToDatabase =
	require("./src/api/database/collections").connectToDatabase;
var _b = require("./src/api/routes/routes"),
	rootURL = _b.rootURL,
	clientsURL = _b.clientsURL,
	translatorsURL = _b.translatorsURL,
	financeStatementsURL = _b.financeStatementsURL,
	tasksURL = _b.tasksURL,
	balanceDayURL = _b.balanceDayURL,
	personalPenaltiesURL = _b.personalPenaltiesURL;
var _c = require("./src/api/controllers/translatorController"),
	getLastVirtualGift = _c.getLastVirtualGift,
	getAllTranslators = _c.getAllTranslators,
	addNewTranslator = _c.addNewTranslator,
	updateTranslator = _c.updateTranslator,
	deleteTranslator = _c.deleteTranslator,
	sendEmailsToTranslators = _c.sendEmailsToTranslators,
	assignClientToTranslator = _c.assignClientToTranslator,
	addPersonalPenaltyToTranslator = _c.addPersonalPenaltyToTranslator,
	getPersonalPenalties = _c.getPersonalPenalties,
	toggleSuspendClientResolver = _c.toggleSuspendClientResolver;
var _d = require("./src/api/controllers/taskController"),
	getAllTasks = _d.getAllTasks,
	deleteTask = _d.deleteTask,
	editTask = _d.editTask,
	createTask = _d.createTask;
var _e = require("./src/api/controllers/statementController"),
	getAllStatements = _e.getAllStatements,
	createStatement = _e.createStatement,
	deleteStatement = _e.deleteStatement;
var _f = require("./src/api/controllers/clientController"),
	getAllClients = _f.getAllClients,
	addNewClient = _f.addNewClient,
	updateClient = _f.updateClient;
var changeUserPassword =
	require("./src/api/firebase/firebaseAdmin").changeUserPassword;
var getCollections = require("./src/api/database/collections").getCollections;
var _g = require("./src/api/controllers/balanceDayController"),
	getBalanceDay = _g.getBalanceDay,
	createBalanceDay = _g.createBalanceDay,
	updateBalanceDay = _g.updateBalanceDay,
	getBalanceDaysForTranslators = _g.getBalanceDaysForTranslators,
	getAllBalanceDays = _g.getAllBalanceDays,
	getCurrentMonthTotal = _g.getCurrentMonthTotal,
	getBalanceDayForSelectedDate = _g.getBalanceDayForSelectedDate;
var rateLimit = require("express-rate-limit");
var PORT = process.env.PORT || 80;
var app = express();
var limiter = rateLimit({
	windowMs: 2000,
	max: 100,
	message: "Too many requests from this IP, please try again later.",
});
app.use(express.static(__dirname + "/build"));
app.set("view engine", "ejs");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(function (request, response, next) {
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-type, Accept, Authorization",
	);
	response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	next();
});
app.use(limiter);
//routes
app.get(rootURL + "chart/", function (request, response, next) {
	response.sendFile(__dirname + "/build/index.html");
});
app.get(rootURL + "chart?", function (request, response, next) {
	response.sendFile(__dirname + "/build/index.html");
});
app.get(rootURL + "overview/?", function (request, response, next) {
	response.sendFile(__dirname + "/build/index.html");
});
app.get(rootURL + "clients/true?", function (request, response, next) {
	response.sendFile(__dirname + "/build/index.html");
});
app.get(rootURL + "clients/?", function (request, response, next) {
	response.sendFile(__dirname + "/build/index.html");
});
app.get(rootURL + "tasks/?", function (request, response, next) {
	response.sendFile(__dirname + "/build/index.html");
});
app.get(rootURL + "translators/?", function (request, response, next) {
	response.sendFile(__dirname + "/build/index.html");
});
app.get(rootURL + "finances/?", function (request, response, next) {
	response.sendFile(__dirname + "/build/index.html");
});
// password change
app.post(rootURL + "reset-password", function (request, response) {
	changeUserPassword(request, response);
});
// permision check
app.post(rootURL + "isAdmin", function (request, response) {
	return __awaiter(void 0, void 0, void 0, function () {
		var userEmail, admin;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					userEmail = request.body.email;
					return [
						4 /*yield*/,
						getCollections().collectionAdmins.findOne({
							registeredEmail: userEmail,
						}),
					];
				case 1:
					admin = _a.sent();
					response.send(!!admin); // Send true if admin exists, false otherwise
					return [2 /*return*/];
			}
		});
	});
});
// task list api
app.get(tasksURL + "get", isAuthenticated, getAllTasks);
app.delete(tasksURL + ":id", __spreadArray([], adminRules, true), deleteTask);
app.post(tasksURL + "add", isAuthenticated, createTask);
app.put(tasksURL + "edit/:id", isAuthenticated, editTask);
// clients api
app.get(clientsURL + "get", isAuthenticated, getAllClients);
app.post(clientsURL + "add", __spreadArray([], adminRules, true), addNewClient);
app.put(clientsURL + ":id", isAuthenticated, updateClient);
// translators api
app.get(translatorsURL + "get", isAuthenticated, getAllTranslators);
app.get(translatorsURL + "last-gift/:id", isAuthenticated, getLastVirtualGift);
app.get(
	translatorsURL + "send-emails",
	__spreadArray([], adminRules, true),
	sendEmailsToTranslators,
);
app.post(
	translatorsURL + "add",
	__spreadArray([], adminRules, true),
	addNewTranslator,
);
app.put(
	translatorsURL + "suspend-client",
	__spreadArray([], adminRules, true),
	toggleSuspendClientResolver,
);
app.put(
	translatorsURL + "assign-client",
	isAuthenticated,
	assignClientToTranslator,
);
app.put(
	translatorsURL + ":id",
	__spreadArray([], adminRules, true),
	updateTranslator,
);
app.delete(
	translatorsURL + ":id",
	__spreadArray([], adminRules, true),
	deleteTranslator,
);
// personal penalties api
app.post(
	personalPenaltiesURL + "create",
	__spreadArray([], adminRules, true),
	addPersonalPenaltyToTranslator,
);
app.get(personalPenaltiesURL + "get", getPersonalPenalties);
// statements api
app.get(financeStatementsURL + "get", isAuthenticated, getAllStatements);
app.post(
	financeStatementsURL + "add",
	__spreadArray([], adminRules, true),
	createStatement,
);
app.delete(
	financeStatementsURL + ":id",
	__spreadArray([], adminRules, true),
	deleteStatement,
);
// balance day api
app.post(balanceDayURL + "create", isAuthenticated, createBalanceDay);
app.put(balanceDayURL + "update", isAuthenticated, updateBalanceDay);
app.get(
	balanceDayURL + "translators",
	isAuthenticated,
	getBalanceDaysForTranslators,
);
app.get(balanceDayURL + "all", isAuthenticated, getAllBalanceDays);
app.get(balanceDayURL, isAuthenticated, getBalanceDay);
app.get(
	balanceDayURL + "current-month-total",
	isAuthenticated,
	getCurrentMonthTotal,
);
app.get(
	balanceDayURL + "clients-statistics",
	isAuthenticated,
	getAllBalanceDays,
);
app.get(
	balanceDayURL + "selected-date",
	isAuthenticated,
	getBalanceDayForSelectedDate,
);
// DB connection and server starts
var startServer = function () {
	return __awaiter(void 0, void 0, void 0, function () {
		var err_1;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					_a.trys.push([0, 2, , 3]);
					return [4 /*yield*/, connectToDatabase()];
				case 1:
					_a.sent();
					app.listen(PORT, function () {
						console.log("Sunrise Agency API started at port", PORT);
					});
					return [3 /*break*/, 3];
				case 2:
					err_1 = _a.sent();
					console.error(err_1);
					process.exit(1);
					return [3 /*break*/, 3];
				case 3:
					return [2 /*return*/];
			}
		});
	});
};
startServer();
