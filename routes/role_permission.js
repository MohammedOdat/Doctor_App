const express = require("express");
const rolePermissionRouter = express.Router();

const {createNewRolePermission} = require('../controllers/role_permission')
const  {authentication} = require('../middleware/authentication')

rolePermissionRouter.post('/',authentication,createNewRolePermission)
module.exports=rolePermissionRouter