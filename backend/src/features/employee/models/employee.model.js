import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const Employee = sequelize.define(
  "Employee",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    employee_id: {
      type: DataTypes.STRING(50),
    },

    employee_code: {
      type: DataTypes.STRING(50),
      unique: true,
    },

    first_name: {
      type: DataTypes.STRING(100),
    },

    last_name: {
      type: DataTypes.STRING(100),
    },

    email: {
      type: DataTypes.STRING(150),
      unique: true,
    },

    designation: {
      type: DataTypes.STRING(150),
    },

    department_id: {
      type: DataTypes.INTEGER,
    },

    department: {
      type: DataTypes.STRING(150),
    },

    salary: {
      type: DataTypes.DECIMAL(12, 2),
    },

    current_salary: {
      type: DataTypes.DECIMAL(12, 2),
    },

    performance: {
      type: DataTypes.STRING(100),
    },

    status: {
      type: DataTypes.STRING(50),
      defaultValue: "Active",
    },

    job_role: {
      type: DataTypes.STRING(50),
      defaultValue: "employee",
    },

    phone_no: {
      type: DataTypes.STRING(20),
    },

    emergency_contact: {
      type: DataTypes.STRING(20),
    },

    father_name: {
      type: DataTypes.STRING(150),
    },

    mother_name: {
      type: DataTypes.STRING(150),
    },

    permanent_address: {
      type: DataTypes.TEXT,
    },

    present_address: {
      type: DataTypes.TEXT,
    },

    aadhaar_number: {
      type: DataTypes.STRING(20),
    },

    pan_number: {
      type: DataTypes.STRING(20),
    },

    marital_status: {
      type: DataTypes.STRING(50),
    },

    blood_group: {
      type: DataTypes.STRING(20),
    },

    highest_qualification: {
      type: DataTypes.STRING(150),
    },

    reporting_manager: {
      type: DataTypes.STRING(150),
    },

    joining_date: {
      type: DataTypes.DATEONLY,
    },

    password: {
      type: DataTypes.TEXT,
    },

    kpi: {
      type: DataTypes.TEXT,
    },

    is_default_password: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    created_at: {
      type: DataTypes.DATE,
    },

    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "employees",
    timestamps: false,
  },
);

export default Employee;
