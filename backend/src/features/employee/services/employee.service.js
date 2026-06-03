import { ErrHandeler } from "../../../shared/utils/err.handelers.js";
import Employee from "../models/employee.model.js";

export async function getAllEmployees() {
  return await ErrHandeler(Employee.findAll());
}
