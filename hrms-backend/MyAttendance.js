const express          = require('express');
const cors             = require('cors');
const attendanceRoutes = require('./routes/attendanceRoutes');

require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', attendanceRoutes);

const PORT = 5010;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
