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
var _b = require("../controllers/taskController"),
	getAllTasks = _b.getAllTasks,
	deleteTask = _b.deleteTask,
	editTask = _b.editTask,
	createTask = _b.createTask;
var tasksURL = require("./routes").tasksURL;
var router = express_1.default.Router();
router.get(tasksURL + "get", isAuthenticated, getAllTasks);
router.delete(tasksURL + ":id", adminRules, deleteTask);
router.post(tasksURL + "add", isAuthenticated, createTask);
router.put(tasksURL + "edit/:id", isAuthenticated, editTask);
exports.default = router;
