const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Send message
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { recipientId, listingId, message } = req.body;
    const senderId = req.user.userId;

    if (!recipientId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO messages (sender_id, recipient_id, listing_id, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [senderId, recipientId, listingId || null, message]
    );

    res.status(201).json({
      message: 'Message sent successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get conversation
router.get('/conversation/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;

    const result = await pool.query(
      `SELECT m.*, u.first_name, u.last_name, u.profile_image_url
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE (m.sender_id = $1 AND m.recipient_id = $2) 
          OR (m.sender_id = $2 AND m.recipient_id = $1)
       ORDER BY m.created_at ASC`,
      [currentUserId, userId]
    );

    // Mark messages as read
    await pool.query(
      `UPDATE messages SET read = true 
       WHERE recipient_id = $1 AND sender_id = $2 AND read = false`,
      [currentUserId, userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get user conversations
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT DISTINCT ON (sender_id, recipient_id)
         CASE WHEN sender_id = $1 THEN recipient_id ELSE sender_id END as other_user_id,
         (CASE WHEN sender_id = $1 THEN recipient_id ELSE sender_id END) as user_id,
         MAX(created_at) as last_message_at,
         (SELECT message FROM messages m2 
          WHERE (m2.sender_id = m.sender_id AND m2.recipient_id = m.recipient_id)
             OR (m2.sender_id = m.recipient_id AND m2.recipient_id = m.sender_id)
          ORDER BY m2.created_at DESC LIMIT 1) as last_message
       FROM messages m
       WHERE sender_id = $1 OR recipient_id = $1
       GROUP BY CASE WHEN sender_id = $1 THEN recipient_id ELSE sender_id END
       ORDER BY MAX(created_at) DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

module.exports = router;
