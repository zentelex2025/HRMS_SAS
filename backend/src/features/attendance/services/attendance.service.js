import { Op } from "sequelize";
import { ErrHandeler } from "../../../shared/utils/err.handelers.js";
import Attendance from "../models/Attendance.model.js";

export async function getAllAttendance() {
  return await ErrHandeler(Attendance.findAll());
}

export async function addAttendance(body) {
  return await ErrHandeler(Attendance.create(body));
}

export async function getUserAttendanceById(attendanceId) {
  return await ErrHandeler(Attendance.findByPk(attendanceId));
}

export async function getUserFromToTillByDate(dates) {
  const { fromDate: FD, toDate: TD } = dates;

  return await ErrHandeler(
    Attendance.findAll({
      where: {
        attendance_date: {
          [Op.between]: [FD, TD],
        },
      },
    }),
  );
}

export async function updateUserById(id, body) {
  return await ErrHandeler(
    Attendance.update(body, {
      where: {
        attendance_id: id,
      },
    }),
  );
}
