const express = require("express");
const multer = require('multer');
const upload = multer();
const { registerOrLogin,getAllSpecializations,addUserInfoByUserId,getAllAdvertisements,addBokingByUserId,updateAppointmentById,getAllAppointmentsByUserId} = require("../controllers/users");
const {authentication} = require("../middleware/authentication");
const usersRouter = express.Router();

usersRouter.post("/verificatin-code",upload.none(),registerOrLogin);
usersRouter.get("/advertisements",getAllAdvertisements)
usersRouter.get("/specializations", getAllSpecializations);
usersRouter.post("/update/:user_id", upload.single("image"),authentication,addUserInfoByUserId);
usersRouter.post("/booking",upload.none(),authentication,addBokingByUserId)
usersRouter.put("/updateAppointment/:booking_id",upload.none(),authentication,updateAppointmentById)
usersRouter.get("/appointments/:user_id",upload.none(),authentication,getAllAppointmentsByUserId)
module.exports = usersRouter;
