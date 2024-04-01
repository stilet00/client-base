const moment = require('moment')
const mongoose = require('mongoose')
const { getCollections } = require('../database/collections')
const ObjectId = require('mongodb').ObjectID
const {
    sendEmailTemplateToAdministrators,
    sendEmailTemplateToTranslators,
} = require('../email-api/financeEmailAPI')
const {
    PersonalPenaltiesSchema,
} = require('../models/translatorsDatabaseModels')

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
        if (!req.params.id) {
            res.send('Отсутствует id переводчика')
            return
        }
        const BalanceDay = await getCollections().collectionBalanceDays
        const balanceDay = await BalanceDay.findOne({
            translator: new ObjectId(req.params.id),
            $or: [
                { 'statistics.virtualGiftsSvadba': { $gt: 0 } },
                { 'statistics.virtualGiftsDating': { $gt: 0 } },
            ],
        })

        if (!balanceDay) {
            res.send('Не найдено подарков')
            return
        }
        res.send(balanceDay.dateTimeId)
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

const sendEmailsToTranslators = async (req, res) => {
    const Translator = await getCollections().collectionTranslators
    const startOfPreviousMonth = moment()
        .utc()
        .subtract(1, 'month')
        .startOf('month')
        .format()
    const endOfYesterday = moment()
        .utc()
        .subtract(1, 'days')
        .endOf('day')
        .format()

    const queryForBalanceDays = {
        dateTimeId: {
            $gte: startOfPreviousMonth,
            $lte: endOfYesterday,
        },
    }
    const queryForClients = {
        suspended: false,
    }
    const translators = await Translator.find({
        'suspended.status': false,
        wantsToReceiveEmails: true,
        email: { $exists: true, $ne: '' },
    })
        .populate({
            path: 'statistics',
            match: queryForBalanceDays,
            populate: {
                path: 'client',
            },
        })
        .populate({
            path: 'clients',
            match: queryForClients,
        })
        .exec()
    if (translators.length === 0) {
        res.status(200).send('No translators found')
        return
    }
    const arrayOfTranslatorNames = await sendEmailTemplateToTranslators(
        translators
    )
    await sendEmailTemplateToAdministrators(translators)
    res.status(200).send(arrayOfTranslatorNames)
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

const PersonalPenalties = mongoose.model(
    'PersonalPenalties',
    PersonalPenaltiesSchema
)

const addPersonalPenaltyToTranslator = async (req, res) => {
    try {
        const collections = await getCollections()
        const Translator = collections.collectionTranslators
        const {
            translator: translatorId,
            dateTimeId,
            amount,
            description,
        } = req.body
        const translator = await Translator.findById(translatorId)
        if (!translator) {
            return res.status(404).send('Translator not found')
        }
        const penalty = new PersonalPenalties({
            translator: translatorId,
            dateTimeId,
            amount,
            description,
        })
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
const getPersonalPenalties = async (req, res) => {
    try {
        const { translatorId, dateTimeFilter } = req.query
        const collections = await getCollections()
        const Translator = collections.collectionTranslators
        const dateTimeFilterMoment = moment(dateTimeFilter).utc()
        const startOfMonth = dateTimeFilterMoment.startOf('month').format()
        const endOfMonth = dateTimeFilterMoment.endOf('month').format()
        const selectedTranslator = await Translator.findById(
            translatorId
        ).populate({
            path: 'personalPenalties',
            match: {
                dateTimeId: {
                    $gte: startOfMonth,
                    $lte: endOfMonth,
                },
            },
        })
        res.send(selectedTranslator?.personalPenalties ?? [])
    } catch (error) {
        console.error(
            'An error occurred while getting personal penalties:',
            error
        )
        res.status(500).send('An error occurred')
    }
}

const toggleSuspendClientResolver = async (req, res) => {
    try {
        const { translatorId, clientId } = req.body
        if (!translatorId || !clientId) {
            return res.status(400).send('Translator or client id is missing')
        }
        const Client = await getCollections().collectionClients
        const client = await Client.findOne({ _id: clientId })
        if (client.suspendedTranslators.includes(translatorId)) {
            await Client.updateOne(
                { _id: clientId },
                { $pull: { suspendedTranslators: translatorId } }
            )
            res.status(200).send('Client unsuspended successfully')
        } else {
            await Client.updateOne(
                { _id: clientId },
                { $addToSet: { suspendedTranslators: translatorId } }
            )
            res.status(200).send('Client suspended successfully')
        }
    } catch (error) {
        const errorMessage =
            'An error occurred while toggling client suspension'
        console.error(errorMessage, error)
        res.status(500).send(errorMessage)
    }
}

module.exports = {
    getAllTranslators,
    getLastVirtualGift,
    addNewTranslator,
    updateTranslator,
    deleteTranslator,
    sendEmailsToTranslators,
    assignClientToTranslator,
    addPersonalPenaltyToTranslator,
    getPersonalPenalties,
    toggleSuspendClientResolver,
}
