const mongoose = require('mongoose')

const ClientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    bankAccount: { type: String, required: true },
    instagramLink: { type: String, required: true },
    suspended: { type: Boolean, default: false },
    svadba: {
        login: { type: String, required: true },
        password: { type: String, required: true },
    },
    dating: {
        login: { type: String, required: true },
        password: { type: String, required: true },
    },
    translators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Translator' }],
    image: { type: String, required: false },
})
module.exports = { ClientSchema }
