const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// @route   GET /api/tours
// @desc    Get all tours
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tours');
    
    // Для каждого тура получаем дополнительные данные
    for (let tour of rows) {
      const [images] = await pool.query('SELECT image_url FROM tour_images WHERE tour_id = ?', [tour.id]);
      const [dates] = await pool.query('SELECT date FROM tour_dates WHERE tour_id = ?', [tour.id]);
      
      tour.images = images.map(i => i.image_url);
      tour.dates = dates.map(d => d.date);
    }
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching tours:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/tours/:id
// @desc    Get tour by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tours WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    
    const tour = rows[0];
    
    const [images] = await pool.query('SELECT image_url FROM tour_images WHERE tour_id = ?', [tour.id]);
    const [dates] = await pool.query('SELECT date FROM tour_dates WHERE tour_id = ?', [tour.id]);
    
    tour.images = images.map(i => i.image_url);
    tour.dates = dates.map(d => d.date);
    
    res.json(tour);
  } catch (error) {
    console.error('Error fetching tour:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;