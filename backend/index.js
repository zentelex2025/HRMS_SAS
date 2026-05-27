const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/employees", (req, res) => {
  res.json([
    {
      employee_id: 1,
      employee_code: "EMP001",
      first_name: "Tonuja",
      last_name: "Sarkar",
      department_id: "HR",
      status: "Active",
      joining_date: "2024-01-01",
      performance: 4.5,
    },
  ]);
});

app.listen(8080, () => console.log("Server running on port 8080"));
