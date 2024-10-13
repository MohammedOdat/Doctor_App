const { query } = require("express");
const pool = require("../models/db");
const jwt = require("jsonwebtoken");

const registerOrLogin = async (req, res) => {
  const { phone_number, role_id, OTP } = req.body;

  // Check if OTP is correct
  if (OTP !== 666) {
    return res.status(401).json({
      success: false,
      message: "Wrong OTP",
    });
  }

  try {
    let query;
    // Check if the phone number already exists in the users table
    if(role_id===1){
    query = `SELECT * FROM users WHERE phone_number = $1`;
    }else if (role_id===2){
    query = `SELECT * FROM doctors WHERE phone_number = $1`;
    }
    // const query = `SELECT * FROM users WHERE phone_number = $1`;
    const result = await pool.query(query, [phone_number]);

    // If phone number exists, proceed with login logic
    if (result.rows.length > 0) {
      const user = result.rows[0];

      // Generate a JWT token and return it in response
      const payload = {
        userId: user.id,
        role: user.role_id,
      };
      const options = { expiresIn: "1d" };
      const secret = process.env.SECRET;
      const token = jwt.sign(payload, secret, options);

      // Send response with specified user data
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

    // If phone number does not exist, proceed with registration
    let insertQuery;
    if(role_id===1){
    insertQuery = `INSERT INTO users (phone_number, role_id) VALUES ($1, $2) RETURNING *`;
    }else if(role_id===2){
    insertQuery = `INSERT INTO doctors (phone_number, role_id) VALUES ($1, $2) RETURNING *`;
    }
    const insertResult = await pool.query(insertQuery, [phone_number, role_id]);

    const newUser = insertResult.rows[0];

    // Generate a JWT token for the newly registered user
    const payload = {
      userId: newUser.id,
      role: newUser.role_id,
    };
    const options = { expiresIn: "1d" };
    const secret = process.env.SECRET;
    const token = jwt.sign(payload, secret, options);

    // Send token back with the successful registration
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
    // Handle errors such as duplicate phone numbers or database issues
    return res.status(409).json({
      success: false,
      message: "The number already exists or there was an issue with registration",
      error,
    });
  }
};
const getAllSpecializations = (req,res)=>{
    const query = "SELECT id, specialization FROM specializations WHERE is_deleted = 0;";
  
  pool.query(query)
    .then((result) => {
      if (result.rows.length > 0) {
        // Map the result to get only the names of specializations
        
        res.status(200).json({
          success: true,
          message: "All Available Specializations",
          data: result.rows // Return only the names of specializations
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



module.exports = { registerOrLogin, getAllSpecializations};
