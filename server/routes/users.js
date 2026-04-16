const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// @route   GET /api/users/:userId/bookings
// @desc    Get user bookings
router.get('/:userId/bookings', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT b.*, t.title as tour_title, t.image as tour_image 
       FROM bookings b 
       LEFT JOIN tours t ON b.tour_id = t.id 
       WHERE b.user_id = ? 
       ORDER BY b.created_at DESC`,
      [req.params.userId]
    );
    res.json(rows || []);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/:userId/reviews
// @desc    Get user reviews
router.get('/:userId/reviews', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, t.title as tour_name 
       FROM reviews r 
       LEFT JOIN tours t ON r.tour_id = t.id 
       WHERE r.user_id = ? 
       ORDER BY r.created_at DESC`,
      [req.params.userId]
    );
    res.json(rows || []);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;