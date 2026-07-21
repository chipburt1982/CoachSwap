const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validateReview } = require('../middleware/validation');

const router = express.Router();

// Create review
router.post('/', authenticateToken, validateReview, async (req, res) => {
  try {
    const { reviewedUserId, rating, comment, listingId } = req.body;
    const reviewerId = req.user.userId;

    if (reviewerId === parseInt(reviewedUserId)) {
      return res.status(400).json({ error: 'Cannot review yourself' });
    }

    const result = await pool.query(
      `INSERT INTO reviews (reviewer_id, reviewed_user_id, rating, comment, listing_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [reviewerId, reviewedUserId, rating, comment, listingId || null]
    );

    // Update user average rating
    const avgResult = await pool.query(
      'SELECT AVG(rating) FROM reviews WHERE reviewed_user_id = $1',
      [reviewedUserId]
    );

    const avgRating = parseFloat(avgResult.rows[0].avg);
    await pool.query(
      'UPDATE users SET average_rating = $1 WHERE id = $2',
      [avgRating, reviewedUserId]
    );

    res.status(201).json({
      message: 'Review created successfully',
      review: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Get reviews for user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT r.*, u.first_name, u.last_name, u.profile_image_url
       FROM reviews r
       JOIN users u ON r.reviewer_id = u.id
       WHERE r.reviewed_user_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM reviews WHERE reviewed_user_id = $1',
      [userId]
    );

    res.json({
      reviews: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;
