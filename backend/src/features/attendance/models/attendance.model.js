import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const Attendance = sequelize.define(
  "Attendance",
  {
    attendance_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    employee_name: {
      type: DataTypes.STRING(150),
      // allowNull: true,
    },

    attendance_date: {
      type: DataTypes.DATEONLY,
      // allowNull: true,
    },

    shift_name: {
      type: DataTypes.STRING(100),
      // allowNull: true,
    },

    start_time: {
      type: DataTypes.TIME,
      // allowNull: true,
    },

    end_time: {
      type: DataTypes.TIME,
      // allowNull: true,
    },

    check_in: {
      type: DataTypes.TIME,
    },

    check_out: {
      type: DataTypes.TIME,
      // allowNull: true,
    },

    late_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    work_hours: {
      type: DataTypes.DECIMAL(5, 2),
      // allowNull: true,
    },

    status: {
      type: DataTypes.STRING(50),
      // allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "attendance",
    timestamps: false,
  },
);

export default Attendance;
