import { Router } from "express";
// import authRoutes from "../features/auth/api/auth.routes.js";
import employeeRoutes from "../features/employee/api/employee.routes.js";
import attendanceRoutes from "../features/attendance/api/attendance.routes.js";
import interviewRoutes from "../features/interview/api/interview.routes.js";

const router = Router();

// /api GLOBALY STARTS
// router.use("/auth", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/interview", interviewRoutes);

export default router;
