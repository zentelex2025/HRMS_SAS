import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const InterviewRound1 = sequelize.define(
  "InterviewRound1",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    grade_personality: {
      type: DataTypes.INTEGER,
    },

    grade_english: {
      type: DataTypes.INTEGER,
    },

    grade_behaviour: {
      type: DataTypes.INTEGER,
    },

    grade_communication: {
      type: DataTypes.INTEGER,
    },

    grade_cultural: {
      type: DataTypes.INTEGER,
    },

    comment_round1: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "interview_round1",
    timestamps: false,
  },
);

export default InterviewRound1;
