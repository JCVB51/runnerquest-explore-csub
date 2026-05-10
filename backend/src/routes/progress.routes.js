const express = require("express");
const {
  getProgressByPlayerId,
  createProgress
} = require("../controllers/progress.controller");

const router = express.Router();

router.get("/:playerId", getProgressByPlayerId);
router.post("/", createProgress);

module.exports = router;
