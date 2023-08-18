const {
    checkIfUserIsAuthenticatedBeforeExecute,
} = require('../firebase/firebaseAdmin')
const { getCollections } = require('../database/collections')
let ObjectId = require('mongodb').ObjectID

const getAllClients = (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            const noImageRequest = request.query?.params
            if (noImageRequest) {
                getCollections()
                    .collectionClients.aggregate([
                        { $project: { image: 0 } },
                        { $sort: { name: 1 } },
                    ])
                    .toArray((err, docs) => {
                        if (err) {
                            console.log(err)
                            return response.sendStatus(500)
                        }
                        response.send(docs)
                    })
            } else {
                getCollections()
                    .collectionClients.find()
                    .sort({ name: 1 })
                    .toArray((err, docs) => {
                        if (err) {
                            console.log(err)
                            return response.sendStatus(500)
                        }
                        response.send(docs)
                    })
            }
        },
        request,
        response,
    })
}

const addNewClient = function (request, response, next) {
    if (!request.body) {
        response.send('Ошибка при загрузке клиентки')
    } else {
        checkIfUserIsAuthenticatedBeforeExecute({
            callBack: () => {
                getCollections().collectionClients.insertOne(
                    request.body,
                    (err, result) => {
                        if (err) {
                            return response.sendStatus(500)
                        }
                        response.send(result?.insertedId)
                    }
                )
            },
            request,
            response,
        })
    }
}

const editArrayOfClientsInTranslators = async info => {
    const { _id, name, surname } = info
    const translatorsWithEditedClient = await getCollections()
        .collectionTranslators.find({
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
    await getCollections().collectionTranslators.updateOne(
        { _id: ObjectId(id) },
        {
            $set: {
                clients: arrayWithChangedClientsNames,
            },
        }
    )
}

const updateClient = (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            getCollections().collectionClients.updateOne(
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
}

// const deleteClient = (request, response) => {
//         collectionClients.deleteOne(
//             { _id: ObjectId(request.params.id) },
//             (err, docs) => {
//                 if (err) {
//                     return response.sendStatus(500)
//                 }
//                 response.sendStatus(200)
//             }
//         )
//     }

module.exports = { getAllClients, addNewClient, updateClient }
