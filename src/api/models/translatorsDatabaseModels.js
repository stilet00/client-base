const mongoose = require('mongoose')

const BalanceDaySchema = new mongoose.Schema({
    dateTimeId: Date,
    translator: { type: mongoose.Schema.Types.ObjectId, ref: 'Translator' },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    statistics: {
        chats: Number,
        letters: Number,
        dating: Number,
        virtualGiftsSvadba: Number,
        virtualGiftsDating: Number,
        photoAttachments: Number,
        phoneCalls: Number,
        penalties: Number,
        comments: String,
    },
})

const SuspendedStatusSchema = new mongoose.Schema({
    status: Boolean,
    time: Date,
})

const PersonalPenaltiesSchema = new mongoose.Schema({
    translator: { type: mongoose.Schema.Types.ObjectId, ref: 'Translator' },
    date: Date,
    amount: Number,
    description: String,
})

const TranslatorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
    },
    surname: {
        type: String,
        required: [true, 'Please tell us your name!'],
    },
    clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }],
    statistics: [BalanceDaySchema],
    edited: Boolean,
    suspended: SuspendedStatusSchema,
    personalPenalties: [PersonalPenaltiesSchema],
    email: {
        type: String,
        lowercase: true,
        required: false,
    },
    password: {
        type: String,
        lowercase: true,
        required: false,
    },
    wantsToReceiveEmails: Boolean,
})

module.exports = {
    TranslatorSchema,
    BalanceDaySchema,
}
