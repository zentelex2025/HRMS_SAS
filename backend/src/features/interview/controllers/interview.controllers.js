import { env } from "../config/config.js";
import {
  addInterviewerCandidate,
  deleteInterviewerCandidateById,
  getAllInterviewCandidate,
  getAllInterviewCandidateById,
  updateInterviewerCandidateById,
} from "../services/interview.service.js";

export async function getAllInterviewer(req, res) {
  res.send(await getAllInterviewCandidate());
}

export async function getInterviewerById(req, res) {
  res.send(await getAllInterviewCandidateById(req.params[env.id]));
}
export async function addInterviewer(req, res) {
  res.send(await addInterviewerCandidate(req.body));
}

export async function updateInterviewerById(req, res) {
  res.send(await updateInterviewerCandidateById(req.params[env.id], req.body));
}
export async function deleteInterviewerById(req, res) {
  res.send(await deleteInterviewerCandidateById(req.params[env.id], env.id));
}
