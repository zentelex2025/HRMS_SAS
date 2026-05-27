const express               = require("express");
const router                = express.Router();
const leaveBalanceController = require("../controllers/LeaveBalanceController");

router.get("/",                        leaveBalanceController.getAllBalances);
router.get("/:employee_code",          leaveBalanceController.getBalanceByEmployee);
router.patch("/",                      leaveBalanceController.updateBalance);
router.post("/",                       leaveBalanceController.addBalance);

module.exports = router;