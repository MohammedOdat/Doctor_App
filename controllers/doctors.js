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

const getDoctorsBySpecializationId = (req,res)=>{
    const {specialization_id,page,size}=req.params
    // const page = req.query.page || 1;
    // const size = req.query.size || 15;
    const limit = size;
    const offset = (page - 1) * size;
    const values=[limit,offset,specialization_id]

    const query = "SELECT doctors.id, doctors.firstName, doctors.lastName, specializations.specialization, doctors.rate, doctors.cost, doctors.years_experience, doctors.city, doctors.image FROM doctors INNER JOIN specializations ON doctors.specialization_id = specializations.id WHERE doctors.specialization_id = $3 AND doctors.is_deleted = 0 ORDER BY doctors.rate DESC LIMIT $1 OFFSET $2;"

    pool.query(query,values).then((result)=>{
        if(result.rows.length > 0){
            res.status(201).json({
                success: true,
                message: `Doctors with specialization id = ${specialization_id}`,
                data: result.rows
            })
        } else{
            res.status(404).json({
                success: false,
                message: `There is doctors in specialization id = ${specialization_id} for now`
            })
        }
    }).catch((error)=>{
        res.status(500).json({
            success:false,
            message: `Server Error`,
            error
        })
    })
}

module.exports = { createNewAdvertisement, getDoctorsBySpecializationId};