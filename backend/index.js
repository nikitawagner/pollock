import morgan from "morgan";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import pollRouter from "./router/pollRouter.js";
import voteRouter from "./router/voteRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/poll", pollRouter);
app.use("/vote", voteRouter);
app.get("/", (req, res, next) => {
	res.status(200).json({ message: "Hallo" });
});

app.listen(49706, () => {
	console.log("Listening on Port 49706");
});