const Employee = require("../Models/EmployeeModel3");

// ✅ LOGIN
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required!",
    });
  }

  Employee.findByEmail(email, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "DB error",
        error: err.message,
      });
    }

    // Email পাওয়া যায়নি
    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Email not found! Contact HR.",
      });
    }

    const employee = results[0];

    // Password set নেই
    if (!employee.password) {
      return res.status(401).json({
        success: false,
        message: "Password not set. Contact HR!",
      });
    }

    // Password ভুল
    if (employee.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password!",
      });
    }

    // ✅ Login success
    const fullName = [employee.first_name, employee.last_name]
      .filter(Boolean)
      .join(" ");

    return res.json({
      success: true,
      message: "Login successful",
      employee: {
        emp_id: employee.employee_id,
        name: fullName || "Employee",
        designation: employee.designation || "",
        email: employee.email,
        phone: employee.phone_no || "",
      },
      token: "employee-session-" + employee.employee_id,
    });
  });
};

// ✅ GET Employee by ID
const getEmployeeById = (req, res) => {
  const { empId } = req.params;

  Employee.findById(empId, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "DB error",
        error: err.message,
      });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    return res.json({ success: true, employee: results[0] });
  });
};

// ✅ DEBUG — সব employee দেখো
const getAllEmployees = (req, res) => {
  Employee.findAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.json({ count: results.length, employees: results });
  });
};

module.exports = { login, getEmployeeById, getAllEmployees };