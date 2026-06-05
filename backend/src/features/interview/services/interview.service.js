import {
  sharedAddingData,
  sharedDeleteUser,
  sharedFetchAll,
  sharedGetDataById,
  sharedUpdatingUser,
} from "../../../shared/services/crud.service.js";
import Interview from "../model/interviewCandidate.model.js";

export async function getAllInterviewCandidate() {
  return await sharedFetchAll(Interview);
}
export async function getAllInterviewCandidateById(id) {
  return await sharedGetDataById(id, Interview);
}

export async function addInterviewerCandidate(body) {
  return await sharedAddingData(body, Interview);
}

export async function updateInterviewerCandidateById(id, body) {
  return await sharedUpdatingUser(id, body, Interview);
}

export async function deleteInterviewerCandidateById(id, key) {
  return await sharedDeleteUser(id, key, Interview);
}
