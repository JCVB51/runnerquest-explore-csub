const departments = require("../data/departments.json");

const getAllDepartments = (req, res) => {
  res.json(departments);
};

const getDepartmentById = (req, res) => {
  const department = departments.find((item) => item.id === req.params.id);

  if (!department) {
    return res.status(404).json({ message: "Department not found" });
  }

  res.json(department);
};

module.exports = {
  getAllDepartments,
  getDepartmentById
};
