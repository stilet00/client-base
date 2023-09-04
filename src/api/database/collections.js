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
const collections = new Map()
let outdatedTaskNotificationsInterval

async function taskNotificationsMailout() {
    const taskCollection = await collections
        .get('collectionTasks')
        .find()
        .toArray()
    sendTaskNotificationEmailTemplatesToAdministrators(taskCollection)
}

const connectToDatabase = async err => {
    await client.connect()
    console.log('Connected to MongoDB database')
    collections.set(
        'collectionTasks',
        client.db('taskListDB').collection('tasks')
    )
    collections.set(
        'collectionBalance',
        client.db('taskListDB').collection('totalBalance')
    )
    collections.set(
        'collectionTaskNotifications',
        client.db('taskListDB').collection('notificationSwitch')
    )
    collections.set(
        'collectionClients',
        client.db('clientsDB').collection('clients')
    )
    collections.set(
        'collectionTranslators',
        client.db('translatorsDB').collection('translators')
    )
    collections.set(
        'collectionAdmins',
        client.db('adminDB').collection('adminCollection')
    )
    // collections.set(
    //     'collectionClients',
    //     client.db('testDB').collection('testClientCollection')
    // )
    // collections.set(
    //     'collectionTranslators',
    //     client.db('testDB').collection('testTranslatorCollection')
    // )
    collections.set(
        'collectionStatements',
        client.db('statementsDB').collection('statements')
    )
    createCurrentYearStatisticsForEveryTranslator(
        collections.get('collectionTranslators')
    )
    try {
        collections
            .get('collectionTaskNotifications')
            .find()
            .toArray((err, docs) => {
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
