const express = require("express");

const {createNewAdvertisement, getDoctorsBySpecializationId} = require("../controllers/doctors");
const {authentication} = require("../middleware/authentication");
const doctorsRouter = express.Router();

doctorsRouter.post("/advertisements",authentication,createNewAdvertisement);
doctorsRouter.get("/:specialization_id/:page/:size", getDoctorsBySpecializationId)
module.exports = doctorsRouter;