const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
    registeredEmail: String,
})

module.exports = { AdminSchema }
