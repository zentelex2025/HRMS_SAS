import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const EmployeeSalary = sequelize.define(
  "EmployeeSalary",
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

    gross_salary: {
      type: DataTypes.DECIMAL(12, 2),
    },

    pf: {
      type: DataTypes.DECIMAL(12, 2),
    },

    esi: {
      type: DataTypes.DECIMAL(12, 2),
    },

    pt: {
      type: DataTypes.DECIMAL(12, 2),
    },

    tds: {
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

    month_year: {
      type: DataTypes.STRING(20),
    },

    created_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "employee_salary",
    timestamps: false,
  },
);

export default EmployeeSalary;
