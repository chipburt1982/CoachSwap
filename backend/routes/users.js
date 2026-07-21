const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT id, email, first_name, last_name, phone, bio, profile_image_url, 
              location, verified, average_rating, created_at 
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user profile
router.put('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, phone, bio, location, profileImageUrl } = req.body;

    if (req.user.userId !== parseInt(userId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      `UPDATE users SET first_name = $1, last_name = $2, phone = $3, bio = $4, 
              location = $5, profile_image_url = $6, updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [firstName, lastName, phone, bio, location, profileImageUrl, userId]
    );

    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user reviews
router.get('/:userId/reviews', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.first_name, u.last_name, u.profile_image_url
       FROM reviews r
       JOIN users u ON r.reviewer_id = u.id
       WHERE r.reviewed_user_id = $1
       ORDER BY r.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;
