const express = require("express");

const { registerOrLogin,getAllSpecializations,addUserInfoByUserId,getAllAdvertisements,addBokingByUserId,updateAppointmentById,getAllAppointmentsByUserId} = require("../controllers/users");
const {authentication} = require("../middleware/authentication");
const usersRouter = express.Router();

usersRouter.post("/verificatin-code", registerOrLogin);
usersRouter.get("/advertisements",getAllAdvertisements)
usersRouter.get("/specializations", getAllSpecializations);
usersRouter.post("/update/:user_id", authentication,addUserInfoByUserId);
usersRouter.post("/booking",authentication,addBokingByUserId)
usersRouter.put("/updateAppointment/:booking_id",authentication,updateAppointmentById)
usersRouter.get("/appointments/:user_id",getAllAppointmentsByUserId)
module.exports = usersRouter;
