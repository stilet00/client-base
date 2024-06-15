import requestWithAuth from "../superAgentConfig";
import { rootURL } from "../rootURL";

const tasksURL = `${rootURL}tasks/`;

export function getTasks() {
	return requestWithAuth("get", `${tasksURL}get/`);
}

export function addTask(task) {
	return requestWithAuth("post", `${tasksURL}add/`).send(task);
}

export function removeTask(id) {
	return requestWithAuth("delete", `${tasksURL}${id}`);
}

export function changeTodoStatus(todo) {
	return requestWithAuth("put", `${tasksURL}edit/${todo._id}`).send(todo);
}
