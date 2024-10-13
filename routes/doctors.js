const multer = require('multer');
// Multer setup for file uploads
const storage = multer.memoryStorage(); // Stores the file in memory
const upload = multer({ storage: storage });
const express = require("express");

const {createNewAdvertisement, getDoctorsBySpecializationId,addDoctorInformationById} = require("../controllers/doctors");
const {authentication} = require("../middleware/authentication");
const doctorsRouter = express.Router();

doctorsRouter.post("/advertisements",authentication,createNewAdvertisement);
doctorsRouter.get("/:specialization_id/:page/:size", getDoctorsBySpecializationId)
doctorsRouter.post("/addInfo/:doctor_id", upload.single('image'), authentication,addDoctorInformationById)

module.exports = doctorsRouter;