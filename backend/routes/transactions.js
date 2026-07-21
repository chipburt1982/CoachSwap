const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create payment intent
router.post('/payment-intent', authenticateToken, async (req, res) => {
  try {
    const { listingId, amount } = req.body;
    const buyerId = req.user.userId;

    // Get listing
    const listingResult = await pool.query(
      'SELECT user_id, title, price FROM listings WHERE id = $1',
      [listingId]
    );

    if (listingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const listing = listingResult.rows[0];
    const sellerId = listing.user_id;
    const transactionAmount = amount || (listing.price * 100);

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(transactionAmount),
      currency: 'usd',
      metadata: {
        listingId,
        buyerId,
        sellerId
      }
    });

    // Create transaction record
    const transactionResult = await pool.query(
      `INSERT INTO transactions (listing_id, buyer_id, seller_id, transaction_type, amount, stripe_payment_id, status)
       VALUES ($1, $2, $3, 'sale', $4, $5, 'pending')
       RETURNING *`,
      [listingId, buyerId, sellerId, transactionAmount / 100, paymentIntent.id]
    );

    res.json({
      clientSecret: paymentIntent.client_secret,
      transactionId: transactionResult.rows[0].id
    });
  } catch (err) {
    console.error('Error creating payment intent:', err);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Confirm payment
router.post('/confirm-payment', authenticateToken, async (req, res) => {
  try {
    const { transactionId, paymentIntentId } = req.body;

    // Get payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update transaction status
      await pool.query(
        'UPDATE transactions SET status = \'completed\' WHERE id = $1',
        [transactionId]
      );

      // Mark listing as sold
      await pool.query(
        'UPDATE listings SET status = \'sold\' WHERE id = (SELECT listing_id FROM transactions WHERE id = $1)',
        [transactionId]
      );

      res.json({
        message: 'Payment confirmed successfully',
        status: 'completed'
      });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (err) {
    console.error('Error confirming payment:', err);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

// Get user transactions
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type = 'all' } = req.query;

    let query = `SELECT * FROM transactions WHERE`;
    let params = [];

    if (type === 'bought') {
      query += ' buyer_id = $1';
      params = [userId];
    } else if (type === 'sold') {
      query += ' seller_id = $1';
      params = [userId];
    } else {
      query += ' (buyer_id = $1 OR seller_id = $1)';
      params = [userId];
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;
