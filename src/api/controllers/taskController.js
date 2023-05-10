const {
    checkIfUserIsAuthenticatedBeforeExecute,
} = require('../firebase/firebaseAdmin')
const {
    sendTaskNotificationEmailTemplatesToAdministrators,
} = require('../email-api/taskNotificationEmailAPI')
const { getCollections } = require('../database/collections')
const { twentyHoursInMiliseconds } = require('../constants')
let ObjectId = require('mongodb').ObjectID

const getAllTasks = (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            getCollections()
                .collectionTasks.find()
                .toArray((err, docs) => {
                    if (err) {
                        console.log(err)
                        return response.sendStatus(500)
                    }
                    response.send(docs)
                })
        },
        request,
        response,
    })
}

const deleteTask = (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
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
        },
        request,
        response,
    })
}

const editTask = (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
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
        },
        request,
        response,
    })
}

const createTask = (request, response) => {
    if (request.body.taskName) {
        checkIfUserIsAuthenticatedBeforeExecute({
            callBack: () => {
                const task = { ...request.body }
                getCollections().collectionTasks.insertOne(
                    task,
                    (err, result) => {
                        if (err) {
                            return response.sendStatus(500)
                        } else {
                            response.send(result.ops[0]._id)
                        }
                    }
                )
            },
            request,
            response,
        })
    } else {
        response.send('No task task name')
    }
}
const sendNotification = (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            getCollections()
                .collectionTaskNotifications.find()
                .toArray((err, docs) => {
                    if (err) {
                        console.log(err)
                        return response.sendStatus(500)
                    }
                    response.send(docs)
                })
        },
        request,
        response,
    })
}

let outdatedTaskNotificationsInterval

async function taskNotificationsMailout() {
    const taskCollection = await getCollections()
        .collectionTasks.find()
        .toArray()
    sendTaskNotificationEmailTemplatesToAdministrators(taskCollection)
}

const allowNotifications = (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
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
        },
        request,
        response,
    })
}
module.exports = {
    getAllTasks,
    deleteTask,
    editTask,
    createTask,
    sendNotification,
    allowNotifications,
}
