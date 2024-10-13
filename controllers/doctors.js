const { query } = require("express");
const pool = require("../models/db");
const cloudinary = require('cloudinary').v2;
const createNewAdvertisement = (req,res)=>{

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

const addDoctorInformationById = (req, res) => {
    const { doctor_id } = req.params;
    const { firstName, lastName, phone_number, whatsapp_number, email, city, location, specialization_id, years_experience, about } = req.body;

    // Handle the image upload
    if (req.file) {
        const imagePath = req.file.path; // Get path to the uploaded file

        // Upload the image to Cloudinary
        cloudinary.uploader.upload(imagePath, (error, result) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to upload image to Cloudinary', error});
            }

            // Extract the URL from the Cloudinary result
            const imageUrl = result.secure_url;

            const values = [
                doctor_id,
                firstName || null,
                lastName || null,
                phone_number || null,
                whatsapp_number || null,
                email || null,
                city || null,
                location || null,
                imageUrl, // Save the image URL to the database
                specialization_id || null,
                years_experience || null,
                about || null
            ];

            const query = `
                UPDATE doctors
                SET
                    firstName = COALESCE($2, firstName),
                    lastName = COALESCE($3, lastName),
                    phone_number = COALESCE($4, phone_number),
                    whatsapp_number = COALESCE($5, whatsapp_number),
                    email = COALESCE($6, email),
                    city = COALESCE($7, city),
                    location = COALESCE($8, location),
                    image = COALESCE($9, image), 
                    specialization_id = COALESCE($10, specialization_id),
                    years_experience = COALESCE($11, years_experience),
                    about = COALESCE($12, about)
                WHERE id = $1
                RETURNING *;
            `;

            pool.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error executing query:', err.stack);
                    return res.status(500).json({ error: 'Database error' });
                }

                if (result.rows.length === 0) {
                    return res.status(404).json({ error: 'Doctor not found' });
                }

                const doctor = result.rows[0];
                res.status(200).json(doctor); // Send doctor data back
            });
        });
    } else {
        res.status(400).json({ error: 'Image file is required' });
    }
};

module.exports = { createNewAdvertisement, getDoctorsBySpecializationId, addDoctorInformationById};