import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const PayrollConfig = sequelize.define(
  "PayrollConfig",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    config_name: {
      type: DataTypes.STRING(100),
    },

    employee_value: {
      type: DataTypes.DECIMAL(10, 2),
    },

    based_on: {
      type: DataTypes.STRING(150),
    },

    applicable_rule: {
      type: DataTypes.TEXT,
    },

    note: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "payroll_config",
    timestamps: false,
  },
);

export default PayrollConfig;
