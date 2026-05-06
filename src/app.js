const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const departmentsRoutes = require("./routes/departments.routes");
const progressRoutes = require("./routes/progress.routes");
const authRoutes = require("./modules/auth/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/departments", departmentsRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
