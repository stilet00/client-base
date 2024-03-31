const moment = require('moment')
const { getCollections } = require('../database/collections')
const ObjectId = require('mongodb').ObjectID
const {
    sendEmailTemplateToAdministrators,
    sendEmailTemplateToTranslators,
} = require('../email-api/financeEmailAPI')
const { chatCostBonusInCents } = require('../constants')

const getAllTranslators = async (req, res) => {
    const hasStatisticsYearsInParams = !!req.query?.params
    try {
        if (hasStatisticsYearsInParams) {
            const yearParams = req.query.params
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
            res.send(result)
        } else {
            const result = await getCollections()
                .collectionTranslators.find()
                .toArray()
            res.send(result)
        }
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

const getLastVirtualGift = (req, res) => {
    try {
        const year = moment().format('YYYY')
        const { collectionTranslators } = getCollections()
        const lastVirtualGift = collectionTranslators.aggregate([
            {
                $match: { _id: ObjectId(req.params.id) },
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
            res.send(doc)
        })
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const addNewTranslator = async (req, res) => {
    if (!req.body) {
        res.send('Ошибка при загрузке переводчика')
    } else {
        getCollections().collectionTranslators.insertOne(
            req.body,
            (err, result) => {
                if (err) {
                    return res.sendStatus(500)
                } else {
                    res.send(result?.insertedId)
                }
            }
        )
    }
}

const updateTranslator = (req, res) => {
    getCollections().collectionTranslators.updateOne(
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
            res.send(message)
        }
    )
}

const deleteTranslator = (req, res) => {
    getCollections().collectionTranslators.deleteOne(
        { _id: ObjectId(req.params.id) },
        (err, docs) => {
            if (err) {
                return res.sendStatus(500)
            }
            res.sendStatus(200)
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

const sendEmailsToTranslators = (req, res) => {
    getCollections()
        .collectionTranslators.find()
        .toArray()
        .then(translators => {
            balanceMailout(translators).then(emailsWereSentSuccessfully => {
                if (emailsWereSentSuccessfully.length) {
                    return res.send(emailsWereSentSuccessfully)
                } else {
                    return res.sendStatus(500)
                }
            })
        })
}

const calculateBonuses = async (req, res) => {
    if (!req.body) {
        res.send('Ошибка при загрузке переводчика')
    } else {
        try {
            const year = req.body.year || '2023'
            const month = parseInt(req.body.month) || 1 // making sure months will be integer
            const category = req.body.category || 'chats'
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
            res.send(chatPerMonthSum)
        } catch (err) {
            res.status(500).send(err.message)
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
