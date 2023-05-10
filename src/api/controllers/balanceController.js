const {
    checkIfUserIsAuthenticatedBeforeExecute,
} = require('../firebase/firebaseAdmin')
const { getCollections } = require('../database/collections')
let ObjectId = require('mongodb').ObjectID

const getBalance = (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            getCollections()
                .collectionBalance.find()
                .toArray((err, docs) => {
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
}

const uploadBalance = (request, response) => {
    if (!request.body) {
        response.send('Ошибка при загрузке платежа')
    } else {
    }
}

const updateBalance = (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            getCollections().collectionBalance.updateOne(
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
}
const deleteBalance = (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            getCollections().collectionBalance.deleteOne(
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
}

module.exports = { getBalance, uploadBalance, deleteBalance, updateBalance }
