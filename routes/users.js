const express = require("express");

const { registerOrLogin,getAllSpecializations,addUserInfoByUserId,getAllAdvertisements} = require("../controllers/users");
const {authentication} = require("../middleware/authentication");
const usersRouter = express.Router();

usersRouter.post("/registerOrLogin", registerOrLogin);
usersRouter.get("/advertisements",getAllAdvertisements)
usersRouter.get("/specializations", getAllSpecializations);
usersRouter.post("/addInfo/:user_id", authentication,addUserInfoByUserId);
module.exports = usersRouter;
