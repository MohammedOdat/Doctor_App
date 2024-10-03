const { pool } = require("../models/db");
const createNewPermission=(req,res)=>{
    const{permission}=req.body
    const value =[permission]
    const query=`INSERT INTO permissions (permission) VALUES ($1) RETURNING * ;`
    pool.query(query,value).then((result) => {
        res.status(201).json({
          success: true,
          message: "Permission Added successfully",
          data: result.rows,
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Server error",
          error: err,
        });
      });
}
module.exports={
    createNewPermission
}