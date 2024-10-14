import express from "express";
const { isAuthenticated, adminRules } = require("../firebase/firebaseAdmin");
const {
	getAllClients,
	addNewClient,
	updateClient,
	getClientsOverviewData,
} = require("../controllers/clientController");
const { clientsURL } = require("./routes");

const router = express.Router();

router.get(`${clientsURL}get`, isAuthenticated, getAllClients);
router.post(`${clientsURL}add`, adminRules, addNewClient);
router.put(`${clientsURL}:id`, isAuthenticated, updateClient);
router.get(`${clientsURL}overview`, isAuthenticated, getClientsOverviewData);

export default router;
