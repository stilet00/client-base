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
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
var path_1 = __importDefault(require("path"));
var authRoutes_1 = __importDefault(require("./src/api/routes/authRoutes"));
var clientRoutes_1 = __importDefault(require("./src/api/routes/clientRoutes"));
var translatorRoutes_1 = __importDefault(
	require("./src/api/routes/translatorRoutes"),
);
var taskRoutes_1 = __importDefault(require("./src/api/routes/taskRoutes"));
var statementRoutes_1 = __importDefault(
	require("./src/api/routes/statementRoutes"),
);
var balanceDayRoutes_1 = __importDefault(
	require("./src/api/routes/balanceDayRoutes"),
);
var staticRoutes_1 = __importDefault(require("./src/api/routes/staticRoutes"));
var businessAdminsRoutes_1 = __importDefault(
	require("./src/api/routes/businessAdminsRoutes"),
);
var chartsRoutes_1 = __importDefault(require("./src/api/routes/chartsRoutes"));
var overviewRoutes_1 = __importDefault(
	require("./src/api/routes/overviewRoutes"),
);
var rootURL = require("./src/api/routes/routes").rootURL;
var connectToDatabase =
	require("./src/api/database/collections").connectToDatabase;
var rootURLOptions = {
	staging: "https://sunrise-agency-staging-73929348db48.herokuapp.com",
	production: "https://sunrise-agency.herokuapp.com",
	development: "http://localhost:3000",
};
var currentEnvironment = process.env.NODE_ENV || "development";
var frontEndURL = rootURLOptions[currentEnvironment];
var PORT = process.env.PORT || 80;
var app = (0, express_1.default)();
var corsOptions = {
	origin: frontEndURL,
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	allowedHeaders: [
		"Origin",
		"X-Requested-With",
		"Content-Type",
		"Accept",
		"Authorization",
	],
	preflightContinue: false,
	optionsSuccessStatus: 204,
};
var limiter = (0, express_rate_limit_1.default)({
	windowMs: 2000,
	max: 100,
	message: "Too many requests from this IP, please try again later.",
});
app.use((0, cors_1.default)(corsOptions));
app.options("*", function (req, res) {
	res.setHeader("Access-Control-Allow-Origin", frontEndURL);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET,HEAD,PUT,PATCH,POST,DELETE",
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		req.header("Access-Control-Request-Headers") || "",
	);
	res.sendStatus(204);
});
app.use(express_1.default.static(path_1.default.join(__dirname, "build")));
app.set("view engine", "ejs");
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "50mb", extended: true }));
app.get("".concat(rootURL, "chart/?"), function (request, response, next) {
	response.sendFile("".concat(__dirname, "/build/index.html"));
});
app.get("".concat(rootURL, "overview/?"), function (request, response, next) {
	response.sendFile("".concat(__dirname, "/build/index.html"));
});
app.get(
	"".concat(rootURL, "clients/true?"),
	function (request, response, next) {
		response.sendFile("".concat(__dirname, "/build/index.html"));
	},
);
app.get("".concat(rootURL, "clients/?"), function (request, response, next) {
	response.sendFile("".concat(__dirname, "/build/index.html"));
});
app.get("".concat(rootURL, "tasks/?"), function (request, response, next) {
	response.sendFile("".concat(__dirname, "/build/index.html"));
});
app.get(
	"".concat(rootURL, "translators/?"),
	function (request, response, next) {
		response.sendFile("".concat(__dirname, "/build/index.html"));
	},
);
app.get("".concat(rootURL, "finances/?"), function (request, response, next) {
	response.sendFile("".concat(__dirname, "/build/index.html"));
});
app.get(
	"".concat(rootURL, "business-admins/?"),
	function (request, response, next) {
		response.sendFile("".concat(__dirname, "/build/index.html"));
	},
);
app.use(authRoutes_1.default);
app.use(clientRoutes_1.default);
app.use(translatorRoutes_1.default);
app.use(taskRoutes_1.default);
app.use(statementRoutes_1.default);
app.use(balanceDayRoutes_1.default);
app.use(businessAdminsRoutes_1.default);
app.use(staticRoutes_1.default);
app.use(chartsRoutes_1.default);
app.use(overviewRoutes_1.default);
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
