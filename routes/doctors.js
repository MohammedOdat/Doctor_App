
const express = require("express");

const {createNewAdvertisement, getDoctorsBySpecializationId,addDoctorInformationById} = require("../controllers/doctors");
const {authentication} = require("../middleware/authentication");
const doctorsRouter = express.Router();

doctorsRouter.post("/advertisements",authentication,createNewAdvertisement);
doctorsRouter.get("/:specialization_id/:page/:size", getDoctorsBySpecializationId)
doctorsRouter.post("/addInfo/:doctor_id", authentication,addDoctorInformationById)

module.exports = doctorsRouter;