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
	updateClient = _b.updateClient;
var clientsURL = require("./routes").clientsURL;
var router = express_1.default.Router();
router.get(clientsURL + "get", isAuthenticated, getAllClients);
router.post(clientsURL + "add", adminRules, addNewClient);
router.put(clientsURL + ":id", isAuthenticated, updateClient);
exports.default = router;
