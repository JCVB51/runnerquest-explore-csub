const express = require("express");
const { signup, verifyEmail, login, me } = require("./auth.controller");
const { requireAuth } = require("./auth.middleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.get("/me", requireAuth, me);

module.exports = router;
