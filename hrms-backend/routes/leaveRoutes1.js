const express         = require("express");
const router          = express.Router();
const leaveController = require("../controllers/LeaveController1");

router.get("/",        leaveController.getAllLeaves);
router.post("/",       leaveController.applyLeave);
router.patch("/:id",   leaveController.updateLeaveStatus);
router.delete("/:id",  leaveController.deleteLeave);

module.exports = router;