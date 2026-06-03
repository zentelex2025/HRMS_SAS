import express from "express";
const router = express.Router();
import {
  addInterviewer,
  deleteInterviewerById,
  getAllInterviewer,
  getInterviewerById,
  updateInterviewerById,
} from "../controllers/interview.controllers.js";

router.get("/:id", getInterviewerById);
router.get("/get-all", getAllInterviewer);
router.post("/add", addInterviewer);
router.put("/update/:id", updateInterviewerById);
router.delete("/delete/:id", deleteInterviewerById);

export default router;
