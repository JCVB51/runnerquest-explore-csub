const express = require("express");
const {
  getAllDepartments,
  getDepartmentById
} = require("../controllers/departments.controller");

const router = express.Router();

router.get("/", getAllDepartments);
router.get("/:id", getDepartmentById);

module.exports = router;
