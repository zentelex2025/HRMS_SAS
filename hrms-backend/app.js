// NOT TO BE CALLED DIRECTLY - THIS FILE IS IMPORTED IN server.js
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);

app.get("/", (req, res) => {
  res.send("✅ HR Portal API running");
});

module.exports = app;
