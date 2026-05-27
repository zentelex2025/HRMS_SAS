import Employee from "../models/Employee.js";
import User from "../models/User.js";
import Leave from "../models/Leave.js";
import Attendance from "../models/Attendance.js";

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ name: 1 }); // sorted by name
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};








export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employeeId", "name email department designation phone")
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body; // "Approved" or "Rejected"

    const leave = await Leave.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true }
    );

    if (!leave)
      return res.status(404).json({ message: "Leave request not found" });

    res.status(200).json({
      message: "Leave status updated",
      leave,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate("userId", "name email"); // 👉 populate name

    res.json({
      success: true,
      attendance,
    });
  } catch (error) {
    console.error("Attendance fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
