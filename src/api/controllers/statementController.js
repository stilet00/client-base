const { getCollections } = require('../database/collections')
let ObjectId = require('mongodb').ObjectID

const getAllStatements = async (request, response) => {
    try {
        const Statement = await getCollections().collectionStatements
        const statementsCollection = await Statement.find()
        response.send(statementsCollection)
    } catch (err) {
        response.sendStatus(500)
    }
}

const createStatement = async (request, response) => {
    if (!request.body) {
        response.send('Ошибка при загрузке платежа')
    } else {
        try {
            const Statement = await getCollections().collectionStatements
            const statement = new Statement(request.body)
            const result = await statement.save()
            response.send(result._id)
        } catch (err) {
            response.sendStatus(500)
        }
    }
}

const deleteStatement = async (request, response) => {
    try {
        const Statement = await getCollections().collectionStatements
        const result = await Statement.deleteOne({
            _id: ObjectId(request.params.id),
        })
        if (result.deletedCount > 0) {
            response.sendStatus(200)
        } else {
            response.sendStatus(404)
        }
    } catch (err) {
        response.sendStatus(500)
    }
}

module.exports = { getAllStatements, createStatement, deleteStatement }
