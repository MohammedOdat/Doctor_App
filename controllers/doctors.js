const { query } = require("express");
const pool = require("../models/db");
const createNewAdvertisement = (req,res)=>{
    console.log("test");

    const {doctor_id, url, image, description } = req.body;

    const query = "INSERT INTO advertisements (doctor_id, url, image, description) VALUES ($1, $2, $3, $4) RETURNING *;"
    const values=[doctor_id, url, image, description]

    pool.query(query,values).then((result)=>{
        res.status(201).json({
            success: true,
            message:"Advertisement Add Successfully",
            data: result.rows
        })
    }).catch((error)=>{
        res.status(500).json({
            success: false,
            message:"Server Error",
            error
        })
    })
} 


module.exports = { createNewAdvertisement};