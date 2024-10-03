const pool = require("../models/db");
const jwt = require("jsonwebtoken");

const registerOrLogin = async (req, res) => {
    const phone_number = Number(req.body.phone_number)
  const { role_id, OTP } = req.body;

  // Check if OTP is correct
  if (OTP !== 666) {
    return res.status(401).json({
      success: false,
      message: "Wrong OTP",
    });
  }

  try {
    // Check if the phone number already exists in the users table
    const query = `SELECT * FROM users WHERE phone_number = $1`;
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
        private: user.private,
        userInfo: {
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
    const insertQuery = `INSERT INTO users (phone_number, role_id) VALUES ($1, $2) RETURNING *`;
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
      userInfo: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        image: newUser.image,
        phone_number: newUser.phone_number,
        age: newUser.age,
        gender: newUser.gender,
      },
    });
  } catch (err) {
    // Handle errors such as duplicate phone numbers or database issues
    return res.status(409).json({
      success: false,
      message: "The number already exists or there was an issue with registration",
      err,
    });
  }
};

module.exports = { registerOrLogin };
