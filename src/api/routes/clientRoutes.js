"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var _a = require("../firebase/firebaseAdmin"),
	isAuthenticated = _a.isAuthenticated,
	adminRules = _a.adminRules;
var _b = require("../controllers/clientController"),
	getAllClients = _b.getAllClients,
	addNewClient = _b.addNewClient,
	updateClient = _b.updateClient,
	getClientsOverviewData = _b.getClientsOverviewData;
var clientsURL = require("./routes").clientsURL;
var router = express_1.default.Router();
router.get("".concat(clientsURL, "get"), isAuthenticated, getAllClients);
router.post("".concat(clientsURL, "add"), adminRules, addNewClient);
router.put("".concat(clientsURL, ":id"), isAuthenticated, updateClient);
router.get(
	"".concat(clientsURL, "overview"),
	isAuthenticated,
	getClientsOverviewData,
);
exports.default = router;
