import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const Payroll_employee_summary = sequelize.define(
  "Payroll_employee_summary",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    emp_id: {
      type: DataTypes.STRING(50),
    },

    emp_name: {
      type: DataTypes.STRING(150),
    },

    designation: {
      type: DataTypes.STRING(150),
    },

    department: {
      type: DataTypes.STRING(150),
    },

    month: {
      type: DataTypes.STRING(20),
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Payroll_employee_summary_employee_summary",
    timestamps: false,
  },
);

export default Payroll_employee_summary;
