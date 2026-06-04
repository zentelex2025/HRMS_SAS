import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const EmployeeAppraisal = sequelize.define(
  "EmployeeAppraisal",
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

    department: {
      type: DataTypes.STRING(100),
    },

    appraisal: {
      type: DataTypes.DECIMAL(10, 2),
    },

    performance: {
      type: DataTypes.STRING(50),
    },

    status: {
      type: DataTypes.STRING(50),
    },

    remarks: {
      type: DataTypes.TEXT,
    },

    created_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "employee_appraisal",
    timestamps: false,
  },
);

export default EmployeeAppraisal;
