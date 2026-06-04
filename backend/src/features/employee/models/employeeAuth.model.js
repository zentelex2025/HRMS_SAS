import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const EmployeeAuth = sequelize.define(
  "EmployeeAuth",
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

    name: {
      type: DataTypes.STRING(100),
    },

    email: {
      type: DataTypes.STRING(150),
      unique: true,
    },

    password: {
      type: DataTypes.TEXT,
    },

    role: {
      type: DataTypes.STRING(50),
      defaultValue: "employee",
    },

    created_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "employee_auth",
    timestamps: false,
  },
);

export default EmployeeAuth;
