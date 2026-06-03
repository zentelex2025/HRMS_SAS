import {
  addAttendance,
  getAllAttendance,
} from "../services/attendance.service.js";

export const getAttendance = async (req, res) => {
  const DATA = await getAllAttendance();
  res.send(DATA);
};
export const createAttendance = async (req, res) => {
  const BODY_DATA = req.body;
  return res.send(addAttendance(BODY_DATA));
};
export const getAttendanceById = async () => {};
export const getAttendanceFromTill = () => {};
export const editAttendanceById = () => {};
