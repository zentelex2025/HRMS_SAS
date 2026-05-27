const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const holidayRoutes = require('./routes/holidayRoutes');

const app = express();
const PORT = 5019;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes ব্যবহার করা
app.use('/api', holidayRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});