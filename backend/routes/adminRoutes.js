import express from "express";
import {
  getAllAttendance,
  getAllEmployees,
  getAllLeaves,
  updateLeaveStatus,
} from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/total", getAllEmployees);
router.get("/all", getAllLeaves);
router.put("/update/:leaveId", updateLeaveStatus);
// ADMIN
router.get("/allattendence", authMiddleware, getAllAttendance); // admin only

export default router;
