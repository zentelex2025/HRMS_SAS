import { userIndivisualAttendance } from "../services/attendance.service.js";

export const getAttendance = async () => {};
export const createAttendance = () => {};
export const getAttendanceById = async (req, res) => {
  const DATA = await userIndivisualAttendance();

  const ID = req.params.id;
  console.log({ ID });
  try {
    res.status(200).json({
      success: true,
      data: DATA,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
export const getAttendanceFromTill = () => {};
export const editAttendanceById = () => {};
