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

const calculateBonuses = (request, response) => {
    if (!request.body) {
        response.send('Ошибка при загрузке переводчика')
    } else {
        checkIfUserIsAuthenticatedBeforeExecute({
            callBack: () => {
                try {
                    const year = request.body.year || '2022'
                    const month = parseInt(request.body.month) || 1 // making sure months will be integer
                    const category = request.body.category || 'chats'
                    const { collectionTranslators } = getCollections()
                    const chatPerMonthSum = collectionTranslators.aggregate([
                        {
                            $match: { _id: ObjectId(request.body.id) }, // finding translator by id
                        },
                        {
                            $project: {
                                // Including  only needed fields fro Translator object
                                _id: 0, // Exclude _id field from the result
                                statistics: {
                                    // in our case it is statistics
                                    $filter: {
                                        input: '$statistics', // same as for JS statistics.filter(stat => stat.year === year)
                                        as: 'stat',
                                        cond: { $eq: ['$$stat.year', year] }, // finding statistics by year
                                    },
                                },
                            },
                        },
                        {
                            $unwind: '$statistics', // statistics is an array of months, so we have to unwind it to creater 12 objects of months
                        },
                        {
                            $project: {
                                currentMonth: {
                                    $arrayElemAt: [
                                        '$statistics.months',
                                        month - 1,
                                    ], // finding needed months  by index  and renaming it to currentMonth
                                },
                            },
                        },
                        {
                            $project: {
                                clients: '$currentMonth.clients', // talking only clients field and renaming it so we don't have to write currentMonth.clients all the time
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                clients: {
                                    $reduce: {
                                        input: '$clients', // taking array of clients
                                        initialValue: [],
                                        in: {
                                            $concatArrays: [
                                                '$$value',
                                                {
                                                    $filter: {
                                                        input: '$$this',
                                                        as: 'element', // doing something similar as clients.forEach(element => element.chats > 0 )
                                                        cond: {
                                                            $gt: [
                                                                '$$element.' +
                                                                    category, // concatination of element. + chats
                                                                0,
                                                            ],
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                        {
                            $unwind: '$clients', // now we have  array of clients, with only dates left where chats > 0 and we again unwind this array to get sum of those days
                        },
                        {
                            $group: {
                                // creating output object  which will have { id: translatorId, totalChatsSum: integer}
                                _id: request.body.id,
                                totalChatsSum: {
                                    $sum: { $toDouble: '$clients.' + category },
                                }, // The $toDouble operator is used to convert the value of a field to a double data type. In this case, it is used to ensure that the value retrieved from the clients array is treated as a numeric value before being summed using the $sum operator.
                            },
                        },
                        {
                            $addFields: {
                                roundedTotalChatsSum: {
                                    $round: ['$totalChatsSum', 2], // just rounding data
                                },
                                bonusChatsSum: {
                                    $round: [
                                        { $divide: ['$totalChatsSum', 3] }, // getting  value we need to add as 9 cents to 12 cents is like 3/4 so we need to find 1/4 of it or 1/3 from 9
                                        2,
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                // finally returing the object we need with only 3 fields left
                                _id: 1, // means if the field existed in previous object in our case when we used  $group, it should be included here as well
                                totalChatsSum: '$roundedTotalChatsSum',
                                bonusChatsSum: 1, // same this field existed 1 step above so we just project it to new output object
                            },
                        },
                    ])

                    chatPerMonthSum.toArray().then(docs => {
                        response.send(docs)
                    })
                } catch (err) {
                    response.status(500).send(err.message)
                }
            },
            request,
            response,
        })
    }
}

module.exports = {
    getAllTranslators,
    getLastVirtualGift,
    addNewTranslator,
    updateTranslator,
    deleteTranslator,
    sendEmailsToTranslators,
    balanceMailout,
    calculateBonuses,
}
