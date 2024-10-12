import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import authRoutes from "./src/api/routes/authRoutes";
import clientRoutes from "./src/api/routes/clientRoutes";
import translatorRoutes from "./src/api/routes/translatorRoutes";
import taskRoutes from "./src/api/routes/taskRoutes";
import statementRoutes from "./src/api/routes/statementRoutes";
import balanceDayRoutes from "./src/api/routes/balanceDayRoutes";
import staticRoutes from "./src/api/routes/staticRoutes";
import businessAdminRoutes from "./src/api/routes/businessAdminsRoutes";
import chartsRoutes from "./src/api/routes/chartsRoutes";
import overviewRoutes from "./src/api/routes/overviewRoutes";
const { rootURL } = require("./src/api/routes/routes");
const { connectToDatabase } = require("./src/api/database/collections");

type Environment = "staging" | "production" | "development";

const rootURLOptions: Record<Environment, string> = {
	staging: "https://sunrise-agency-staging-73929348db48.herokuapp.com",
	production: "https://sunrise-agency.herokuapp.com",
	development: "http://localhost:3000",
};
const currentEnvironment: Environment =
	(process.env.NODE_ENV as Environment) || "development";
const frontEndURL = rootURLOptions[currentEnvironment];
const PORT = process.env.PORT || 80;
const app = express();
const corsOptions = {
	origin: frontEndURL,
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	allowedHeaders: [
		"Origin",
		"X-Requested-With",
		"Content-Type",
		"Accept",
		"Authorization",
	],
	preflightContinue: false,
	optionsSuccessStatus: 204,
};

const limiter = rateLimit({
	windowMs: 2000,
	max: 100,
	message: "Too many requests from this IP, please try again later.",
});

app.use(cors(corsOptions));

app.options("*", (req, res) => {
	res.setHeader("Access-Control-Allow-Origin", frontEndURL);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET,HEAD,PUT,PATCH,POST,DELETE",
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		req.header("Access-Control-Request-Headers") || "",
	);
	res.sendStatus(204);
});

app.use(express.static(path.join(__dirname, "build")));
app.set("view engine", "ejs");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.get(`${rootURL}chart/?`, (request, response, next) => {
	response.sendFile(`${__dirname}/build/index.html`);
});
app.get(`${rootURL}overview/?`, (request, response, next) => {
	response.sendFile(`${__dirname}/build/index.html`);
});
app.get(`${rootURL}clients/true?`, (request, response, next) => {
	response.sendFile(`${__dirname}/build/index.html`);
});
app.get(`${rootURL}clients/?`, (request, response, next) => {
	response.sendFile(`${__dirname}/build/index.html`);
});
app.get(`${rootURL}tasks/?`, (request, response, next) => {
	response.sendFile(`${__dirname}/build/index.html`);
});
app.get(`${rootURL}translators/?`, (request, response, next) => {
	response.sendFile(`${__dirname}/build/index.html`);
});
app.get(`${rootURL}finances/?`, (request, response, next) => {
	response.sendFile(`${__dirname}/build/index.html`);
});
app.get(`${rootURL}business-admins/?`, (request, response, next) => {
	response.sendFile(`${__dirname}/build/index.html`);
});

app.use(authRoutes);
app.use(clientRoutes);
app.use(translatorRoutes);
app.use(taskRoutes);
app.use(statementRoutes);
app.use(balanceDayRoutes);
app.use(businessAdminRoutes);
app.use(staticRoutes);
app.use(chartsRoutes);
app.use(overviewRoutes);

const startServer = async () => {
	try {
		await connectToDatabase();
		app.listen(PORT, () => {
			console.log("Sunrise Agency API started at port", PORT);
		});
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

startServer();
