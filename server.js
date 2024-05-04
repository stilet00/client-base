let express = require('express')
let bodyParser = require('body-parser')
const {
    isAuthenticated,
    adminRules,
} = require('./src/api/firebase/firebaseAdmin')
const { connectToDatabase } = require('./src/api/database/collections')
const {
    rootURL,
    clientsURL,
    translatorsURL,
    financeStatementsURL,
    tasksURL,
} = require('./src/api/routes/routes')
const {
    getLastVirtualGift,
    getAllTranslators,
    addNewTranslator,
    updateTranslator,
    deleteTranslator,
    sendEmailsToTranslators,
    calculateBonuses,
} = require('./src/api/controllers/translatorController')
const {
    getAllTasks,
    deleteTask,
    editTask,
    createTask,
    sendNotification,
    allowNotifications,
} = require('./src/api/controllers/taskController')
const {
    getAllStatments,
    createStatement,
    deleteStatement,
} = require('./src/api/controllers/statementController')
const {
    getAllClients,
    addNewClient,
    updateClient,
} = require('./src/api/controllers/clientController')
const { changeUserPassword } = require('./src/api/firebase/firebaseAdmin')
const { getCollections } = require('./src/api/database/collections')
const rateLimit = require('express-rate-limit')

const PORT = process.env.PORT || 80
let app = express()

const limiter = rateLimit({
    windowMs: 2000,
    max: 10,
    message: 'Too many requests from this IP, please try again later.',
})

app.use(express.static(__dirname + '/build'))
app.set('view engine', 'ejs')
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-type, Accept, Authorization'
    )
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    next()
})
app.use(limiter)

//routes
app.get(rootURL + 'chart/', function (request, response, next) {
    response.sendFile(__dirname + '/build/index.html')
})
app.get(rootURL + 'chart?', function (request, response, next) {
    response.sendFile(__dirname + '/build/index.html')
})
app.get(rootURL + 'overview/?', function (request, response, next) {
    response.sendFile(__dirname + '/build/index.html')
})
app.get(rootURL + 'clients/true?', function (request, response, next) {
    response.sendFile(__dirname + '/build/index.html')
})
app.get(rootURL + 'clients/?', function (request, response, next) {
    response.sendFile(__dirname + '/build/index.html')
})
app.get(rootURL + 'tasks/?', function (request, response, next) {
    response.sendFile(__dirname + '/build/index.html')
})
app.get(rootURL + 'translators/?', function (request, response, next) {
    response.sendFile(__dirname + '/build/index.html')
})
app.get(rootURL + 'finances/?', function (request, response, next) {
    response.sendFile(__dirname + '/build/index.html')
})

// password change
app.post(rootURL + 'reset-password', (req, res) => {
    changeUserPassword(req, res)
})

// permision check
app.post(rootURL + 'isAdmin', async (req, res) => {
    const userEmail = req.body.email
    const admin = await getCollections().collectionAdmins.findOne({
        registeredEmail: userEmail,
    })

    res.send(!!admin) // Send true if admin exists, false otherwise
})

// task list api
app.get(tasksURL + 'get', isAuthenticated, getAllTasks)
app.delete(tasksURL + ':id', [...adminRules], deleteTask)
app.post(tasksURL + 'add', isAuthenticated, createTask)
app.put(tasksURL + 'edit/:id', isAuthenticated, editTask)
app.get(tasksURL + 'notifications/', isAuthenticated, sendNotification)
app.put(tasksURL + 'notifications/', isAuthenticated, allowNotifications)

// clients api
app.get(clientsURL + 'get', isAuthenticated, getAllClients)
app.post(clientsURL + 'add', [...adminRules], addNewClient)
app.put(clientsURL + ':id', isAuthenticated, updateClient)

// translators api
app.get(translatorsURL + 'get', isAuthenticated, getAllTranslators)
app.get(translatorsURL + 'last-gift/:id', isAuthenticated, getLastVirtualGift)
app.get(
    translatorsURL + 'send-emails',
    [...adminRules],
    sendEmailsToTranslators
)
app.post(translatorsURL + 'add', [...adminRules], addNewTranslator)
app.post(translatorsURL + 'chat-bonus', isAuthenticated, calculateBonuses)
app.put(translatorsURL + ':id', [...adminRules], updateTranslator)
app.delete(translatorsURL + ':id', [...adminRules], deleteTranslator)

// statements api
app.get(financeStatementsURL + 'get', isAuthenticated, getAllStatments)
app.post(financeStatementsURL + 'add', [...adminRules], createStatement)
app.delete(financeStatementsURL + ':id', [...adminRules], deleteStatement)

// DB connection and server starts
const startServer = async () => {
    try {
        await connectToDatabase()
        app.listen(PORT, () => {
            console.log('API started at port', PORT)
        })
    } catch (err) {
        console.error('Failed to connect to MongoDB database', err)
        process.exit(1)
    }
}
startServer()
