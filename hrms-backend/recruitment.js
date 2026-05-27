const express = require('express');
const cors = require('cors');
const recruitmentRoutes = require('./routes/recruitmentRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/recruitment', recruitmentRoutes);

const PORT = 5023;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));