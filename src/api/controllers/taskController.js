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

const deleteTask = (request, response) => {
    getCollections().collectionTasks.deleteOne(
        { _id: ObjectId(request.params.id) },
        (err, docs) => {
            if (err) {
                console.log(err)
                return response.sendStatus(500)
            }
            response.sendStatus(200)
        }
    )
}

const editTask = (request, response) => {
    getCollections().collectionTasks.updateOne(
        { _id: ObjectId(request.params.id) },
        {
            $set: {
                completed: request.body.completed,
                doneAt: request.body.doneAt,
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

const createTask = (request, response) => {
    if (request.body.taskName) {
        const task = { ...request.body }
        getCollections().collectionTasks.insertOne(task, (err, result) => {
            if (err) {
                return response.sendStatus(500)
            } else {
                response.send(result.ops[0]._id)
            }
        })
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
