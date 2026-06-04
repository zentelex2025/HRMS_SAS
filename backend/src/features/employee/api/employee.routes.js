import express from "express";
import {
  createEmployee,
  deleteEmployee,
  editEmployee,
  fetchEmployee,
  getEmployeeById,
} from "../controllers/employee.controller.js";

const router = express.Router();

// /employees
router.get("/", fetchEmployee);
router.get("/:id", getEmployeeById);
router.post("/", createEmployee);
router.patch("/:id", editEmployee);
router.delete("/:id", deleteEmployee);

export default router;
