const fs = require("fs");
const path = require("path");

const progressFilePath = path.join(__dirname, "../data/progress.json");

const getProgressByPlayerId = (req, res) => {
  const progressData = JSON.parse(fs.readFileSync(progressFilePath, "utf8"));
  const playerProgress = progressData.filter(
    (item) => item.playerId === req.params.playerId
  );

  res.json(playerProgress);
};

const createProgress = (req, res) => {
  const { playerId, locationId, completed, badgeUnlocked, score } = req.body;

  if (!playerId || !locationId) {
    return res.status(400).json({
      message: "playerId and locationId are required"
    });
  }

  const progressData = JSON.parse(fs.readFileSync(progressFilePath, "utf8"));

  const newProgress = {
    playerId,
    locationId,
    completed: completed ?? false,
    badgeUnlocked: badgeUnlocked ?? false,
    score: score ?? 0
  };

  progressData.push(newProgress);

  fs.writeFileSync(progressFilePath, JSON.stringify(progressData, null, 2));

  res.status(201).json({
    message: "Progress saved successfully",
    data: newProgress
  });
};

module.exports = {
  getProgressByPlayerId,
  createProgress
};
