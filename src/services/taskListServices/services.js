import axios from "axios"
const tasksURL = "http://localhost:80/tasks/"
export function getTasks() {
    return axios.get(tasksURL)
}
export function addTask(task) {
    return axios.post(tasksURL + "add", task)
}
export function removeTask(id) {
    return axios.delete(tasksURL + id)
}
export function changeTodoStatus(todo) {
    return axios.put(tasksURL + todo._id, todo)
}