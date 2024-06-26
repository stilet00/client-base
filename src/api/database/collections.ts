import mongoose from "mongoose";
if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
	throw new Error(
		"DATABASE and DATABASE_PASSWORD environment variables are required",
	);
}
const DBConnectionCredentials = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD,
);
const { changeDatabaseInConnectionString } = require("./utils");
const { TaskSchema } = require("../models/taskListDatabaseModels");
const { ClientSchema } = require("../models/clientsDatabase");
const {
	TranslatorSchema,
	BalanceDaySchema,
} = require("../models/translatorsDatabaseModels");
const { PaymentSchema } = require("../models/statementsDatabaseModels");
const { AdminSchema } = require("../models/adminDatabaseModels");

const collections = new Map();

const connectToDatabase = async () => {
	try {
		const clientBaseDB = mongoose.createConnection(
			changeDatabaseInConnectionString(DBConnectionCredentials, "clientBase"),
		);
		const Task = clientBaseDB.model("Task", TaskSchema, "tasksCollection");
		const Client = clientBaseDB.model(
			"Client",
			ClientSchema,
			"clientsCollection",
		);
		const Translator = clientBaseDB.model(
			"Translator",
			TranslatorSchema,
			"translatorCollection",
		);
		const Admin = clientBaseDB.model("Admin", AdminSchema, "adminCollection");
		const Statement = clientBaseDB.model(
			"Statement",
			new mongoose.Schema(PaymentSchema, {
				collection: "statementsCollection",
			}),
		);
		const BalanceDay = clientBaseDB.model(
			"BalanceDay",
			BalanceDaySchema,
			"balanceDayCollection",
		);
		collections.set("collectionTasks", Task);
		collections.set("collectionClients", Client);
		collections.set("collectionClientsOnTranslators", Client);
		collections.set("collectionTranslators", Translator);
		collections.set("collectionAdmins", Admin);
		collections.set("collectionStatements", Statement);
		collections.set("collectionBalanceDays", BalanceDay);
	} catch (error) {
		console.error(error);
	}
};

enum CollectionNames {
	CollectionTasks = "collectionTasks",
	CollectionBalance = "collectionBalance",
	CollectionTaskNotifications = "collectionTaskNotifications",
	CollectionClients = "collectionClients",
	CollectionTranslators = "collectionTranslators",
	CollectionStatements = "collectionStatements",
	CollectionAdmins = "collectionAdmins",
	CollectionBalanceDays = "collectionBalanceDays",
}

const getCollections = () => {
	return Object.values(CollectionNames).reduce(
		(collectionsObject: { [key: string]: any }, collectionName) => {
			collectionsObject[collectionName] = collections.get(collectionName);
			return collectionsObject;
		},
		{},
	);
};

module.exports = {
	connectToDatabase,
	getCollections,
};
