import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const InterviewRound2 = sequelize.define(
  "InterviewRound2",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "interview_candidates",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    grade_domain: {
      type: DataTypes.INTEGER,
    },

    grade_analytical: {
      type: DataTypes.INTEGER,
    },

    grade_technical: {
      type: DataTypes.INTEGER,
    },

    grade_problem: {
      type: DataTypes.INTEGER,
    },

    grade_aptitude: {
      type: DataTypes.INTEGER,
    },

    comment_round2: {
      type: DataTypes.TEXT,
    },
    candidate_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "interview_round2",
    timestamps: false,
  },
);

export default InterviewRound2;
