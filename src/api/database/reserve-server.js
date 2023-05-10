// let express = require('express')
// const {
//     sendEmailTemplateToAdministrators,
//     sendEmailTemplateToTranslators,
// } = require('./src/api/email-api/financeEmailAPI')
// let bodyParser = require('body-parser')
// const {
//     checkIfUserIsAuthenticatedBeforeExecute,
// } = require('./src/api/firebase/firebaseAdmin')
// const {
//     connectToDatabase,
//     getCollections,
// } = require('./src/api/database/collections')
// const {
//     rootURL,
//     balanceURL,
//     clientsURL,
//     translatorsURL,
//     financeStatementsURL,
//     tasksURL,
// } = require('./src/api/routes/routes')
// const {
//     getLastVirtualGift,
//     getAllTranslators,
//     addNewTranslator,
//     updateTranslator,
//     deleteTranslator,
//     sendEmailsToTranslators,
//     balanceMailout
// } = require('./src/api/controllers/translatorController')
// const {
//     getAllTasks,
//     deleteTask,
//     editTask,
//     createTask,
//     sendNotification,
//     allowNotifications,
// } = require('./src/api/controllers/taskController')
// const {
//     getAllStatments,
//     createStatement,
//     deleteStatement,
// } = require('./src/api/controllers/statementController')
// const {
//     getAllClients,
//     addNewClient,
//     updateClient,
// } = require('./src/api/controllers/clientController')
// const {
//     getBalance,
//     uploadBalance,
//     deleteBalance,
//     updateBalance,
// } = require('./src/api/controllers/balanceController')

// const PORT = process.env.PORT || 80
// let app = express()
// app.use(express.static(__dirname + '/build'))

// app.set('view engine', 'ejs')

// app.use(bodyParser.json({ limit: '50mb' }))
// app.use(bodyParser.urlencoded({ limit: '50mb', extented: true }))
// app.use(function (request, response, next) {
//     response.setHeader('Access-Control-Allow-Origin', '*')
//     response.setHeader(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-type, Accept, Authorization'
//     )
//     response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
//     next()
// })

// //routes

// app.get(rootURL + 'chart/', function (request, response, next) {
//     response.sendFile(__dirname + '/build/index.html')
// })
// app.get(rootURL + 'chart?', function (request, response, next) {
//     response.sendFile(__dirname + '/build/index.html')
// })
// app.get(rootURL + 'overview/?', function (request, response, next) {
//     response.sendFile(__dirname + '/build/index.html')
// })
// app.get(rootURL + 'clients/true?', function (request, response, next) {
//     response.sendFile(__dirname + '/build/index.html')
// })
// app.get(rootURL + 'clients/?', function (request, response, next) {
//     response.sendFile(__dirname + '/build/index.html')
// })
// app.get(rootURL + 'tasks/?', function (request, response, next) {
//     response.sendFile(__dirname + '/build/index.html')
// })
// app.get(rootURL + 'translators/?', function (request, response, next) {
//     response.sendFile(__dirname + '/build/index.html')
// })
// app.get(rootURL + 'finances/?', function (request, response, next) {
//     response.sendFile(__dirname + '/build/index.html')
// })

// // task list api
// app.get(tasksURL + 'get', getAllTasks)
// app.delete(tasksURL + ':id', deleteTask)
// app.post(tasksURL + 'add', createTask)
// app.put(tasksURL + 'edit/:id', editTask)
// app.get(tasksURL + 'notifications/', sendNotification)
// app.put(tasksURL + 'notifications/', allowNotifications)

// // balance api
// app.get(balanceURL + 'get', getBalance)
// app.post(balanceURL + 'add', uploadBalance)
// app.delete(balanceURL + ':id', deleteBalance)
// app.put(balanceURL + ':id', updateBalance)

// //clients api
// app.get(clientsURL + 'get', getAllClients)
// app.post(clientsURL + 'add', addNewClient)
// // we do not delete clients 09.11.2022
// // app.delete(clientsURL + ':id', deleteClient)
// app.put(clientsURL + ':id', updateClient)

// // translators api
// const balanceMailout = async () => {
//     try {
//         const translatorsCollection = await getCollections()
//             .collectionTranslators.find()
//             .toArray()
//         if (translatorsCollection.length) {
//             const listOfTranslatorsWhoReceivedEmails =
//                 await sendEmailTemplateToTranslators(translatorsCollection)
//             sendEmailTemplateToAdministrators(translatorsCollection)
//             return listOfTranslatorsWhoReceivedEmails
//         } else {
//             return []
//         }
//     } catch (error) {
//         console.log(error)
//         return false
//     }
// }

// app.get(translatorsURL + 'get', getAllTranslators)
// app.get(translatorsURL + 'last-gift/:id', getLastVirtualGift)
// app.get(translatorsURL + 'send-emails', sendEmailsToTranslators)
// app.post(translatorsURL + 'add', addNewTranslator)
// app.put(translatorsURL + ':id', updateTranslator)
// app.delete(translatorsURL + ':id', deleteTranslator)

// app.post(translatorsURL + 'add', addNewTranslator)
// app.get(translatorsURL + 'send-emails', (request, response) => {
//     console.log(request.params)
//     checkIfUserIsAuthenticatedBeforeExecute({
//         callBack: () => {
//             console.log(request.params)
//             balanceMailout().then(emailsWereSentSuccessfully => {
//                 if (emailsWereSentSuccessfully.length) {
//                     return response.send(emailsWereSentSuccessfully)
//                 } else {
//                     return response.sendStatus(500)
//                 }
//             })
//         },
//         request,
//         response,
//     })
// })

// //statements api
// app.get(financeStatementsURL + 'get', getAllStatments)
// app.post(financeStatementsURL + 'add', createStatement)
// app.delete(financeStatementsURL + ':id', deleteStatement)

// // DB connection and server starts
// const startServer = async () => {
//     try {
//         await connectToDatabase()
//         app.listen(PORT, () => {
//             console.log('API started at port', PORT)
//         })
//     } catch (err) {
//         console.error('Failed to connect to MongoDB database', err)
//         process.exit(1)
//     }
// }
// startServer()
