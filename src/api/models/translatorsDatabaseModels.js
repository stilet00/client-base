const mongoose = require('mongoose')

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
    statistics: [
        {
            year: String,
            months: [
                [
                    {
                        id: String,
                        clients: [
                            {
                                id: String,
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
                    },
                ],
            ],
        },
    ],
    edited: Boolean,
    suspended: {
        status: Boolean,
        time: String,
    },
    personalPenalties: [
        {
            date: String,
            amount: String,
            description: String,
            _id: String,
        },
    ],
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
