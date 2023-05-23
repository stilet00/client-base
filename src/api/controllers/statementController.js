const {
    checkIfUserIsAuthenticatedBeforeExecute,
} = require('../firebase/firebaseAdmin')
const { getCollections } = require('../database/collections')
let ObjectId = require('mongodb').ObjectID

const getAllStatments = (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            getCollections()
                .collectionStatements.find()
                .toArray((err, docs) => {
                    if (err) {
                        return response.sendStatus(500)
                    }
                    response.send(docs)
                })
        },
        request,
        response,
    })
}

const createStatement = (request, response) => {
    if (!request.body) {
        response.send('Ошибка при загрузке платежа')
    } else {
        checkIfUserIsAuthenticatedBeforeExecute({
            callBack: () => {
                getCollections().collectionStatements.insertOne(
                    request.body,
                    (err, result) => {
                        if (err) {
                            return response.sendStatus(500)
                        } else {
                            response.send(result?.insertedId)
                        }
                    }
                )
            },
            request,
            response,
        })
    }
}

const deleteStatement = (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            getCollections().collectionStatements.deleteOne(
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
}

module.exports = { getAllStatments, createStatement, deleteStatement }
