const express = require("express");
const {createNewRole} = require("../controllers/Roles");
const roleRouter = express.Router();
roleRouter.post("/", createNewRole);
module.exports = roleRouter