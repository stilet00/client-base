import { Translator } from '../models/translatorsDatabaseModels'
import { Request, Response } from 'express'
import { MongoError, DeleteResult, ObjectId } from 'mongodb'
import mongoose, { Query } from 'mongoose'

const { getCollections } = require('../database/collections')

const {
    sendEmailTemplateToAdministrators,
    sendEmailTemplateToTranslators,
} = require('../email-api/financeEmailAPI')
const {
    PersonalPenaltiesSchema,
} = require('../models/translatorsDatabaseModels')
const { getMomentUTC } = require('../utils/utils')

const getAllTranslators = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const hasSearchQuery: boolean = !!req.query?.searchQuery
        const hasShouldGetClients: boolean = !!req.query?.shouldGetClients
        let query: Query<Translator[], Translator> =
            getCollections().collectionTranslators.find()
        if (hasShouldGetClients) {
            query = query.populate('clients')
        }
        const translators: Translator[] = await query.exec()
        res.send(translators)
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message)
        }
        res.sendStatus(500)
    }
}

async function getLastVirtualGift(req: Request, res: Response): Promise<void> {
    try {
        if (!req.params.id) {
            res.send('Отсутствует id переводчика')
            return
        }
        const BalanceDay = await getCollections().collectionBalanceDays
        const translatorObjectId = (ObjectId as any)(req.params.id)
        const balanceDay = await BalanceDay.findOne({
            translator: translatorObjectId,
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
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message)
        } else {
            res.status(500).send('An error occurred')
        }
    }
}

const addNewTranslator = async (req: Request, res: Response) => {
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

const updateTranslator = async (req: Request, res: Response) => {
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
            const translatorObjectId = (ObjectId as any)(req.params.id)
            await Translator.updateOne(
                { _id: translatorObjectId },
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
        if (error instanceof Error) {
            res.status(500).send(error.message)
        } else {
            res.status(500).send('An error occurred')
        }
    }
}

const deleteTranslator = (req: Request, res: Response) => {
    const translatorObjectId = (ObjectId as any)(req.params.id)
    getCollections().collectionTranslators.deleteOne(
        { _id: translatorObjectId },
        (err: MongoError, docs: DeleteResult) => {
            if (err) {
                return res.sendStatus(500)
            }
            res.sendStatus(200)
        }
    )
}

const sendEmailsToTranslators = async (req: Request, res: Response) => {
    const Translator = await getCollections().collectionTranslators
    const startOfPreviousMonth = getMomentUTC()
        .subtract(1, 'month')
        .startOf('month')
        .format()
    const endOfYesterday = getMomentUTC()
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

const assignClientToTranslator = async (req: Request, res: Response) => {
    try {
        const { clientId, translatorId } = req.body
        const collections = await getCollections()
        const Translators = collections.collectionTranslators
        const Clients = collections.collectionClients
        const translatorObjectId = (ObjectId as any)(translatorId)
        const clientObjectId = (ObjectId as any)(clientId)
        const translatorResult = await Translators.updateOne(
            { _id: translatorObjectId },
            { $addToSet: { clients: clientObjectId } }
        )

        const clientResult = await Clients.updateOne(
            { _id: clientObjectId },
            { $addToSet: { translators: translatorObjectId } }
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

const addPersonalPenaltyToTranslator = async (req: Request, res: Response) => {
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
const getPersonalPenalties = async (req: Request, res: Response) => {
    try {
        const { translatorId, dateTimeFilter } = req.query
        const collections = await getCollections()
        const Translator = collections.collectionTranslators
        const dateTimeFilterMoment = getMomentUTC(dateTimeFilter)
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

const toggleSuspendClientResolver = async (req: Request, res: Response) => {
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
