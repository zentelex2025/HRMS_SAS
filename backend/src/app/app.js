import express from "express";
import routes from "./routes.js";
import sequelize from "../config/database.js";
import { ErrHandeler } from "../shared/utils/err.handelers.js";
const app = express();
import bodyParser from "body-parser";

app.use(express.json());
app.use(bodyParser.json());
app.use("/api", routes);

const sequelize_data = await ErrHandeler(sequelize.authenticate());
console.log("DB connection :", sequelize_data.success);
export default app;
