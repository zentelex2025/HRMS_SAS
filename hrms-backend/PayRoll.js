const express = require("express");
const cors = require("cors");
const payrollRoutes = require("./routes/payrollRoutes");

const app = express();
const PORT = 5007;

app.use(cors());
app.use(express.json());

// Main API Route Setup
app.use("/api/payroll", payrollRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));