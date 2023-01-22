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

const {
    checkIfUserIsAuthenticatedBeforeExecute,
} = require('./src/api/firebase/firebaseAdmin')

const PORT = process.env.SERVER_PORT || 80
let app = express()
app.use(express.static(__dirname + '/build'))

app.set('view engine', 'ejs')

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extented: true }))
app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-type, Accept, Authorization'
    )
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
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
    const translatorsWithEditedClient = await collectionTranslators
        .find({
            clients: {
                $elemMatch: {
                    _id: _id,
                },
            },
        })
        .toArray()
    if (translatorsWithEditedClient.length > 0) {
        for (let translator of translatorsWithEditedClient) {
            const arrayWithChangedClientsNames = translator.clients.map(
                client => {
                    if (client._id === _id) {
                        const clientWithChangedData = {
                            ...client,
                            name: name,
                            surname: surname,
                        }
                        return clientWithChangedData
                    } else {
                        return client
                    }
                }
            )
            changeClientNameInTranslatorsDataBase(
                translator._id,
                arrayWithChangedClientsNames
            )
        }
    }
}

const changeClientNameInTranslatorsDataBase = async (
    id,
    arrayWithChangedClientsNames
) => {
    await collectionTranslators.updateOne(
        { _id: ObjectId(id) },
        {
            $set: {
                clients: arrayWithChangedClientsNames,
            },
        }
    )
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

app.get(tasksURL + 'get', (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            collectionTasks.find().toArray((err, docs) => {
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
})

app.delete(tasksURL + ':id', (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            collectionTasks.deleteOne(
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
})

app.post(tasksURL + 'add', (request, response) => {
    if (request.body.taskName) {
        checkIfUserIsAuthenticatedBeforeExecute({
            callBack: () => {
                const task = { ...request.body }
                collectionTasks.insertOne(task, (err, result) => {
                    if (err) {
                        return response.sendStatus(500)
                    } else {
                        response.send(result.ops[0]._id)
                    }
                })
            },
            request,
            response,
        })
    } else {
        response.send('No task task name')
    }
})

app.put(tasksURL + 'edit/:id', (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            collectionTasks.updateOne(
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
})

app.get(tasksURL + 'notifications/', (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            collectionTaskNotifications.find().toArray((err, docs) => {
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
})

app.put(tasksURL + 'notifications/', (request, response) => {
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
            collectionTaskNotifications.updateOne(
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
})

// balance api

app.get(balanceURL + 'get', (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            collectionBalance.find().toArray((err, docs) => {
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
})

app.post(balanceURL + 'add', (request, response) => {
    if (!request.body) {
        response.send('Ошибка при загрузке платежа')
    } else {
    }
})

app.delete(balanceURL + ':id', (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            collectionBalance.deleteOne(
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
})

app.put(balanceURL + ':id', (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            collectionBalance.updateOne(
                { _id: ObjectId(request.params.id) },
                {
                    $set: { values: request.body.values },
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
})

//clients api

app.get(clientsURL + 'get', (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            collectionClients.find().toArray((err, docs) => {
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
})

app.post(clientsURL + 'add', function (request, response, next) {
    if (!request.body) {
        response.send('Ошибка при загрузке клиентки')
    } else {
        checkIfUserIsAuthenticatedBeforeExecute({
            callBack: () => {
                collectionClients.insertOne(request.body, (err, result) => {
                    if (err) {
                        return response.sendStatus(500)
                    }
                    response.send(result?.insertedId)
                })
            },
            request,
            response,
        })
    }
})
// we do not delete clients 09.11.2022
// app.delete(clientsURL + ':id', (request, response) => {
//     collectionClients.deleteOne(
//         { _id: ObjectId(request.params.id) },
//         (err, docs) => {
//             if (err) {
//                 return response.sendStatus(500)
//             }
//             response.sendStatus(200)
//         }
//     )
// })

app.put(clientsURL + ':id', (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            collectionClients.updateOne(
                { _id: ObjectId(request.params.id) },
                {
                    $set: {
                        name: request.body.name,
                        surname: request.body.surname,
                        bankAccount: request.body.bankAccount,
                        instagramLink: request.body.instagramLink,
                        suspended: request.body.suspended,
                        image: request.body.image,
                        svadba: {
                            login: request.body.svadba.login,
                            password: request.body.svadba.password,
                        },
                        dating: {
                            login: request.body.dating.login,
                            password: request.body.dating.password,
                        },
                    },
                },
                err => {
                    if (err) {
                        return response.sendStatus(500)
                    }
                    const message = 'Переводчик сохранен'
                    response.send(message)
                    editArrayOfClientsInTranslators(request.body)
                }
            )
        },
        request,
        response,
    })
})

// translators api

app.get(translatorsURL + 'get', (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            collectionTranslators.find().toArray((err, docs) => {
                if (err) {
                    return response.sendStatus(500)
                }
                response.send(docs)
            })
        },
        request,
        response,
    })
})

app.get(translatorsURL + 'send-emails', (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            balanceMailout().then(emailsWereSentSuccessfully => {
                if (emailsWereSentSuccessfully.length) {
                    return response.send(emailsWereSentSuccessfully)
                } else {
                    return response.sendStatus(500)
                }
            })
        },
        request,
        response,
    })
})

app.post(translatorsURL + 'add', function (request, response, next) {
    if (!request.body) {
        response.send('Ошибка при загрузке переводчика')
    } else {
        checkIfUserIsAuthenticatedBeforeExecute({
            callBack: () => {
                collectionTranslators.insertOne(request.body, (err, result) => {
                    if (err) {
                        return response.sendStatus(500)
                    } else {
                        response.send(result?.insertedId)
                    }
                })
            },
            request,
            response,
        })
    }
})

app.put(translatorsURL + ':id', (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            collectionTranslators.updateOne(
                { _id: ObjectId(request.params.id) },
                {
                    $set: {
                        name: request.body.name,
                        surname: request.body.surname,
                        clients: request.body.clients,
                        statistics: request.body.statistics,
                        suspended: request.body.suspended,
                        personalPenalties: request.body.personalPenalties,
                        email: request.body.email,
                        wantsToReceiveEmails: request.body.wantsToReceiveEmails,
                    },
                },
                err => {
                    if (err) {
                        return response.sendStatus(500)
                    }
                    const message = 'Переводчик сохранен'
                    response.send(message)
                }
            )
        },
        request,
        response,
    })
})
app.delete(translatorsURL + ':id', (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            collectionTranslators.deleteOne(
                { _id: ObjectId(request.params.id) },
                (err, docs) => {
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
})

//statements api

app.get(financeStatementsURL + 'get', (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            collectionStatements.find().toArray((err, docs) => {
                if (err) {
                    return response.sendStatus(500)
                }
                response.send(docs)
            })
        },
        request,
        response,
    })
})

app.post(financeStatementsURL + 'add', function (request, response, next) {
    if (!request.body) {
        response.send('Ошибка при загрузке платежа')
    } else {
        checkIfUserIsAuthenticatedBeforeExecute({
            callBack: () => {
                collectionStatements.insertOne(request.body, (err, result) => {
                    if (err) {
                        return response.sendStatus(500)
                    } else {
                        response.send(result?.insertedId)
                    }
                })
            },
            request,
            response,
        })
    }
})

app.delete(financeStatementsURL + ':id', (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            collectionStatements.deleteOne(
                { _id: ObjectId(request.params.id) },
                (err, docs) => {
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
})

client.connect(function (err) {
    collectionTasks = client.db('taskListDB').collection('tasks')
    collectionBalance = client.db('taskListDB').collection('totalBalance')
    collectionTaskNotifications = client
        .db('taskListDB')
        .collection('notificationSwitch')
    collectionClients = client.db('clientsDB').collection('clients')
    collectionTranslators = client.db('translatorsDB').collection('translators')
    collectionStatements = client.db('statementsDB').collection('statements')
    console.log('Connected successfully to database...')
    app.listen(PORT, () => {
        console.log('API started at port', PORT)
    })
    createCurrentYearStatisticsForEveryTranslator(collectionTranslators)
    try {
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
    } catch (error) {
        console.log(error)
    }
})
