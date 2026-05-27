const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const appraisalRoutes = require('./routes/appraisalRoutes');

const app = express();
const PORT = 5020;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use('/api', appraisalRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});