const express = require("express");

const { registerOrLogin,getAllSpecializations,addUserInfoByUserId,getAllAdvertisements,addBokingByUserId,updateAppointmentById,getAllAppointmentsByUserId} = require("../controllers/users");
const {authentication} = require("../middleware/authentication");
const usersRouter = express.Router();

usersRouter.post("/registerOrLogin", registerOrLogin);
usersRouter.get("/advertisements",getAllAdvertisements)
usersRouter.get("/specializations", getAllSpecializations);
usersRouter.post("/addInfo/:user_id", authentication,addUserInfoByUserId);
usersRouter.post("/booking",authentication,addBokingByUserId)
usersRouter.put("/updateAppointment/:booking_id",authentication,updateAppointmentById)
usersRouter.get("/appointments/:user_id",authentication,getAllAppointmentsByUserId)
module.exports = usersRouter;
