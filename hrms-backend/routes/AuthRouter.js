const express        = require("express");
const AuthController = require("../controllers/AuthController1");

// ═══════════════════════════════════════════════════════════════
//  ROUTES
// ═══════════════════════════════════════════════════════════════

const router = express.Router();

router.post("/login",    AuthController.login);
router.post("/register", AuthController.register);
router.get("/users",     AuthController.getUsers);

module.exports = router;