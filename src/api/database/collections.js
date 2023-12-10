const DBConnectionCredentials = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
)
const mongoose = require('mongoose')
const {
    createCurrentYearStatisticsForEveryTranslator,
} = require('../database-api/createCurrentYearStatisticsForEveryTranslator')
const { changeDatabaseInConnectionString } = require('./utils')
const {
    sendTaskNotificationEmailTemplatesToAdministrators,
} = require('../email-api/taskNotificationEmailAPI')
const { twentyHoursInMiliseconds } = require('../constants')
const { taskSchema } = require('../models/index')
const collections = new Map()
let outdatedTaskNotificationsInterval

async function taskNotificationsMailout() {
    const taskCollection = await collections
        .get('collectionTasks')
        .find()
        .exec()
    sendTaskNotificationEmailTemplatesToAdministrators(taskCollection)
}

const connectToDatabase = async () => {
    try {
        const adminDB = mongoose.createConnection(
            changeDatabaseInConnectionString(DBConnectionCredentials, 'adminDB')
        )
        const clientsDB = mongoose.createConnection(
            changeDatabaseInConnectionString(
                DBConnectionCredentials,
                'clientsDB'
            )
        )
        const statementsDB = mongoose.createConnection(
            changeDatabaseInConnectionString(
                DBConnectionCredentials,
                'statementsDB'
            )
        )
        const taskListDB = mongoose.createConnection(
            changeDatabaseInConnectionString(
                DBConnectionCredentials,
                'taskListDB'
            )
        )
        const translatorsDB = mongoose.createConnection(
            changeDatabaseInConnectionString(
                DBConnectionCredentials,
                'translatorsDB'
            )
        )

        const Task = taskListDB.model('Task', taskSchema, 'tasks')
        const TaskNotification = taskListDB.model(
            'TaskNotification',
            new mongoose.Schema({}, { collection: 'notificationSwitch' })
        )
        const Client = clientsDB.model(
            'Client',
            new mongoose.Schema({}, { collection: 'clients' })
        )
        const Translator = translatorsDB.model(
            'Translator',
            new mongoose.Schema({}, { collection: 'translators' })
        )
        const Admin = adminDB.model(
            'Admin',
            new mongoose.Schema({}, { collection: 'adminCollection' })
        )
        const Statement = statementsDB.model(
            'Statement',
            new mongoose.Schema({}, { collection: 'statements' })
        )

        collections.set('collectionTasks', Task)
        collections.set('collectionClients', Client)
        collections.set('collectionTranslators', Translator)
        collections.set('collectionAdmins', Admin)
        collections.set('collectionStatements', Statement)
        collections.set('collectionTaskNotifications', TaskNotification)

        // createCurrentYearStatisticsForEveryTranslator(collectionTranslators)
    } catch (error) {
        console.log(error)
    }
}

const getCollections = () => {
    return {
        collectionTasks: collections.get('collectionTasks'),
        collectionBalance: collections.get('collectionBalance'),
        collectionTaskNotifications: collections.get(
            'collectionTaskNotifications'
        ),
        collectionClients: collections.get('collectionClients'),
        collectionTranslators: collections.get('collectionTranslators'),
        collectionStatements: collections.get('collectionStatements'),
        collectionAdmins: collections.get('collectionAdmins'),
    }
}

module.exports = {
    connectToDatabase,
    getCollections,
    outdatedTaskNotificationsInterval,
}
