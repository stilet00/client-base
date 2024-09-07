import express from "express";
const { isAuthenticated, adminRules } = require("../firebase/firebaseAdmin");
const {
	getAllTasks,
	deleteTask,
	editTask,
	createTask,
} = require("../controllers/taskController");
const { tasksURL } = require("./routes");

const router = express.Router();

router.get(tasksURL + "get", isAuthenticated, getAllTasks);
router.delete(tasksURL + ":id", adminRules, deleteTask);
router.post(tasksURL + "add", isAuthenticated, createTask);
router.put(tasksURL + "edit/:id", isAuthenticated, editTask);

export default router;
