import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const InterviewCandidate = sequelize.define(
  "InterviewCandidate",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    candidate_name: {
      type: DataTypes.STRING(150),
    },

    designation: {
      type: DataTypes.STRING(150),
    },

    applied_role: {
      type: DataTypes.STRING(150),
    },

    job_role: {
      type: DataTypes.STRING(100),
    },

    qualification: {
      type: DataTypes.STRING(150),
    },

    expected_salary: {
      type: DataTypes.DECIMAL(12, 2),
    },

    final_salary: {
      type: DataTypes.DECIMAL(12, 2),
    },

    interview_date: {
      type: DataTypes.DATEONLY,
    },

    interview_time: {
      type: DataTypes.TIME,
    },

    hod_name: {
      type: DataTypes.STRING(150),
    },

    hod_department: {
      type: DataTypes.STRING(150),
    },

    interviewer_name: {
      type: DataTypes.STRING(150),
    },

    interviewer_designation: {
      type: DataTypes.STRING(150),
    },

    interviewer_department: {
      type: DataTypes.STRING(150),
    },

    interviewer_panel: {
      type: DataTypes.STRING(150),
    },

    verdict: {
      type: DataTypes.STRING(100),
    },

    hr_comments: {
      type: DataTypes.TEXT,
    },

    overall_grade: {
      type: DataTypes.STRING(50),
    },

    submitted_by: {
      type: DataTypes.STRING(150),
    },

    submitted_by_role: {
      type: DataTypes.STRING(100),
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "interview_candidates",
    timestamps: false,
  },
);

export default InterviewCandidate;
