import { ErrHandeler } from "../../../shared/utils/err.handelers.js";
import Attendance from "../models/Attendance.model.js";

export async function getAllAttendance() {
  return await ErrHandeler(Attendance.findAll());
}

export async function addAttendance(body) {
  return await ErrHandeler(Attendance.create(body));
}
