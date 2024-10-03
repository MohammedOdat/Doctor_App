const express = require("express");

const {createNewAdvertisement} = require("../controllers/doctors");
const {authentication} = require("../middleware/authentication");
const doctorsRouter = express.Router();

doctorsRouter.post("/advertisements",authentication,createNewAdvertisement);
module.exports = doctorsRouter;