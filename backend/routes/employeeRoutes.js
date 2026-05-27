import express from "express";
import multer from "multer";
import {
  createEmployee,
  getMyEmployeeProfile,
  applyLeave,
  markCheckIn,
  markCheckOut,
  getMyAttendance,
} from "../controllers/employeeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================
// MULTER CONFIG
// =====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });

// =====================
// FILE FIELDS (MULTIPLE)
// =====================

const employeeUpload = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "govId", maxCount: 1 },

  // max 4 education marksheets
  { name: "education[0][marksheet]", maxCount: 1 },
  { name: "education[1][marksheet]", maxCount: 1 },
  { name: "education[2][marksheet]", maxCount: 1 },
  { name: "education[3][marksheet]", maxCount: 1 },

  // experience certificates (infinite)
  { name: "experience[0][expCertificate]", maxCount: 1 },
  { name: "experience[1][expCertificate]", maxCount: 1 },
  { name: "experience[2][expCertificate]", maxCount: 1 },
  { name: "experience[3][expCertificate]", maxCount: 1 },
]);

// =====================
// ROUTES
// =====================

// CREATE EMPLOYEE (WITH FILE UPLOAD)
router.post(
  "/create",
  authMiddleware,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "govId", maxCount: 1 },
    { name: "education[0][marksheet]" },
    { name: "education[1][marksheet]" },
    { name: "education[2][marksheet]" },
    { name: "education[3][marksheet]" },
    { name: "experience[0][expCertificate]" },
    { name: "experience[1][expCertificate]" },
    { name: "experience[2][expCertificate]" },
    { name: "experience[3][expCertificate]" },
  ]),
  createEmployee
);

// GET MY EMPLOYEE PROFILE
router.get("/me", authMiddleware, getMyEmployeeProfile);

// APPLY LEAVE
router.post("/apply", authMiddleware, upload.single("document"), applyLeave);

// CHECK-IN
router.post("/check-in", authMiddleware, markCheckIn);

// CHECK-OUT
router.put("/check-out", authMiddleware, markCheckOut);

// GET ALL MY ATTENDANCE
router.get("/my", authMiddleware, getMyAttendance);

export default router;
