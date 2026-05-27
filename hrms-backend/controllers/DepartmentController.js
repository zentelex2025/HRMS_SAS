// controllers/departmentController.js
const departmentModel = require("../Models/departmentModel1");

const getDepartments = (req, res) => {
  departmentModel.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

module.exports = { getDepartments };