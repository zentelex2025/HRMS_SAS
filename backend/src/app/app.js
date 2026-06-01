import express from "express";
import routes from "./routes.js";
const app = express();
app.use("/api", routes);

app.use(express.json());
export default app;
