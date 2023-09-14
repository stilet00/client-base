const moment = require('moment')
const { getCollections } = require('../database/collections')
let ObjectId = require('mongodb').ObjectID
const {
    sendEmailTemplateToAdministrators,
    sendEmailTemplateToTranslators,
} = require('../email-api/financeEmailAPI')
const { chatCostBonusInCents } = require('../constants')

const getAllTranslators = async (request, response) => {
    const hasStatisticsYearsInParams = !!request.query?.params
    try {
        if (hasStatisticsYearsInParams) {
            const yearParams = request.query.params
            const yearsArray = Array.isArray(yearParams)
                ? yearParams
                : [yearParams]

            const result = await getCollections()
                .collectionTranslators.aggregate([
                    {
                        $unwind: '$statistics',
                    },
                    {
                        $match: {
                            'statistics.year': { $in: yearsArray },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            statistics: {
                                $cond: {
                                    if: {
                                        $in: ['$statistics.year', yearsArray],
                                    },
                                    then: '$statistics',
                                    else: null,
                                },
                            },
                            suspended: 1,
                        },
                    },
                    {
                        $group: {
                            _id: '$_id',
                            statistics: { $push: '$statistics' },
                            suspended: { $first: '$suspended' },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            statistics: 1,
                            suspended: 1,
                        },
                    },
                ])
                .toArray()
            response.send(result)
        } else {
            const result = await getCollections()
                .collectionTranslators.find()
                .toArray()
            response.send(result)
        }
    } catch (error) {
        console.error(error)
        response.sendStatus(500)
    }
}

const getLastVirtualGift = (request, response) => {
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
                            'clientsWithIncome.clients.virtualGiftsSvadba': {
                                $gt: 0,
                            },
                        },
                        {
                            'clientsWithIncome.clients.virtualGiftsDating': {
                                $gt: 0,
                            },
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
}

const addNewTranslator = async (request, response) => {
    if (!request.body) {
        response.send('Ошибка при загрузке переводчика')
    } else {
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
    }
}

const updateTranslator = (request, response) => {
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
}

const deleteTranslator = (request, response) => {
    getCollections().collectionTranslators.deleteOne(
        { _id: ObjectId(request.params.id) },
        (err, docs) => {
            if (err) {
                return response.sendStatus(500)
            }
            response.sendStatus(200)
        }
    )
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
    getCollections()
        .collectionTranslators.find()
        .toArray()
        .then(translators => {
            balanceMailout(translators).then(emailsWereSentSuccessfully => {
                if (emailsWereSentSuccessfully.length) {
                    return response.send(emailsWereSentSuccessfully)
                } else {
                    return response.sendStatus(500)
                }
            })
        })
}

const calculateBonuses = async (request, response) => {
    if (!request.body) {
        response.send('Ошибка при загрузке переводчика')
    } else {
        try {
            const year = request.body.year || '2023'
            const month = parseInt(request.body.month) || 1 // making sure months will be integer
            const category = request.body.category || 'chats'
            const { collectionTranslators } = getCollections()
            const pipeline = [
                {
                    $unwind: '$statistics',
                },
                {
                    $match: {
                        'statistics.year': year,
                    },
                },
                {
                    $project: {
                        currentMonth: {
                            $arrayElemAt: ['$statistics.months', month - 1],
                        },
                    },
                },
                {
                    $project: {
                        clients: '$currentMonth.clients',
                    },
                },
                {
                    $project: {
                        clients: {
                            $reduce: {
                                input: '$clients',
                                initialValue: [],
                                in: {
                                    $concatArrays: [
                                        '$$value',
                                        {
                                            $filter: {
                                                input: '$$this',
                                                as: 'element',
                                                cond: {
                                                    $gt: [
                                                        '$$element.' + category,
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
                    $unwind: '$clients',
                },
                {
                    $group: {
                        _id: '$_id',
                        totalChatsSum: {
                            $sum: { $toDouble: '$clients.' + category },
                        },
                    },
                },
                {
                    $addFields: {
                        roundedTotalChatsSum: {
                            $round: ['$totalChatsSum', 2],
                        },
                        bonusChatsSum: {
                            $round: [
                                {
                                    $divide: [
                                        '$totalChatsSum',
                                        chatCostBonusInCents,
                                    ],
                                },
                                2,
                            ],
                        },
                    },
                },
                {
                    $project: {
                        totalChatsSum: '$roundedTotalChatsSum',
                        bonusChatsSum: 1,
                    },
                },
            ]

            const chatPerMonthSum = await collectionTranslators
                .aggregate(pipeline)
                .toArray()
            response.send(chatPerMonthSum)
        } catch (err) {
            response.status(500).send(err.message)
        }
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
