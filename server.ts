import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./src/api/routes/authRoutes";
import clientRoutes from "./src/api/routes/clientRoutes";
import translatorRoutes from "./src/api/routes/translatorRoutes";
import taskRoutes from "./src/api/routes/taskRoutes";
import statementRoutes from "./src/api/routes/statementRoutes";
import balanceDayRoutes from "./src/api/routes/balanceDayRoutes";
import staticRoutes from "./src/api/routes/staticRoutes";
import businessAdminRoutes from "./src/api/routes/businessAdminsRoutes";
const { connectToDatabase } = require("./src/api/database/collections");

const PORT = process.env.PORT || 80;
const app = express();

const limiter = rateLimit({
	windowMs: 2000,
	max: 100,
	message: "Too many requests from this IP, please try again later.",
});

app.use(express.static(__dirname + "/build"));
app.set("view engine", "ejs");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use((request: Request, response: Response, next: NextFunction) => {
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-type, Accept, Authorization",
	);
	response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	next();
});
app.use(limiter);

// Use route files
app.use(authRoutes);
app.use(clientRoutes);
app.use(translatorRoutes);
app.use(taskRoutes);
app.use(statementRoutes);
app.use(balanceDayRoutes);
app.use(businessAdminRoutes);
app.use(staticRoutes);

const startServer = async () => {
	try {
		await connectToDatabase();
		app.listen(PORT, () => {
			console.log("API started at port", PORT);
		});
	} catch (err) {
		console.error("Failed to connect to MongoDB database", err);
		process.exit(1);
	}
};

startServer();
