let express = require('express')
const sendEmailTemplateToTranslators = require('./src/api/email-api/emailApi')
const moment = require('moment-timezone')
let MongoClient = require('mongodb').MongoClient
const uri =
    'mongodb+srv://testApp:72107210@cluster0.vmv4s.mongodb.net/myProject?retryWrites=true&w=majority'
const client = new MongoClient(uri, { useUnifiedTopology: true })
let ObjectId = require('mongodb').ObjectID
let bodyParser = require('body-parser')
let collectionTasks
let collectionBalance
let collectionClients
let collectionTranslators
let rootURL = '/'
let tasksURL = rootURL + 'tasks/'
let balanceURL = rootURL + 'balance/'
let clientsURL = rootURL + 'clients/'
let translatorsURL = rootURL + 'translators/'
const PORT = process.env.PORT || 80

let app = express()
app.use(express.static(__dirname + '/build'))

app.set('view engine', 'ejs')

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extented: true }))
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'origin, content-type, accept'
    )
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    next()
})

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

//email api
async function sendRegularEmails() {
    if (moment().tz('Europe/Kiev').format('HH:mm:ss') === '12:15:00') {
        const translatorsCollection = await collectionTranslators
            .find()
            .toArray()
        if (translatorsCollection.length) {
            sendEmailTemplateToTranslators(translatorsCollection)
        }
    }
}
setInterval(sendRegularEmails, 1000)

// task list api

app.get(tasksURL + 'get', (req, res) => {
    collectionTasks.find().toArray((err, docs) => {
        if (err) {
            console.log(err)
            return res.sendStatus(500)
        }
        res.send(docs)
    })
})

app.delete(tasksURL + ':id', (req, res) => {
    collectionTasks.deleteOne({ _id: ObjectId(req.params.id) }, (err, docs) => {
        if (err) {
            console.log(err)
            return res.sendStatus(500)
        }
        res.sendStatus(200)
    })
})

app.post(tasksURL + 'add', (req, res) => {
    if (req.body.taskName) {
        let task = { ...req.body }

        collectionTasks.insertOne(task, (err, result) => {
            if (err) {
                return res.sendStatus(500)
            } else {
                res.send(result.ops[0]._id)
            }
        })
    }
})

app.put(tasksURL + ':id', (req, res) => {
    collectionTasks.updateOne(
        { _id: ObjectId(req.params.id) },
        {
            $set: {
                completed: req.body.completed,
                doneAt: req.body.doneAt,
            },
        },
        err => {
            if (err) {
                return res.sendStatus(500)
            }
            res.sendStatus(200)
        }
    )
})

// balance api

app.get(balanceURL + 'get', (req, res) => {
    collectionBalance.find().toArray((err, docs) => {
        if (err) {
            console.log(err)
            return res.sendStatus(500)
        }
        res.send(docs)
    })
})

app.post(balanceURL + 'add', (req, res) => {
    if (req.body) {
        let month = { ...req.body }

        collectionBalance.insertOne(month, (err, result) => {
            if (err) {
                return res.sendStatus(500)
            } else {
                res.send(result.ops[0]._id)
            }
        })
    }
})

app.delete(balanceURL + ':id', (req, res) => {
    collectionBalance.deleteOne(
        { _id: ObjectId(req.params.id) },
        (err, docs) => {
            if (err) {
                console.log(err)
                return res.sendStatus(500)
            }
            res.sendStatus(200)
        }
    )
})

app.put(balanceURL + ':id', (req, res) => {
    collectionBalance.updateOne(
        { _id: ObjectId(req.params.id) },
        {
            $set: { values: req.body.values },
        },
        err => {
            if (err) {
                return res.sendStatus(500)
            }
            res.sendStatus(200)
        }
    )
})

//clients api

app.get(clientsURL + 'get', (req, res) => {
    collectionClients.find().toArray((err, docs) => {
        if (err) {
            console.log(err)
            return res.sendStatus(500)
        }
        res.send(docs)
    })
})
app.post(clientsURL + 'add', function (req, res, next) {
    if (!req.body) {
        res.send('Ошибка при загрузке клиентки')
    } else {
        collectionClients.insertOne(req.body, (err, result) => {
            if (err) {
                return res.sendStatus(500)
            }
            res.send(result?.insertedId)
        })
    }
})
app.delete(clientsURL + ':id', (req, res) => {
    collectionClients.deleteOne(
        { _id: ObjectId(req.params.id) },
        (err, docs) => {
            if (err) {
                return res.sendStatus(500)
            }
            res.sendStatus(200)
        }
    )
})

// translators api

app.get(translatorsURL + 'get', (req, res) => {
    collectionTranslators.find().toArray((err, docs) => {
        if (err) {
            return res.sendStatus(500)
        }
        res.send(docs)
    })
})

app.post(translatorsURL + 'add', function (req, res, next) {
    if (!req.body) {
        res.send('Ошибка при загрузке переводчика')
    } else {
        collectionTranslators.insertOne(req.body, (err, result) => {
            if (err) {
                return res.sendStatus(500)
            } else {
                res.send(result?.insertedId)
            }
        })
    }
})

app.put(translatorsURL + ':id', (req, res) => {
    collectionTranslators.updateOne(
        { _id: ObjectId(req.params.id) },
        {
            $set: {
                name: req.body.name,
                surname: req.body.surname,
                clients: req.body.clients,
                statistics: req.body.statistics,
                suspended: req.body.suspended,
                personalPenalties: req.body.personalPenalties,
            },
        },
        err => {
            if (err) {
                return res.sendStatus(500)
            }
            const message = 'Переводчик сохранен'
            console.log(message)
            res.send(message)
        }
    )
})
app.delete(translatorsURL + ':id', (req, res) => {
    collectionTranslators.deleteOne(
        { _id: ObjectId(req.params.id) },
        (err, docs) => {
            if (err) {
                return res.sendStatus(500)
            }
            res.sendStatus(200)
        }
    )
})

client.connect(function (err) {
    collectionTasks = client.db('taskListDB').collection('tasks')
    collectionBalance = client.db('taskListDB').collection('totalBalance')
    collectionClients = client.db('clientsDB').collection('clients')
    collectionTranslators = client.db('translatorsDB').collection('translators')
    console.log('Connected successfully to server...')
    app.listen(PORT, () => {
        console.log('API started at port', PORT)
    })
})
