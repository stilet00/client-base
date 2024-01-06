const { getCollections } = require('../database/collections')

const getAllTasks = async (request, response) => {
    const tasksCollection = await getCollections().collectionTasks.find().exec()
    response.send(tasksCollection)
}

const editTask = async (request, response) => {
    const Task = await getCollections().collectionTasks
    try {
        await Task.updateOne(
            { _id: request.params.id },
            {
                $set: {
                    completed: request.body.completed,
                    doneAt: request.body.doneAt,
                },
            }
        )
        response.sendStatus(200)
    } catch (err) {
        console.log(err)
        response.sendStatus(500)
    }
}

const deleteTask = async (request, response) => {
    const Task = await getCollections().collectionTasks
    try {
        await Task.deleteOne({ _id: request.params.id })
        response.sendStatus(200)
    } catch (err) {
        console.log(err)
        response.sendStatus(500)
    }
}

const createTask = async (request, response) => {
    if (request.body?.taskName) {
        const Task = await getCollections().collectionTasks
        const taskCreateInput = { ...request.body }
        try {
            const result = await Task.create(taskCreateInput)
            response.send(result._id)
        } catch (err) {
            response.sendStatus(500)
        }
    } else {
        response.send('No task task name')
    }
}

module.exports = {
    getAllTasks,
    deleteTask,
    editTask,
    createTask,
}
