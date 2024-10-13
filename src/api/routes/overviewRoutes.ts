import express from "express";
import { getOverviewData } from "../controllers/overviewController";

const { overviewURL } = require("./routes");
const { isAuthenticated } = require("../firebase/firebaseAdmin");

const router = express.Router();
router.get(`${overviewURL}/get`, isAuthenticated, getOverviewData);

export default router;
