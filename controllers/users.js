const { query } = require("express");
const pool = require("../models/db");
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2;
const registerOrLogin = async (req, res) => {
  
  const phone_number=parseInt(req.body.phone_number)
  const role_id=parseInt(req.body.role_id)
  const OTP=parseInt(req.body.OTP)
console.log(req.body);

  if (OTP !== 666) {
    return res.status(401).json({
      success: false,
      message: "Wrong OTP",
    });
  }

  try {
    let query;
    if(role_id===1){
    query = `SELECT * FROM users WHERE phone_number = $1`;
    }else if (role_id===2){
    query = `SELECT * FROM doctors WHERE phone_number = $1`;
    }
    const result = await pool.query(query, [phone_number]);

    if (result.rows.length > 0) {
      const user = result.rows[0];

      const payload = {
        userId: user.id,
        role: user.role_id,
      };
      const options = { expiresIn: "1d" };
      const secret = process.env.SECRET;
      const token = jwt.sign(payload, secret, options);

      return res.status(200).json({
        token,
        success: true,
        message: `Login successful`,
        userId: user.id,
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
          phone_number: user.phone_number,
          age: user.age,
          gender: user.gender,
          
        },
      });
    }

    let insertQuery;
    if(role_id===1){
    insertQuery = `INSERT INTO users (phone_number, role_id) VALUES ($1, $2) RETURNING *`;
    }else if(role_id===2){
    insertQuery = `INSERT INTO doctors (phone_number, role_id) VALUES ($1, $2) RETURNING *`;
    }
    const insertResult = await pool.query(insertQuery, [phone_number, role_id]);

    const newUser = insertResult.rows[0];

    const payload = {
      userId: newUser.id,
      role: newUser.role_id,
    };
    const options = { expiresIn: "1d" };
    const secret = process.env.SECRET;
    const token = jwt.sign(payload, secret, options);

    return res.status(200).json({
      token,
      success: true,
      message: "Account created and logged in successfully",
      userId: newUser.id,
      private: newUser.private,
      data: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        image: newUser.image,
        phone_number: newUser.phone_number,
        age: newUser.age,
        gender: newUser.gender,
      },
    });
  } catch (error) {
    return res.status(409).json({
      success: false,
      error: "The number already exists or there was an issue with registration"
    });
  }
};
const getAllAdvertisements  = (req,res)=>{
const query="SELECT * FROM advertisements WHERE is_deleted=0"
pool.query(query).then((result)=>{
  if(result.rows[0]){
    res.status(200).json({
      success:true,
      message:"All advertisements",
      data: result.rows[0]
    })
  }else(res.status(404).json({
    success:false,
    message: "There is no advertisements for now",

  }))
}).catch((error)=>{
  res.status(500).json({
    success:false,
    message:"Server Error",
    error
  })
})
}
const getAllSpecializations = (req,res)=>{
    const query = "SELECT id, specialization FROM specializations WHERE is_deleted = 0;";
  
  pool.query(query)
    .then((result) => {
      if (result.rows.length > 0) {
        
        res.status(200).json({
          success: true,
          message: "All Available Specializations",
          data: result.rows 
        });
      } else {
        res.status(404).json({
          success: false,
          message: "There are no available specializations for now",
        });
      }
    }).catch((err) => {
        res.status(500).json({
          success: false,
          message: "Server error",
        });
      });
}
const addUserInfoByUserId = (req, res) => {
  const { user_id } = req.params;
  const { firstName, lastName, gender } = req.body;
  const age = parseInt(req.body.age, 10);

  const updateUser = (imageUrl = null) => {
    const values = [
      user_id,
      firstName || null,
      lastName || null,
      gender || null,
      age || null,
      imageUrl || null,
    ];

    const query = `
      UPDATE users
      SET
        firstName = COALESCE($2, firstName),
        lastName = COALESCE($3, lastName),
        gender = COALESCE($4, gender),
        age = COALESCE($5, age),
        image = COALESCE($6, image)
      WHERE id = $1
      RETURNING *;
    `;

    pool.query(query, values)
      .then((result) => {
        if (result.rows.length === 0) {
          return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
          success: true,
          message: "Information updated successfully",
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

  if (req.file) {
    const imageBuffer = req.file.buffer;
    cloudinary.uploader
      .upload_stream({ resource_type: "image" }, (error, result) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: "Failed to upload image to Cloudinary",
            error,
          });
        }

        const imageUrl = result.secure_url;
        updateUser(imageUrl); 
      })
      .end(imageBuffer);
  } else {
    updateUser(); 
  }
};
const addBokingByUserId = (req,res)=>{
const patient_id= parseInt(req.body.patient_id)
const doctor_id=parseInt(req.body.doctor_id)
const booking_time=req.body.booking_time
const status_id=1
const values = [patient_id,doctor_id, booking_time,status_id]
const query="INSERT INTO bookings(patient_id,doctor_id, booking_time,status_id) VALUES ($1,$2,$3,$4) RETURNING *;"
pool.query(query,values).then((result)=>{
  res.status(201).json({
    success:true,
    message:"Apointment added successfully",
    data: result.rows[0]
  })
}).catch((error)=>{
  res.status(500).json({
    success:false,
    message:"Server Error",
    error
  })
})
}
const updateAppointmentById = (req,res)=>{
  const id = req.params.booking_id
  const status_id =parseInt(req.body.status_id);
  const values=[id, status_id]
  const query = "UPDATE bookings SET status_id=$2 WHERE id=$1 RETURNING *;";
  pool.query(query,values).then((result)=>{
    if(result.rows.length===0){
      return res.status(404).json({
        success: false,
        message: "Apointment not found",
    });
    }
    res.status(200).json({
      success:true,
      message:"Appointent updated successfully",
      data:result.rows[0]
    })
  }).catch((error)=>{
    res.status(500).json({
      success:false,
      message:"Server Error",
      error
    })
  })

}
const getAllAppointmentsByUserId = (req, res) => {
  const { user_id } = req.params;  
  const status_id = parseInt(req.body.status_id); 
  if (!status_id) {
    return res.status(400).json({
      success: false,
      message: "Status ID is required",
    });
  }

  const values = [user_id, status_id];
  const query = `
    SELECT bookings.booking_time, doctors.firstName, doctors.lastName, 
           doctors.city, doctors.location, doctors.review_time, 
           doctors.start_time, doctors.end_time, doctors.day_off
    FROM bookings
    INNER JOIN doctors ON bookings.doctor_id = doctors.id
    WHERE bookings.patient_id = $1 AND bookings.status_id = $2 ORDER BY bookings.booking_time ASC;
  `;

  pool.query(query, values)
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "There are no appointments yet",
        });
      }
      res.status(200).json({
        success: true,
        message: "All appointments",
        data: result.rows, 
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

module.exports = { registerOrLogin, getAllSpecializations,addUserInfoByUserId,getAllAdvertisements,addBokingByUserId,updateAppointmentById,getAllAppointmentsByUserId};
