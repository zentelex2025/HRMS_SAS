import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const InterviewRound3 = sequelize.define(
  "InterviewRound3",
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

    grade_leadership: {
      type: DataTypes.INTEGER,
    },

    grade_teamwork: {
      type: DataTypes.INTEGER,
    },

    grade_strategic: {
      type: DataTypes.INTEGER,
    },

    grade_motivation: {
      type: DataTypes.INTEGER,
    },

    grade_overall_impact: {
      type: DataTypes.INTEGER,
    },

    comment_round3: {
      type: DataTypes.TEXT,
    },
    candidate_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "interview_round3",
    timestamps: false,
  },
);

export default InterviewRound3;
