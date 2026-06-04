import {
  AddEmployee,
  deleteEmployeeById,
  editEmployeeById,
  getAllEmployees,
  getUserById,
} from "../services/employee.service.js";

export const fetchEmployee = async (req, res) => {
  res.send(await getAllEmployees());
};
export const createEmployee = async (req, res) => {
  res.send(await AddEmployee(req.body));
};
export const editEmployee = async (req, res) => {
  res.send(await editEmployeeById(req.params.id, req.body));
};
export const deleteEmployee = async (req, res) => {
  res.send(deleteEmployeeById(req.params.id));
};
export const getEmployeeById = async (req, res) => {
  res.send(await getUserById(req.params.id));
};
