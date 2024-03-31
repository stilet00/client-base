const DBConnectionCredentials = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
)
const mongoose = require('mongoose')
const { changeDatabaseInConnectionString } = require('./utils')
const { TaskSchema } = require('../models/taskListDatabaseModels')
const { ClientSchema } = require('../models/clientsDatabase')
const {
    TranslatorSchema,
    BalanceDaySchema,
} = require('../models/translatorsDatabaseModels')
const { PaymentSchema } = require('../models/statementsDatabaseModels')
const { AdminSchema } = require('../models/adminDatabaseModels')

const collections = new Map()

const connectToDatabase = async () => {
    try {
        const clientBaseDB = mongoose.createConnection(
            changeDatabaseInConnectionString(
                DBConnectionCredentials,
                'clientBase'
            )
        )
        const Task = clientBaseDB.model('Task', TaskSchema, 'tasksCollection')
        const Client = clientBaseDB.model(
            'Client',
            ClientSchema,
            'clientsCollection'
        )
        const Translator = clientBaseDB.model(
            'Translator',
            TranslatorSchema,
            'translatorCollection'
        )
        const Admin = clientBaseDB.model(
            'Admin',
            AdminSchema,
            'adminCollection'
        )
        const Statement = clientBaseDB.model(
            'Statement',
            new mongoose.Schema(PaymentSchema, {
                collection: 'statementsCollection',
            })
        )
        const BalanceDay = clientBaseDB.model(
            'BalanceDay',
            BalanceDaySchema,
            'balanceDayCollection'
        )
        collections.set('collectionTasks', Task)
        collections.set('collectionClients', Client)
        collections.set('collectionClientsOnTranslators', Client)
        collections.set('collectionTranslators', Translator)
        collections.set('collectionAdmins', Admin)
        collections.set('collectionStatements', Statement)
        collections.set('collectionBalanceDays', BalanceDay)
    } catch (error) {
        console.error(error)
    }
}

const COLLECTION_NAMES = [
    'collectionTasks',
    'collectionBalance',
    'collectionTaskNotifications',
    'collectionClients',
    'collectionTranslators',
    'collectionStatements',
    'collectionAdmins',
    'collectionBalanceDays',
]

const getCollections = () => {
    return COLLECTION_NAMES.reduce((collectionsObject, collectionName) => {
        collectionsObject[collectionName] = collections.get(collectionName)
        return collectionsObject
    }, {})
}

module.exports = {
    connectToDatabase,
    getCollections,
}
