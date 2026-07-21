const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { generateToken } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');

const router = express.Router();

// Register new user
router.post('/register', validateUserRegistration, async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user exists
    const userExists = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password, first_name, last_name, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, email',
      [email, hashedPassword, firstName, lastName, phone || null]
    );

    const userId = result.rows[0].id;
    const token = generateToken(userId, email);

    res.status(201).json({
      userId,
      email: result.rows[0].email,
      token,
      message: 'User registered successfully'
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', validateUserLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT id, email, password FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id, user.email);

    res.json({
      userId: user.id,
      email: user.email,
      token,
      message: 'Login successful'
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
