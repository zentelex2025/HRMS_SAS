import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const PayrollSalary = sequelize.define(
  "PayrollSalary",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    emp_id: {
      type: DataTypes.STRING(50),
    },

    month_year: {
      type: DataTypes.STRING(20),
    },

    basic: {
      type: DataTypes.DECIMAL(12, 2),
    },

    hra: {
      type: DataTypes.DECIMAL(12, 2),
    },

    conveyance: {
      type: DataTypes.DECIMAL(12, 2),
    },

    medical: {
      type: DataTypes.DECIMAL(12, 2),
    },

    special_allowance: {
      type: DataTypes.DECIMAL(12, 2),
    },

    gross_salary: {
      type: DataTypes.DECIMAL(12, 2),
    },

    pf_deduction: {
      type: DataTypes.DECIMAL(12, 2),
    },

    esi_deduction: {
      type: DataTypes.DECIMAL(12, 2),
    },

    pt_deduction: {
      type: DataTypes.DECIMAL(12, 2),
    },

    tds_deduction: {
      type: DataTypes.DECIMAL(12, 2),
    },

    other_deduction: {
      type: DataTypes.DECIMAL(12, 2),
    },

    total_deduction: {
      type: DataTypes.DECIMAL(12, 2),
    },

    net_salary: {
      type: DataTypes.DECIMAL(12, 2),
    },

    present_days: {
      type: DataTypes.INTEGER,
    },

    absent_days: {
      type: DataTypes.INTEGER,
    },

    status: {
      type: DataTypes.STRING(50),
    },

    generated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "payroll_salary",
    timestamps: false,
  },
);

export default PayrollSalary;
