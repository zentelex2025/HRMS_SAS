const express     = require('express');
const cors        = require('cors');
const app         = express();
const leaveRoutes = require('./routes/leaveRoutes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', leaveRoutes);

app.listen(5003, () => console.log("🚀 Leave API running on http://localhost:5003"));