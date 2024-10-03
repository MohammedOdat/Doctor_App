const express = require("express");

const { registerOrLogin} = require("../controllers/users");
const {authentication} = require("../middleware/authentication");
const usersRouter = express.Router();

usersRouter.post("/registerOrLogin", registerOrLogin);
module.exports = usersRouter;
