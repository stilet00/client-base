const mongoose = require('mongoose')

const DaySchema = new mongoose.Schema({
    dayId: String,
    translator: { type: mongoose.Schema.Types.ObjectId, ref: 'Translator' },
    clients: [
        {
            client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
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
    ],
})

const MonthSchema = new mongoose.Schema({
    days: [DaySchema],
})

const YearSchema = new mongoose.Schema({
    year: String,
    months: [MonthSchema],
})

const SuspendedStatusSchema = new mongoose.Schema({
    status: Boolean,
    time: String,
})

const PersonalPenaltiesSchema = new mongoose.Schema({
    date: String,
    amount: String,
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
    statistics: [YearSchema],
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
}
