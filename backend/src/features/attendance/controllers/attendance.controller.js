import {
  addAttendance,
  getAllAttendance,
  getUserAttendanceById,
  getUserFromToTillByDate,
  updateUserById,
} from "../services/attendance.service.js";

export const getAttendance = async (req, res) => {
  const DATA = await getAllAttendance();
  res.send(DATA);
};
export const createAttendance = async (req, res) => {
  const BODY_DATA = req.body;
  res.send(await addAttendance(BODY_DATA));
};
export const getAttendanceById = async (req, res) => {
  res.send(await getUserAttendanceById(req.params.id));
};
export const getAttendanceFromTill = async (req, res) => {
  res.send(await getUserFromToTillByDate(req.query));
};
export const editAttendanceById = async (req, res) => {
  res.send(await updateUserById(req.params.id, req.body));
};
