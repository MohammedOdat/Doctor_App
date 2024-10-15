
const express = require("express");
const multer = require('multer');
const storage = multer.memoryStorage(); // Store the file in memory

const upload = multer({ storage });
const {createNewAdvertisement, getDoctorsBySpecializationId,addDoctorInformationById,addWorkingTimeByDoctorId} = require("../controllers/doctors");
const {authentication} = require("../middleware/authentication");
const doctorsRouter = express.Router();

doctorsRouter.post("/add_advertisement",authentication,createNewAdvertisement);
doctorsRouter.get("/:specialization_id/:page/:size", getDoctorsBySpecializationId)
doctorsRouter.post("/update/:doctor_id",  upload.single('image'),authentication,addDoctorInformationById)
doctorsRouter.post("/update_times",authentication,addWorkingTimeByDoctorId)

module.exports = doctorsRouter;