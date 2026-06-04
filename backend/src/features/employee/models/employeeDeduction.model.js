import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const EmployeeDeduction = sequelize.define(
  "EmployeeDeduction",
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

    employee: {
      type: DataTypes.STRING(100),
    },

    employee_code: {
      type: DataTypes.STRING(50),
    },

    basic_salary: {
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

    pt_tax: {
      type: DataTypes.DECIMAL(12, 2),
    },

    tds: {
      type: DataTypes.DECIMAL(12, 2),
    },

    other_deduction: {
      type: DataTypes.DECIMAL(12, 2),
    },

    bank_name: {
      type: DataTypes.STRING(150),
    },

    account_number: {
      type: DataTypes.STRING(50),
    },

    pf_number: {
      type: DataTypes.STRING(50),
    },

    esi_number: {
      type: DataTypes.STRING(50),
    },

    created_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "employee_deduction",
    timestamps: false,
  },
);

export default EmployeeDeduction;
