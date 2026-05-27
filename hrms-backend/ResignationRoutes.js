const express = require(express);
const Router = express.Router();
const { createResignation, getAllResignations } = require("../controllers/resignationController");
const { validateResignation } = require("../middleware/validateResignation");
Router.post("/", validateResignationm, createResignation);
Router.get("/", getAllResignations);
module.experts = Router;