import axios from 'axios'
import { rootURL } from '../rootURL'
import { getConfigForAxiosAuthenticatedRequest } from '../utils'

const tasksURL = rootURL + 'tasks/'

export function getTasks() {
    return axios.get(tasksURL + 'get/', getConfigForAxiosAuthenticatedRequest())
}

export function addTask(task) {
    return axios.post(
        tasksURL + 'add/',
        task,
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function removeTask(id) {
    return axios.delete(tasksURL + id, getConfigForAxiosAuthenticatedRequest())
}

export function changeTodoStatus(todo) {
    return axios.put(
        tasksURL + `edit/${todo._id}`,
        todo,
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function getTaskNotificationsSettings() {
    return axios.get(
        tasksURL + 'notifications/',
        getConfigForAxiosAuthenticatedRequest()
    )
}

export function changeTaskNotificationsSettings(
    taskNotificationsSettingsValue
) {
    const config = {
        allowed: taskNotificationsSettingsValue,
    }
    return axios.put(
        tasksURL + 'notifications/',
        config,
        getConfigForAxiosAuthenticatedRequest()
    )
}
