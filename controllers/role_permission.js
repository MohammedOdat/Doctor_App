const { pool } = require("../models/db");
const createNewRolePermission=(req,res)=>{
    const{permission_id,role_id}=req.body
    const value =[permission_id,role_id]
    const query=`INSERT INTO role_permission (permission_id,role_id) VALUES ($1,$2) RETURNING * ;`
    pool.query(query,value).then((result) => {
        res.status(201).json({
          success: true,
          message: "Role_Permission Added successfully",
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
    createNewRolePermission
}