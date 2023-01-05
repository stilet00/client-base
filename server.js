let express = require('express')
const {
    sendEmailTemplateToAdministrators,
    sendEmailTemplateToTranslators,
} = require('./src/api/email-api/financeEmailAPI')
const {
    sendTaskNotificationEmailTemplatesToAdministrators,
} = require('./src/api/email-api/taskNotificationEmailAPI')
let MongoClient = require('mongodb').MongoClient
const uri =
    'mongodb+srv://testApp:72107210@cluster0.vmv4s.mongodb.net/myProject?retryWrites=true&w=majority'
const client = new MongoClient(uri, { useUnifiedTopology: true })
let ObjectId = require('mongodb').ObjectID
let bodyParser = require('body-parser')
let {
    collectionTasks,
    collectionBalance,
    collectionClients,
    collectionTranslators,
    collectionStatements,
    collectionTaskNotifications,
} = require('./src/api/database/collections')
const {
    rootURL,
    balanceURL,
    clientsURL,
    translatorsURL,
    financeStatementsURL,
    tasksURL,
} = require('./src/api/routes/routes')
const { twentyHoursInMiliseconds } = require('./src/api/constants')
const {
    createCurrentYearStatisticsForEveryTranslator,
} = require('./src/api/database-api/createCurrentYearStatisticsForEveryTranslator')

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
app.get(rootURL + 'finances/?', function (request, response, next) {
    response.sendFile(__dirname + '/build/index.html')
})

const editArrayOfClientsInTranslators = async info => {
    const { _id, name, surname } = info
    const translatorsCollection = await collectionTranslators.find().toArray()
    // const singleClient = await collectionClients.findOne({ _id: ObjectId(_id) })
    // console.log(singleClient)
    if (translatorsCollection.length > 0) {
        const filteredCollection = translatorsCollection.filter(translator => {
            const searchedClient = translator.clients.find(
                client => client._id === _id
            )
            if (searchedClient) {
                return translator
            }
        })
        for (let translator of filteredCollection) {
            const clientWithDifferentDatas = translator.clients.find(
                client =>
                    client._id === _id &&
                    (client.name !== name || client.surname !== surname)
            )
            if (clientWithDifferentDatas) {
                const indexOfClientWithDifferentDatas =
                    translator.clients.indexOf(clientWithDifferentDatas)
                const clientWithCorrectDatas = {
                    ...clientWithDifferentDatas,
                    name: name,
                    surname: surname,
                }
                translator.clients[indexOfClientWithDifferentDatas] =
                    clientWithCorrectDatas
                updateTranslatorDatabaseWithChangedClientName(
                    translator._id,
                    translator.clients
                )
            } else {
                console.log(
                    `${translator.name} ${translator.surname} has no changed clients`
                )
            }
        }
    }
}
const updateTranslatorDatabaseWithChangedClientName = async (
    id,
    arrayWithChangedNames
) => {
    await collectionTranslators.updateOne(
        { _id: ObjectId(id) },
        {
            $set: {
                clients: arrayWithChangedNames,
            },
        }
    )
}
const changeTranslatorsAndClientsNameDifference = async (
    translators,
    collectionClients
) => {
    for (let translator of translators) {
        const arrayOfChangedClientsNames = []
        const newArrayOfClientsOnTranslator = translator.clients.map(
            clientOnTranslator => {
                const clientWithDifferentData = collectionClients.find(
                    client =>
                        client._id == clientOnTranslator._id &&
                        (client.name !== clientOnTranslator.name ||
                            client.surname !== clientOnTranslator.surname)
                )

                if (clientWithDifferentData) {
                    arrayOfChangedClientsNames.push(clientWithDifferentData)
                    const changedClient = {
                        ...clientOnTranslator,
                        name: clientWithDifferentData.name,
                        surname: clientWithDifferentData.surname,
                    }
                    return changedClient
                }
                return clientOnTranslator
            }
        )
        if (arrayOfChangedClientsNames.length > 0) {
            await updateTranslatorDatabaseWithChangedClientName(
                translator._id,
                newArrayOfClientsOnTranslator
            )
        } else {
            console.log(
                `${translator.name} ${translator.surname} has no changed clients`
            )
        }
    }
}

async function synchronizeNames() {
    try {
        const translatorsCollection = await collectionTranslators
            .find()
            .toArray()
        const clientsCollection = await collectionClients.find().toArray()
        if (translatorsCollection.length > 0 && clientsCollection.length > 0) {
            await changeTranslatorsAndClientsNameDifference(
                translatorsCollection,
                clientsCollection
            )
        } else {
            return 'No clients or translators in dataBase'
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

//email api
async function balanceMailout() {
    try {
        const translatorsCollection = await collectionTranslators
            .find()
            .toArray()
        if (translatorsCollection.length) {
            const listOfTranslatorsWhoReceivedEmails =
                await sendEmailTemplateToTranslators(translatorsCollection)
            sendEmailTemplateToAdministrators(translatorsCollection)
            return listOfTranslatorsWhoReceivedEmails
        } else {
            return []
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

let outdatedTaskNotificationsInterval

async function taskNotificationsMailout() {
    const taskCollection = await collectionTasks.find().toArray()
    sendTaskNotificationEmailTemplatesToAdministrators(taskCollection)
}

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

app.put(tasksURL + 'edit/:id', (req, res) => {
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

app.get(tasksURL + 'notifications/', (req, res) => {
    collectionTaskNotifications.find().toArray((err, docs) => {
        if (err) {
            console.log(err)
            return res.sendStatus(500)
        }
        res.send(docs)
    })
})

app.put(tasksURL + 'notifications/', (req, res) => {
    const taskNotificationsAreAllowed = req.body.allowed
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
    collectionTaskNotifications.updateOne(
        { _id: ObjectId(notificationSettingsDatabaseId) },
        {
            $set: {
                allowed: req.body.allowed,
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
// we do not delete clients 09.11.2022
// app.delete(clientsURL + ':id', (req, res) => {
//     collectionClients.deleteOne(
//         { _id: ObjectId(req.params.id) },
//         (err, docs) => {
//             if (err) {
//                 return res.sendStatus(500)
//             }
//             res.sendStatus(200)
//         }
//     )
// })

// translators api

app.put(clientsURL + ':id', (req, res) => {
    collectionClients.updateOne(
        { _id: ObjectId(req.params.id) },
        {
            $set: {
                name: req.body.name,
                surname: req.body.surname,
                bankAccount: req.body.bankAccount,
                instagramLink: req.body.instagramLink,
                suspended: req.body.suspended,
                svadba: {
                    login: req.body.svadba.login,
                    password: req.body.svadba.password,
                },
                dating: {
                    login: req.body.dating.login,
                    password: req.body.dating.password,
                },
            },
        },
        err => {
            if (err) {
                return res.sendStatus(500)
            }
            const message = 'Переводчик сохранен'
            console.log(message)
            res.send(message)
            editArrayOfClientsInTranslators(req.body)
        }
    )
})

app.get(translatorsURL + 'get', (req, res) => {
    collectionTranslators.find().toArray((err, docs) => {
        if (err) {
            return res.sendStatus(500)
        }
        res.send(docs)
    })
})

app.get(translatorsURL + 'synchronize', (req, res) => {
    synchronizeNames()
})

app.get(translatorsURL + 'send-emails', (req, res) => {
    balanceMailout().then(emailsWereSentSuccessfully => {
        if (emailsWereSentSuccessfully.length) {
            return res.send(emailsWereSentSuccessfully)
        } else {
            return res.sendStatus(500)
        }
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
                email: req.body.email,
                wantsToReceiveEmails: req.body.wantsToReceiveEmails,
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

//statements api

app.get(financeStatementsURL + 'get', (req, res) => {
    collectionStatements.find().toArray((err, docs) => {
        if (err) {
            return res.sendStatus(500)
        }
        res.send(docs)
    })
})

app.post(financeStatementsURL + 'add', function (req, res, next) {
    if (!req.body) {
        res.send('Ошибка при загрузке платежа')
    } else {
        collectionStatements.insertOne(req.body, (err, result) => {
            if (err) {
                return res.sendStatus(500)
            } else {
                res.send(result?.insertedId)
            }
        })
    }
})

app.delete(financeStatementsURL + ':id', (req, res) => {
    collectionStatements.deleteOne(
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
    collectionTaskNotifications = client
        .db('taskListDB')
        .collection('notificationSwitch')
    // collectionClients = client.db('clientsDB').collection('clients')
    // collectionTranslators = client.db('translatorsDB').collection('translators')
    collectionClients = client.db('testDB').collection('testClientCollection')
    collectionTranslators = client
        .db('testDB')
        .collection('testTranslatorsCollection')
    collectionStatements = client.db('statementsDB').collection('statements')
    console.log('Connected successfully to server...')
    app.listen(PORT, () => {
        console.log('API started at port', PORT)
    })
    createCurrentYearStatisticsForEveryTranslator(collectionTranslators)

    collectionTaskNotifications.find().toArray((err, docs) => {
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
})
