import express from "express";
import {
  createEmployee,
  deleteEmployee,
  editEmployee,
  fetchEmployee,
} from "../controllers/employee.controller.js";

const router = express.Router();

router.get("/fetch", fetchEmployee);
router.post("/create", createEmployee);
router.put("/edit", editEmployee);
router.delete("/delete", deleteEmployee);

export default router;
