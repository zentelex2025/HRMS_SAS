const express = require("express");
const cors    = require("cors");

const resignationRoutes = require("./routes/ResignationRoutes");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","PATCH","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/resignations", resignationRoutes);

app.get("/", (req, res) => res.json({ status: "ok", message: "HRMS Resignation API running" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const PORT = 5020;
app.listen(PORT, () => {
  console.log(`✅ Server running → http://localhost:${PORT}`);
  console.log(`📋 Resignations  → http://localhost:${PORT}/api/resignations`);
});