const multer = require('multer');
const { query } = require("express");
const pool = require("../models/db");
const cloudinary = require('cloudinary').v2;
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage });
const createNewAdvertisement = (req, res) => {
    const { doctor_id, url, image, description } = req.body;
    if (image) {
        cloudinary.uploader.upload(image, (error, result) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload image to Cloudinary",
                    error
                });
            }
            const imageUrl = result.secure_url;
            const query = `
                INSERT INTO advertisements (doctor_id, url, image, description)
                VALUES ($1, $2, $3, $4)
                RETURNING *;
            `;
            const values = [doctor_id, url, imageUrl, description];

            pool.query(query, values)
                .then((result) => {
                    res.status(201).json({
                        success: true,
                        message: "Advertisement added successfully",
                        data: result.rows
                    });
                })
                .catch((error) => {
                    res.status(500).json({
                        success: false,
                        message: "Server error",
                        error
                    });
                });
        });
    } else {
        res.status(400).json({
            success: false,
            message: "Image is required"
        });
    }
};

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


// Multer setup


// Function to update doctor information
const addDoctorInformationById = (req, res) => {
    const { doctor_id } = req.params;

    // Extract form data fields from req.body
    const {
        firstName,
        lastName,
        phone_number,
        whatsapp_number,
        email,
        city,
        location,
        specialization_id,
        years_experience,
        about
    } = req.body;

    const updateDoctorInformation = (imageUrl = null) => {
        const values = [
            doctor_id,
            firstName || null,
            lastName || null,
            phone_number || null,
            whatsapp_number || null,
            email || null,
            city || null,
            location || null,
            imageUrl || null, // Update the image URL if it exists
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
                image = COALESCE($9, image), -- Update the image if provided
                specialization_id = COALESCE($10, specialization_id),
                years_experience = COALESCE($11, years_experience),
                about = COALESCE($12, about)
            WHERE id = $1
            RETURNING *;
        `;

        pool.query(query, values, (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Database error',
                    error: err
                });
            }

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Doctor not found'
                });
            }

            const doctor = result.rows[0];
            res.status(200).json({
                success: true,
                message: 'Doctor information updated successfully',
                data: { ...doctor, image: doctor.image || null }
            });
        });
    };

    // If an image file is provided, upload it to Cloudinary
    if (req.file) {
        const image = req.file;
        cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to upload image to Cloudinary',
                    error
                });
            }

            const imageUrl = result.secure_url;
            updateDoctorInformation(imageUrl); // Update with the uploaded image URL
        }).end(image.buffer); // Pass the image buffer from multer to Cloudinary
    } else {
        updateDoctorInformation(); // No image, proceed with the rest of the data
    }
};

// Export the route with Multer middleware
module.exports = (app) => {
    app.put('/doctors/:doctor_id', upload.single('image'), addDoctorInformationById);
};


const addWorkingTimeByDoctorId = (req, res) => {
    const { doctor_id, start_time, end_time, review_time, day_off } = req.body;
    const values = [doctor_id, start_time || null, end_time || null, review_time || null, day_off || null];
    const query = `
        UPDATE doctors 
        SET start_time = COALESCE($2, start_time), 
            end_time = COALESCE($3, end_time), 
            review_time = COALESCE($4, review_time), 
            day_off = COALESCE($5, day_off) 
        WHERE id = $1 
        RETURNING *;
    `;

    pool.query(query, values)
        .then((result) => {
            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Doctor not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "All times added successfully",
                data: result.rows[0],
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: "Server Error",
                error,
            });
        });
};


module.exports = { createNewAdvertisement, getDoctorsBySpecializationId, addDoctorInformationById,addWorkingTimeByDoctorId};