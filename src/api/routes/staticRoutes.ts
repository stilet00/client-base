import express from "express";
import { Request, Response, NextFunction } from "express";

const { rootURL } = require("./routes");

const router = express.Router();

const sendIndexHtml = (req: Request, res: Response) => {
	res.sendFile(__dirname + "/build/index.html");
};

router.get(rootURL + "chart/", sendIndexHtml);
router.get(rootURL + "chart?", sendIndexHtml);
router.get(rootURL + "overview/?", sendIndexHtml);
router.get(rootURL + "clients/true?", sendIndexHtml);
router.get(rootURL + "clients/?", sendIndexHtml);
router.get(rootURL + "tasks/?", sendIndexHtml);
router.get(rootURL + "translators/?", sendIndexHtml);
router.get(rootURL + "finances/?", sendIndexHtml);

export default router;
