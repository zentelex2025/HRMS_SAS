const express = require('express');
const cors = require('cors');
const recruitmentRoutes = require('./recruitment'); // This points to your recruitment logic

const app = express();

// Middleware
app.use(cors()); // CRITICAL: This allows your React app (Port 3000) to talk to this server
app.use(express.json());

// Routes
app.use('/api/recruitment', recruitmentRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});