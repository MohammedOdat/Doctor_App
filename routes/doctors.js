
const express = require("express");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {createNewAdvertisement, getDoctorsBySpecializationId,addDoctorInformationById,addWorkingTimeByDoctorId} = require("../controllers/doctors");
const {authentication} = require("../middleware/authentication");
const doctorsRouter = express.Router();

doctorsRouter.post("/add_advertisement",upload.single('image'),createNewAdvertisement);
doctorsRouter.get("/:specialization_id/:page/:size", getDoctorsBySpecializationId)
doctorsRouter.post("/update/:doctor_id",  upload.single('image'),addDoctorInformationById)
doctorsRouter.put("/update_times/:doctor_id",addWorkingTimeByDoctorId)

module.exports = doctorsRouter;