import {
  sharedAddingData,
  sharedDeleteUser,
  sharedFetchAll,
  sharedGetDataById,
  sharedUpdatingUser,
} from "../../../shared/services/crud.service.js";
import Employee from "../models/employee.model.js";

export async function getAllEmployees() {
  return await sharedFetchAll(Employee);
}

export async function AddEmployee(body) {
  return await sharedAddingData(body, Employee);
}

export async function editEmployeeById(id, body) {
  return await sharedUpdatingUser(id, body, Employee);
}
export async function deleteEmployeeById(id) {
  return await sharedDeleteUser(id, "id", Employee);
}
export async function getUserById(id) {
  return await sharedGetDataById(id, Employee);
}
