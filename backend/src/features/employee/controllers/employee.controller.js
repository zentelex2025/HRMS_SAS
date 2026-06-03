import { getAllEmployees } from "../services/employee.service.js";

export const fetchEmployee = async (req, res) => {
  const DATA = await getAllEmployees();

  res.send(DATA);
};
export const createEmployee = () => {};
export const editEmployee = () => {};
export const deleteEmployee = () => {};
