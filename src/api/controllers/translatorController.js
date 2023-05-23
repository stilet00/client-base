const {
    checkIfUserIsAuthenticatedBeforeExecute,
} = require('../firebase/firebaseAdmin')
const moment = require('moment')
const { getCollections } = require('../database/collections')
let ObjectId = require('mongodb').ObjectID
const {
    sendEmailTemplateToAdministrators,
    sendEmailTemplateToTranslators,
} = require('../email-api/financeEmailAPI')

const getAllTranslators = async (request, response) => {
    getCollections()
        .collectionTranslators.find()
        .toArray((err, docs) => {
            if (err) {
                return response.sendStatus(500)
            }
            response.send(docs)
        })
}

const getLastVirtualGift = (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            try {
                const year = moment().format('YYYY')
                const { collectionTranslators } = getCollections()
                const lastVirtualGift = collectionTranslators.aggregate([
                    {
                        $match: { _id: ObjectId(request.params.id) },
                    },
                    {
                        $match: {
                            'statistics.year': year,
                        },
                    },
                    { $unwind: '$statistics' },
                    { $unwind: '$statistics.months' },
                    {
                        $project: {
                            _id: '$_id',
                            name: '$name',
                            surname: '$surname',
                            clientsWithIncome: '$statistics.months',
                            year: year,
                        },
                    },
                    {
                        $unwind: '$clientsWithIncome',
                    },
                    {
                        $unwind: '$clientsWithIncome.clients',
                    },
                    {
                        $match: {
                            $or: [
                                {
                                    'clientsWithIncome.clients.virtualGiftsSvadba':
                                        { $gt: 0 },
                                },
                                {
                                    'clientsWithIncome.clients.virtualGiftsDating':
                                        { $gt: 0 },
                                },
                            ],
                        },
                    },
                    {
                        $project: {
                            translatorId: '$_id',
                            date: '$clientsWithIncome.id',
                            name: '$name',
                            dateToSort: {
                                $dateFromString: {
                                    dateString: '$clientsWithIncome.id',
                                    format: '%d %m %Y',
                                },
                            },
                            clients: '$clientsWithIncome.clients',
                            _id: 0,
                        },
                    },
                    { $sort: { dateToSort: -1 } },
                    { $limit: 1 },
                ])
                lastVirtualGift.toArray().then(doc => {
                    response.send(doc)
                })
            } catch (err) {
                response.status(500).send(err.message)
            }
        },
        request,
        response,
    })
}

const addNewTranslator = async (request, response) => {
    if (!request.body) {
        response.send('Ошибка при загрузке переводчика')
    } else {
        checkIfUserIsAuthenticatedBeforeExecute({
            callBack: () => {
                getCollections().collectionTranslators.insertOne(
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

const updateTranslator = (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            getCollections().collectionTranslators.updateOne(
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
}

const deleteTranslator = (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            getCollections().collectionTranslators.deleteOne(
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

const balanceMailout = async translatorsCollection => {
    try {
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

const sendEmailsToTranslators = (request, response) => {
    checkIfUserIsAuthenticatedBeforeExecute({
        callBack: () => {
            getCollections()
                .collectionTranslators.find()
                .toArray()
                .then(translators => {
                    balanceMailout(translators).then(
                        emailsWereSentSuccessfully => {
                            if (emailsWereSentSuccessfully.length) {
                                return response.send(emailsWereSentSuccessfully)
                            } else {
                                return response.sendStatus(500)
                            }
                        }
                    )
                })
        },
        request,
        response,
    })
}

module.exports = {
    getAllTranslators,
    getLastVirtualGift,
    addNewTranslator,
    updateTranslator,
    deleteTranslator,
    sendEmailsToTranslators,
    balanceMailout,
}
