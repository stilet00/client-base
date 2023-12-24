const DBConnectionCredentials = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
)
const mongoose = require('mongoose')
const { changeDatabaseInConnectionString } = require('./utils')
const { taskSchema } = require('../models/taskListDatabaseModels')
const { clientSchema } = require('../models/clientsDatabase')
const { translatorSchema } = require('../models/translatorsDatabaseModels')
const { PaymentSchema } = require('../models/statementsDatabaseModels')

const collections = new Map()

const connectToDatabase = async () => {
    try {
        const clientBaseDB = mongoose.createConnection(
            changeDatabaseInConnectionString(
                DBConnectionCredentials,
                'clientBase'
            )
        )
        const Task = clientBaseDB.model('Task', taskSchema, 'tasksCollection')
        const Client = clientBaseDB.model(
            'Client',
            clientSchema,
            'clientsCollection'
        )
        const Translator = clientBaseDB.model(
            'Translator',
            translatorSchema,
            'translatorCollection'
        )
        const Admin = clientBaseDB.model(
            'Admin',
            new mongoose.Schema({}, { collection: 'adminCollection' })
        )
        const Statement = clientBaseDB.model(
            'Statement',
            new mongoose.Schema(PaymentSchema, {
                collection: 'statementsCollection',
            })
        )
        collections.set('collectionTasks', Task)
        collections.set('collectionClients', Client)
        collections.set('collectionClientsOnTranslators', Client)
        collections.set('collectionTranslators', Translator)
        collections.set('collectionAdmins', Admin)
        collections.set('collectionStatements', Statement)
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
}
