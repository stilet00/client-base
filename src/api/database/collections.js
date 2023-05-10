const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
)
let MongoClient = require('mongodb').MongoClient
const {
    createCurrentYearStatisticsForEveryTranslator,
} = require('../database-api/createCurrentYearStatisticsForEveryTranslator')
const {
    sendTaskNotificationEmailTemplatesToAdministrators,
} = require('../email-api/taskNotificationEmailAPI')
const { twentyHoursInMiliseconds } = require('../constants')
const client = new MongoClient(DB, { useUnifiedTopology: true })
const collections = {}
let outdatedTaskNotificationsInterval

async function taskNotificationsMailout() {
    const taskCollection = await collections.collectionTasks.find().toArray()
    sendTaskNotificationEmailTemplatesToAdministrators(taskCollection)
}

const connectToDatabase = async err => {
    await client.connect()
    console.log('Connected to MongoDB database')
    collections.collectionTasks = client.db('taskListDB').collection('tasks')
    collections.collectionBalance = client
        .db('taskListDB')
        .collection('totalBalance')
    collections.collectionTaskNotifications = client
        .db('taskListDB')
        .collection('notificationSwitch')
    collections.collectionClients = client.db('clientsDB').collection('clients')
    // collections.collectionClients = client
    //     .db('testDB')
    //     .collection('testClientCollection')
    // collections.collectionTranslators = client
    //     .db('testDB')
    //     .collection('testTranslatorCollection')
    collections.collectionTranslators = client
        .db('translatorsDB')
        .collection('translators')
    collections.collectionStatements = client
        .db('statementsDB')
        .collection('statements')
    createCurrentYearStatisticsForEveryTranslator(
        collections.collectionTranslators
    )
    try {
        collections.collectionTaskNotifications.find().toArray((err, docs) => {
            if (err) {
                throw new Error(err)
            }
            const taskNotificationsAreAllowed = docs[0]?.allowed
            if (taskNotificationsAreAllowed) {
                console.log(
                    'Task notifications are allowed, running mailout interval.'
                )
                outdatedTaskNotificationsInterval = setInterval(
                    taskNotificationsMailout,
                    twentyHoursInMiliseconds
                )
            }
        })
    } catch (error) {
        console.log(error)
    }
}
const getCollections = () => {
    return collections
}

module.exports = {
    connectToDatabase,
    getCollections,
    outdatedTaskNotificationsInterval,
}
