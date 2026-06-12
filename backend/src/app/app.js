import express from "express";
import routes from "./routes.js";
import sequelize from "../config/database.js";
import { ErrHandeler } from "../shared/utils/err.handelers.js";
import cors from "cors";
const app = express();
import bodyParser from "body-parser";

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use("/api", routes);

const sequelize_data = await ErrHandeler(sequelize.authenticate());
console.log("DB connection :", sequelize_data.success);
export default app;
