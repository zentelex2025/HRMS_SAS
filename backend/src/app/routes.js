import { Router } from "express";
import authRoutes from "../features/auth/api/auth.routes.js";
import employeeRoutes from "../features/employee/api/employee.routes.js";
import attendanceRoutes from "../features/attendance/api/attendance.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/attendance", attendanceRoutes);

export default router;
