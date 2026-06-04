import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const EmployeeLeave = sequelize.define(
  "EmployeeLeave",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "employees",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    employee_code: {
      type: DataTypes.STRING(50),
    },

    employee_name: {
      type: DataTypes.STRING(150),
    },

    leave_code: {
      type: DataTypes.STRING(20),
    },

    leave_type: {
      type: DataTypes.STRING(100),
    },

    from_date: {
      type: DataTypes.DATEONLY,
    },

    to_date: {
      type: DataTypes.DATEONLY,
    },

    total_days: {
      type: DataTypes.INTEGER,
    },

    reason: {
      type: DataTypes.TEXT,
    },

    status: {
      type: DataTypes.STRING(50),
      defaultValue: "Pending",
    },

    created_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "employee_leave",
    timestamps: false,
  },
);

export default EmployeeLeave;
