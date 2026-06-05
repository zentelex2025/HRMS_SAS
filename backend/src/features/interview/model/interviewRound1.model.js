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
      references: {
        model: "interview_candidates",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    grade_personality: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    grade_english: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    grade_behaviour: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    grade_communication: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    grade_cultural: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    comment_round1: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    candidate_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "interview_round1",
    timestamps: false,
  },
);

export default InterviewRound1;
