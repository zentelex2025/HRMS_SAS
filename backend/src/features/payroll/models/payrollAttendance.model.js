import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const PayrollAttendance = sequelize.define(
  "PayrollAttendance",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    emp_id: {
      type: DataTypes.STRING(50),
    },

    att_date: {
      type: DataTypes.DATEONLY,
    },

    status: {
      type: DataTypes.STRING(50),
    },

    in_time: {
      type: DataTypes.TIME,
    },

    out_time: {
      type: DataTypes.TIME,
    },

    month_year: {
      type: DataTypes.STRING(20),
    },
  },
  {
    tableName: "payroll_attendance",
    timestamps: false,
  },
);

export default PayrollAttendance;
