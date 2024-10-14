const express = require("express");

const { registerOrLogin,getAllSpecializations,addUserInfoByUserId,getAllAdvertisements,addBokingByUserId,updateAppointmentById} = require("../controllers/users");
const {authentication} = require("../middleware/authentication");
const usersRouter = express.Router();

usersRouter.post("/registerOrLogin", registerOrLogin);
usersRouter.get("/advertisements",getAllAdvertisements)
usersRouter.get("/specializations", getAllSpecializations);
usersRouter.post("/addInfo/:user_id", authentication,addUserInfoByUserId);
usersRouter.post("/booking",addBokingByUserId)
usersRouter.put("/updateAppointment/:booking_id",updateAppointmentById)
module.exports = usersRouter;
