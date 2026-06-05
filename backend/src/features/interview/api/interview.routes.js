import express from "express";
const router = express.Router();
import {
  addInterviewer,
  deleteInterviewerById,
  getAllInterviewer,
  getInterviewerById,
  updateInterviewerById,
} from "../controllers/interview.controllers.js";
import { env } from "../config/config.js";

// /interview
router.get(`/:${env.id}`, getInterviewerById);
router.get("/", getAllInterviewer);
router.post("/", addInterviewer);
router.patch(`/:${env.id}`, updateInterviewerById);
router.delete(`/:${env.id}`, deleteInterviewerById);

export default router;
