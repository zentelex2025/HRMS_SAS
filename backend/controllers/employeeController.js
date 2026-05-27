import Employee from "../models/Employee.js";
import User from "../models/User.js";
import Leave from "../models/Leave.js";
import Attendance from "../models/Attendance.js";
import moment from "moment";

export const createEmployee = async (req, res) => {
  try {
    const userId = req.user.id; // JWT user

    // Prevent multiple employee records for same user
    const existing = await Employee.findOne({ userId });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Employee already exists for this user" });
    }

    // ==============================
    // PARSE EDUCATION ARRAY
    // ==============================
    let education = [];
    if (req.body.education) {
      try {
        education = JSON.parse(req.body.education);
      } catch {
        education = req.body.education;
      }
    }

    // Attach marksheet files
    if (req.files) {
      Object.keys(req.files).forEach((fileKey) => {
        if (fileKey.startsWith("education")) {
          const index = fileKey.match(/\[(\d+)\]/)[1];
          if (education[index]) {
            education[index].marksheet = req.files[fileKey][0].path;
          }
        }
      });
    }

    // ==============================
    // PARSE EXPERIENCE ARRAY
    // ==============================
    let experience = [];
    if (req.body.experience) {
      try {
        experience = JSON.parse(req.body.experience);
      } catch {
        experience = req.body.experience;
      }
    }

    // Attach experience certificate files
    if (req.files) {
      Object.keys(req.files).forEach((fileKey) => {
        if (fileKey.startsWith("experience")) {
          const index = fileKey.match(/\[(\d+)\]/)[1];
          if (experience[index]) {
            experience[index].expCertificate = req.files[fileKey][0].path;
          }
        }
      });
    }

    // ==============================
    // AUTO GENERATE EMPLOYEE ID
    // ==============================
    const lastEmployee = await Employee.findOne().sort({ createdAt: -1 });

    let employeeId = "EMP0001";

    if (lastEmployee && lastEmployee.employeeId) {
      const lastNumber = parseInt(lastEmployee.employeeId.replace("EMP", ""));
      employeeId = "EMP" + String(lastNumber + 1).padStart(4, "0");
    }

    // ==============================
    // MAIN EMPLOYEE DATA
    // ==============================
    const employeeData = {
      userId,
      employeeId, // ✅ auto generated ID

      name: req.body.name,
      gender: req.body.gender,
      email: req.body.email,
      phone: req.body.phone,
      dob: req.body.dob,
      address: req.body.address,
      department: req.body.department,
      designation: req.body.designation,
      joinDate: req.body.joinDate,

      maritalStatus: req.body.maritalStatus,
      religion: req.body.religion,
      bloodGroup: req.body.bloodGroup,
      languageKnown: req.body.languageKnown,

      emergencyContact: req.body.emergencyContact,

      education,
      experience,

      photo: req.files?.photo ? req.files.photo[0].path : null,
      govId: req.files?.govId ? req.files.govId[0].path : null,
    };

    const employee = new Employee(employeeData);
    await employee.save();

    // Update user table
    await User.findByIdAndUpdate(userId, { employeeId: employee._id });

    res.status(201).json({
      message: "Employee data saved successfully",
      employee,
    });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};



export const getMyEmployeeProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get employee data
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      return res.status(404).json({ message: "Employee data not found" });
    }

    // ⭐ Get today's date
    const today = moment().format("YYYY-MM-DD");

    // ⭐ Get today's attendance
    const todayAttendance = await Attendance.findOne({
      userId,
      date: today,
    });

    // ⭐ Return employee and today's attendance together
    res.json({
      ...employee._doc,
      todayAttendance: todayAttendance || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// APPLY LEAVE CONTROLLER
export const applyLeave = async (req, res) => {
  try {
    const userId = req.user.id; // logged-in userId from token

    // Find employeeId for this user
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      return res.status(404).json({ message: "Employee record not found" });
    }

    // Frontend fields
    const { leaveType, fromDate, toDate, reason } = req.body;

    if (!leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // File upload (multer)
    let documentFile = null;
    if (req.file) {
      documentFile = req.file.filename;
    }

    // Create new leave request
    const leave = new Leave({
      userId,
      employeeId: employee._id,
      leaveType,
      startDate: fromDate, // backend expects startDate
      endDate: toDate, // backend expects endDate
      reason,
    });

    await leave.save();

    res.status(201).json({
      message: "Leave applied successfully!",
      leave,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
export const markCheckIn = async (req, res) => {
  try {
    const userId = req.user.id; // FIXED

    // Get employee
    const employee = await Employee.findOne({ userId });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const today = moment().format("YYYY-MM-DD");
    const currentTime = moment().format("HH:mm:ss");

    const graceTime = moment("10:15:00", "HH:mm:ss");

    let attendance = await Attendance.findOne({ userId, date: today });
    if (attendance && attendance.checkIn)
      return res.status(400).json({ message: "Already checked in today" });

    if (!attendance) {
      attendance = new Attendance({
        userId,
        date: today,
        checkIn: currentTime,
      });
    } else {
      attendance.checkIn = currentTime;
    }

    // LATE CHECK
    const isLate = moment(currentTime, "HH:mm:ss").isAfter(graceTime);

    if (isLate) {
      employee.lateCount += 1;

      if (employee.lateCount >= 3) {
        attendance.status = "Absent";
        employee.lateCount = 0;
      } else {
        attendance.status = "Late Present"; // FIXED
      }
    } else {
      attendance.status = "Present"; // FIXED
    }

    await attendance.save();
    await employee.save();

    res.json({
      message: "Check-In recorded",
      checkIn: currentTime,
      status: attendance.status,
      isLate,
      lateCount: employee.lateCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ----------------------
// Employee Check-Out
// ----------------------
export const markCheckOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = moment().format("YYYY-MM-DD");

    let attendance = await Attendance.findOne({ userId, date: today });

    if (!attendance) {
      return res.status(404).json({ message: "Check-in not found" });
    }

    attendance.checkOut = moment().format("HH:mm:ss");
    await attendance.save();

    res.status(200).json({ message: "Check-out successful", attendance });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

// ----------------------
// Employee: Get Own Attendance
// ----------------------
export const getMyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const attendance = await Attendance.find({ userId }).sort({ date: -1 });
    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};
