const { getCollections } = require('../database/collections')
let ObjectId = require('mongodb').ObjectID

const getAllStatements = async (request, response) => {
    const statementsCollection = await getCollections()
        .collectionStatements.find()
        .exec()
    response.send(statementsCollection)
}

const createStatement = (request, response) => {
    if (!request.body) {
        response.send('Ошибка при загрузке платежа')
    } else {
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
    }
}

const deleteStatement = (request, response) => {
    getCollections().collectionStatements.deleteOne(
        { _id: ObjectId(request.params.id) },
        (err, docs) => {
            if (err) {
                return response.sendStatus(500)
            }
            response.sendStatus(200)
        }
    )
}

module.exports = { getAllStatements, createStatement, deleteStatement }
