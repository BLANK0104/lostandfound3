const bcrypt = require('bcrypt');
const pool = require('../db');

const registerUser = async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;
    
    // Check if username already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (username, password, is_admin) VALUES ($1, $2, $3) RETURNING id, username, is_admin',
      [username, hashedPassword, isAdmin]
    );
    
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: result.rows[0].id,
        username: result.rows[0].username,
        isAdmin: result.rows[0].is_admin
      }
    });
  } catch (error) {
    console.error('Registration error:', error.message); // Log the error message
    res.status(500).json({ error: 'Failed to register user' });
  }
};

module.exports = {
  registerUser
};