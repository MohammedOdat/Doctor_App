const express = require("express");
const permissionRouter = express.Router();

const {createNewPermission} = require('../controllers/permissions')
const {authentication} = require('../middleware/authentication')

permissionRouter.post('/',authentication,createNewPermission)
module.exports=permissionRouter
