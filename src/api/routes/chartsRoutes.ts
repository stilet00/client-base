import express from "express";
const { isAuthenticated } = require("../firebase/firebaseAdmin");
const { getCharts } = require("../controllers/chartsController");

const { chartsURL } = require("./routes");

const router = express.Router();

router.get(chartsURL, isAuthenticated, getCharts);

export default router;
