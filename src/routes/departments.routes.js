const express = require("express");
const departments = require("../data/departments.json");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(departments);
});

router.get("/:id", (req, res) => {
  const department = departments.find((item) => item.id === req.params.id);

  if (!department) {
    return res.status(404).json({ message: "Department not found" });
  }

  res.json(department);
});

module.exports = router;
