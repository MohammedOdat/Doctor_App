const express = require("express");

const { registerOrLogin,getAllSpecializations} = require("../controllers/users");
const {authentication} = require("../middleware/authentication");
const usersRouter = express.Router();

usersRouter.post("/registerOrLogin", registerOrLogin);
usersRouter.get("/specializations", getAllSpecializations);
module.exports = usersRouter;
