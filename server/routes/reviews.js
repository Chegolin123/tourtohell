const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// @route   GET /api/reviews
// @desc    Get all approved reviews with filtering and sorting
router.get('/', async (req, res) => {
  try {
    const { filter, sort, tourId } = req.query;
    
    let whereClause = 'WHERE status = "approved"';
    if (tourId) {
      whereClause += ' AND tour_id = ' + parseInt(tourId);
    }
    
    // Сортировка
    let orderBy = 'ORDER BY created_at DESC';
    if (sort === 'oldest') orderBy = 'ORDER BY created_at ASC';
    if (sort === 'highest') orderBy = 'ORDER BY rating DESC';
    if (sort === 'lowest') orderBy = 'ORDER BY rating ASC';
    
    const [rows] = await pool.query(
      `SELECT * FROM reviews ${whereClause} ${orderBy}`
    );
    
    console.log(`Found ${rows.length} approved reviews`);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/reviews/stats
// @desc    Get reviews statistics
router.get('/stats', async (req, res) => {
  try {
    const [reviews] = await pool.query('SELECT * FROM reviews WHERE status = "approved"');
    
    const total = reviews.length;
    const average = total > 0 
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) 
      : 0;
    
    const distribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    };
    
    res.json({ total, average, distribution });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/reviews/tour/:tourId
// @desc    Get reviews by tour ID
router.get('/tour/:tourId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM reviews WHERE tour_id = ? AND status = "approved" ORDER BY created_at DESC',
      [req.params.tourId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching tour reviews:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/reviews
// @desc    Create a new review (pending moderation)
router.post('/', async (req, res) => {
  try {
    const { user_name, user_id, avatar, rating, tour_id, tour_name, comment, location } = req.body;

    console.log('🔍 Creating review with data:', { 
      user_name, 
      user_id, 
      rating, 
      tour_name,
      comment_length: comment?.length 
    });

    // Валидация обязательных полей
    if (!user_name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Имя пользователя обязательно' 
      });
    }

    if (!rating) {
      return res.status(400).json({ 
        success: false, 
        message: 'Оценка обязательна' 
      });
    }

    if (!comment) {
      return res.status(400).json({ 
        success: false, 
        message: 'Текст отзыва обязателен' 
      });
    }

    // Проверяем, что rating - число от 1 до 5
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Рейтинг должен быть числом от 1 до 5' 
      });
    }

    const query = `
      INSERT INTO reviews 
      (user_name, user_id, avatar, rating, tour_id, tour_name, comment, location, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;
    
    const values = [
      user_name, 
      user_id || null, 
      avatar || '👤', 
      ratingNum, 
      tour_id || null, 
      tour_name || null, 
      comment, 
      location || 'Неизвестно'
    ];

    console.log('Executing query with values:', values);

    const [result] = await pool.query(query, values);

    console.log('✅ New review created with ID:', result.insertId);

    res.status(201).json({
      success: true,
      message: 'Отзыв отправлен на модерацию',
      id: result.insertId
    });

  } catch (error) {
    console.error('❌ Error creating review:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка при создании отзыва',
      error: error.message 
    });
  }
});

// @route   PUT /api/reviews/:id/like
// @desc    Like a review
router.put('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('UPDATE reviews SET likes = likes + 1 WHERE id = ?', [id]);
    
    const [rows] = await pool.query('SELECT likes FROM reviews WHERE id = ?', [id]);
    
    res.json({ likes: rows[0]?.likes || 0 });
  } catch (error) {
    console.error('Error liking review:', error);
    res.status(400).json({ error: error.message });
  }
});

// @route   GET /api/reviews/user/:userId
// @desc    Get reviews by user ID (all statuses for the user)
router.get('/user/:userId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM reviews WHERE user_id = ? ORDER BY created_at DESC',
      [req.params.userId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;