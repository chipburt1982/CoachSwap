const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validateListingCreation, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Create listing
router.post('/', authenticateToken, validateListingCreation, async (req, res) => {
  try {
    const { title, description, category, condition, price, location, forTrade, images } = req.body;
    const userId = req.user.userId;

    const listingResult = await pool.query(
      `INSERT INTO listings (user_id, title, description, category, condition, price, for_trade, location, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active')
       RETURNING id`,
      [userId, title, description, category, condition, price || null, forTrade || false, location]
    );

    const listingId = listingResult.rows[0].id;

    // Add images if provided
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await pool.query(
          'INSERT INTO listing_images (listing_id, image_url, display_order) VALUES ($1, $2, $3)',
          [listingId, images[i], i]
        );
      }
    }

    res.status(201).json({
      id: listingId,
      message: 'Listing created successfully'
    });
  } catch (err) {
    console.error('Error creating listing:', err);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Get all listings with filters
router.get('/', async (req, res) => {
  try {
    const { category, condition, priceMin, priceMax, location, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM listings WHERE status = \'active\'';
    let params = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }
    if (condition) {
      paramCount++;
      query += ` AND condition = $${paramCount}`;
      params.push(condition);
    }
    if (priceMin) {
      paramCount++;
      query += ` AND price >= $${paramCount}`;
      params.push(priceMin);
    }
    if (priceMax) {
      paramCount++;
      query += ` AND price <= $${paramCount}`;
      params.push(priceMax);
    }
    if (location) {
      paramCount++;
      query += ` AND location ILIKE $${paramCount}`;
      params.push(`%${location}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (paramCount + 1) + ' OFFSET $' + (paramCount + 2);
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM listings WHERE status = \'active\''
    );

    res.json({
      listings: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    console.error('Error fetching listings:', err);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// Get listing details
router.get('/:listingId', async (req, res) => {
  try {
    const { listingId } = req.params;

    const listingResult = await pool.query(
      `SELECT l.*, u.first_name, u.last_name, u.profile_image_url, u.average_rating
       FROM listings l
       JOIN users u ON l.user_id = u.id
       WHERE l.id = $1`,
      [listingId]
    );

    if (listingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const imagesResult = await pool.query(
      'SELECT image_url FROM listing_images WHERE listing_id = $1 ORDER BY display_order',
      [listingId]
    );

    const listing = listingResult.rows[0];
    listing.images = imagesResult.rows.map(row => row.image_url);

    res.json(listing);
  } catch (err) {
    console.error('Error fetching listing:', err);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

// Update listing
router.put('/:listingId', authenticateToken, async (req, res) => {
  try {
    const { listingId } = req.params;
    const { title, description, condition, price, location, status } = req.body;

    // Check ownership
    const listingCheck = await pool.query(
      'SELECT user_id FROM listings WHERE id = $1',
      [listingId]
    );

    if (listingCheck.rows.length === 0 || listingCheck.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      `UPDATE listings SET title = $1, description = $2, condition = $3, price = $4, location = $5, status = $6, updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [title, description, condition, price, location, status, listingId]
    );

    res.json({
      message: 'Listing updated successfully',
      listing: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating listing:', err);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// Delete listing
router.delete('/:listingId', authenticateToken, async (req, res) => {
  try {
    const { listingId } = req.params;

    // Check ownership
    const listingCheck = await pool.query(
      'SELECT user_id FROM listings WHERE id = $1',
      [listingId]
    );

    if (listingCheck.rows.length === 0 || listingCheck.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await pool.query('DELETE FROM listings WHERE id = $1', [listingId]);

    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    console.error('Error deleting listing:', err);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

module.exports = router;
