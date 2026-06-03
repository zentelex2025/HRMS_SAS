import express from "express";
import {
  getAttendance,
  getAttendanceFromTill,
  createAttendance,
  getAttendanceById,
  editAttendanceById,
} from "../controllers/attendance.controller.js";

const router = express.Router();

// attendance/
router.get("/", getAttendance);
router.post("/create", createAttendance);
router.get("/get-by-id/:id", getAttendanceById);
router.get("/", getAttendanceFromTill);
router.put("/:id", editAttendanceById);

export default router;
