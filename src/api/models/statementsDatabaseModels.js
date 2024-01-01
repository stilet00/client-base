const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({
    receiver: { type: String, required: true },
    amount: { type: Number, required: true },
    sender: { type: String, required: true },
    comment: { type: String, required: true },
    date: { type: Date, required: true },
})

module.exports = {
    PaymentSchema,
}
