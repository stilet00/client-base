const { getCollections } = require("../database/collections");

const getAllTasks = async (request, response) => {
	const tasksCollection = await getCollections().collectionTasks.find().exec();
	response.send(tasksCollection);
};

const editTask = async (request, response) => {
	try {
		const Task = await getCollections().collectionTasks;
		await Task.updateOne(
			{ _id: request.params.id },
			{
				$set: {
					completed: request.body.completed,
					doneAt: request.body.doneAt,
				},
			},
		);
		response.sendStatus(200);
	} catch (err) {
		console.error(err);
		response.sendStatus(500);
	}
};

const deleteTask = async (request, response) => {
	try {
		const Task = await getCollections().collectionTasks;
		await Task.deleteOne({ _id: request.params.id });
		response.sendStatus(200);
	} catch (err) {
		console.error(err);
		response.sendStatus(500);
	}
};

const createTask = async (request, response) => {
	try {
		if (request.body?.taskName) {
			const Task = await getCollections().collectionTasks;
			const taskCreateInput = { ...request.body };
			const result = await Task.create(taskCreateInput);
			response.send(result._id);
		} else {
			response.send("No task task name");
		}
	} catch (err) {
		console.error(err);
		response.sendStatus(500);
	}
};

module.exports = {
	getAllTasks,
	deleteTask,
	editTask,
	createTask,
};
