const express = require("express");
const urlRoutes = require("./routes/urlRoutes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use("/", urlRoutes);
app.use(errorHandler);

module.exports = app;
