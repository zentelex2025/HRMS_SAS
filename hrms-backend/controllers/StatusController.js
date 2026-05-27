// controllers/statsController.js
const statsModel = require("../Models/StatusModal");

const getStats = (req, res) => {
  statsModel.getSummary((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
};

module.exports = { getStats };