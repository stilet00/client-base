const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    taskName: { type: String, required: true, default: 'No task name' },
    completed: { type: Boolean, required: true, default: false },
    created: { type: String, required: true, default: Date.now },
})

module.exports = { taskSchema }
