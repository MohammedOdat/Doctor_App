const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
require("./models/db");
require("dotenv").config()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

const cloudinary = require('cloudinary').v2;
require('dotenv').config(); 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const roleRouter = require("./routes/Roles");
const permissionRouter=require('./routes/permissions')
const rolePermissionRouter=require('./routes/role_permission')
const usersRouter = require("./routes/users");
const doctorsRouter= require("./routes/doctors");
app.use("/roles", roleRouter)
app.use("/permissions",permissionRouter)
app.use("/role_permission",rolePermissionRouter)
app.use("/users",usersRouter)
app.use("/doctors",doctorsRouter)

app.use("*", (req, res) => res.status(404).json("NO content at this path"));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
