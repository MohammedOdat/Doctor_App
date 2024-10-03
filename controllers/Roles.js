
const pool = require("../models/db");

const createNewRole = (req, res) => {
    const {role}=req.body
    const value=[role]
    const query=`INSERT INTO roles (role) VALUES ($1) RETURNING *;`
    pool.query(query,value).then((result)=>{
      res.status(201).json({
        success: true,
        message: "Role created successfully",
        data: result.rows,
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: "Server error",
      });
    });
    
  };
  
module.exports = {
createNewRole
}