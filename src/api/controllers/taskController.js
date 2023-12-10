const {
    sendTaskNotificationEmailTemplatesToAdministrators,
} = require('../email-api/taskNotificationEmailAPI')
const { getCollections } = require('../database/collections')
const { twentyHoursInMiliseconds } = require('../constants')
let ObjectId = require('mongodb').ObjectID

const getAllTasks = async (request, response) => {
    const tasksCollection = await getCollections().collectionTasks.find().exec()
    response.send(tasksCollection)
}

const editTask = async (request, response) => {
    const Task = await getCollections().collectionTasks
    try {
        await Task.updateOne(
            { _id: request.params.id },
            {
                $set: {
                    completed: request.body.completed,
                    doneAt: request.body.doneAt,
                },
            }
        )
        response.sendStatus(200)
    } catch (err) {
        console.log(err)
        response.sendStatus(500)
    }
}

const deleteTask = async (request, response) => {
    const Task = await getCollections().collectionTasks
    try {
        await Task.deleteOne({ _id: request.params.id })
        response.sendStatus(200)
    } catch (err) {
        console.log(err)
        response.sendStatus(500)
    }
}

const createTask = async (request, response) => {
    if (request.body?.taskName) {
        const Task = await getCollections().collectionTasks
        const taskCreateInput = { ...request.body }
        try {
            const result = await Task.create(taskCreateInput)
            response.send(result._id)
        } catch (err) {
            response.sendStatus(500)
        }
    } else {
        response.send('No task task name')
    }
}

const sendNotification = async (request, response) => {
    const notificationCollection = await getCollections()
        .collectionTaskNotifications.find()
        .exec()
    response.send(notificationCollection)
}

let outdatedTaskNotificationsInterval

async function taskNotificationsMailout() {
    const taskCollection = await getCollections().collectionTasks.find().exec()
    sendTaskNotificationEmailTemplatesToAdministrators(taskCollection)
}

const allowNotifications = (request, response) => {
    const taskNotificationsAreAllowed = request.body.allowed
    if (taskNotificationsAreAllowed) {
        outdatedTaskNotificationsInterval = setInterval(
            taskNotificationsMailout,
            twentyHoursInMiliseconds
        )
    }
    if (!taskNotificationsAreAllowed) {
        clearInterval(outdatedTaskNotificationsInterval)
    }
    const notificationSettingsDatabaseId = '6346e3ed4620ec03ee702c34'
    getCollections().collectionTaskNotifications.updateOne(
        { _id: ObjectId(notificationSettingsDatabaseId) },
        {
            $set: {
                allowed: request.body.allowed,
            },
        },
        err => {
            if (err) {
                return response.sendStatus(500)
            }
            response.sendStatus(200)
        }
    )
}
module.exports = {
    getAllTasks,
    deleteTask,
    editTask,
    createTask,
    sendNotification,
    allowNotifications,
}
