const express = require('express');
const cors = require('cors');
const resignationRoutes = require("./routes/ResignationRoutes");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/resignations", resignationRoutes);
// Final 404 handler - triggers if no other routes match
app.use((req, res) => {
    res.status(404).json({
        success: false, 
        message: "Route not found."
    });
});
const PORT = 5020;
app.listen(PORT, () => 
    console.log(`Server running on http://localhost:${PORT}`));
