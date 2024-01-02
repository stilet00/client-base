const moment = require('moment')
const { getCollections } = require('../database/collections')
const ObjectId = require('mongodb').ObjectID
const {
    sendEmailTemplateToAdministrators,
    sendEmailTemplateToTranslators,
} = require('../email-api/financeEmailAPI')
const { chatCostBonusInCents } = require('../constants')

const getAllTranslators = async (req, res) => {
    try {
        const hasSearchQuery = !!req.query?.searchQuery
        const hasShouldGetClients = !!req.query?.shouldGetClients
        let query = getCollections().collectionTranslators.find()
        if (hasShouldGetClients) {
            query = query.populate('clients')
        }
        const translators = await query.exec()
        res.send(translators)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

const getLastVirtualGift = async (req, res) => {
    try {
        const year = moment().format('YYYY')
        const { collectionTranslators } = await getCollections()
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
        lastVirtualGift.exec().then(doc => {
            res.send(doc)
        })
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const addNewTranslator = async (req, res) => {
    try {
        const Translator = await getCollections().collectionTranslators
        if (!req.body) {
            res.send('Ошибка при загрузке переводчика')
            return
        }
        const translator = new Translator(req.body)
        const result = await translator.save()
        res.send(result._id)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

const updateTranslator = async (req, res) => {
    try {
        const Translator = await getCollections().collectionTranslators
        const newTranslatorData = {
            name: req.body.name,
            surname: req.body.surname,
            clients: req.body.clients,
            statistics: req.body.statistics,
            suspended: req.body.suspended,
            personalPenalties: req.body.personalPenalties,
            email: req.body.email,
            wantsToReceiveEmails: req.body.wantsToReceiveEmails,
        }
        const translator = new Translator(newTranslatorData)
        try {
            await translator.validate()
            await Translator.updateOne(
                { _id: ObjectId(req.params.id) },
                { $set: newTranslatorData }
            )
            const message = 'Translator has been saved'
            res.send(message)
        } catch (err) {
            if (err) {
                return res.status(400).send(err)
            }
        }
    } catch (error) {
        if (!!error.message) {
            console.error(error.message)
        } else {
            console.error(error)
        }
        res.sendStatus(500)
    }
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
        console.error(error)
        return false
    }
}

const sendEmailsToTranslators = (req, res) => {
    getCollections()
        .collectionTranslators.find()
        .exec()
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
    try {
        if (!req.body) {
            return res.status(400).send('Bad Request: No body in the request')
        }

        const { dateTimeFilter, category } = req.body
        const BalanceDay = await getCollections().collectionBalanceDays
        const startOfMonth = moment(dateTimeFilter)
            .startOf('month')
            .toISOString()
        const endOfMonth = moment(dateTimeFilter).endOf('month').toISOString()
        const pipeline = [
            {
                $match: {
                    $expr: {
                        $and: [
                            { $gte: ['$dateTimeId', new Date(startOfMonth)] },
                            { $lte: ['$dateTimeId', new Date(endOfMonth)] },
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: '$translator',
                    bonusCategorySum: { $sum: `$statistics.${category}` },
                },
            },
        ]
        const result = await BalanceDay.aggregate(pipeline).exec()
        if (result.length === 0) {
            return res
                .status(404)
                .send('No data found for the specified filters')
        }
        res.send(
            result.map(chatBonusObject => {
                return {
                    translatorId: chatBonusObject._id,
                    bonusCategorySum: chatBonusObject.bonusCategorySum,
                }
            })
        )
    } catch (err) {
        console.error(err)
        res.status(500).send(err.message)
    }
}

const assignClientToTranslator = async (req, res) => {
    try {
        const { clientId, translatorId } = req.body
        const collections = await getCollections()
        const Translators = collections.collectionTranslators
        const Clients = collections.collectionClients

        const translatorResult = await Translators.updateOne(
            { _id: ObjectId(translatorId) },
            { $addToSet: { clients: ObjectId(clientId) } }
        )

        const clientResult = await Clients.updateOne(
            { _id: ObjectId(clientId) },
            { $addToSet: { translators: ObjectId(translatorId) } }
        )

        if (translatorResult.nModified === 0 && clientResult.nModified === 0) {
            res.status(400).send('Client and translator are already connected')
        } else {
            res.status(200).send('Client and translator successfully connected')
        }
    } catch (error) {
        console.error('An error occurred:', error)
        res.status(500).send('An error occurred')
    }
}

const addPersonalPenaltyToTranslator = async (req, res) => {
    try {
        const collections = await getCollections()
        const Translator = collections.collectionTranslators
        const { translator: translatorId, date, amount, description } = req.body
        const translator = await Translator.findById(translatorId)
        if (!translator) {
            return res.status(404).send('Translator not found')
        }
        const penalty = { translator: translatorId, date, amount, description }
        translator.personalPenalties.push(penalty)

        await translator.save()
        res.status(200).send(
            'Personal penalty successfully added to translator'
        )
    } catch (error) {
        console.error('An error occurred:', error)
        res.status(500).send('An error occurred')
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
    assignClientToTranslator,
    addPersonalPenaltyToTranslator,
}
