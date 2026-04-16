const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production';

// Middleware для проверки прав администратора
const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Не авторизован' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const [users] = await pool.query('SELECT role FROM users WHERE id = ?', [decoded.id]);
    
    if (users.length === 0 || users[0].role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }
    
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Недействительный токен' });
  }
};

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Только изображения разрешены!'));
    }
  }
});

// ==================== ТЕСТОВЫЙ МАРШРУТ ====================

// @route   GET /api/admin/test
// @desc    Test admin route
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Admin route is working!',
    timestamp: new Date().toISOString()
  });
});

// ==================== УПРАВЛЕНИЕ ЗАЯВКАМИ ====================

// @route   GET /api/admin/bookings
// @desc    Get all bookings (admin only)
router.get('/bookings', isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, 
             u.name as user_name, 
             u.email as user_email,
             t.title as tour_title
      FROM bookings b 
      LEFT JOIN users u ON b.user_id = u.id 
      LEFT JOIN tours t ON b.tour_id = t.id 
      ORDER BY b.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/admin/bookings/:id/status
// @desc    Update booking status (admin only)
router.put('/bookings/:id/status', isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    await pool.query(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, id]
    );

    res.json({ success: true, message: 'Статус обновлен' });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/admin/bookings/:id
// @desc    Delete booking (admin only)
router.delete('/bookings/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
    res.json({ success: true, message: 'Заявка удалена' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== УПРАВЛЕНИЕ ОБРАЩЕНИЯМИ ====================

// @route   GET /api/admin/contacts
// @desc    Get all contacts (admin only)
router.get('/contacts', isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, 
             u.name as user_name,
             u.email as user_email,
             t.title as tour_title
      FROM contacts c 
      LEFT JOIN users u ON c.user_id = u.id 
      LEFT JOIN tours t ON c.tour_id = t.id 
      ORDER BY c.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/admin/contacts/:id/status
// @desc    Update contact status (admin only)
router.put('/contacts/:id/status', isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    await pool.query(
      'UPDATE contacts SET status = ? WHERE id = ?',
      [status, id]
    );

    res.json({ success: true, message: 'Статус обновлен' });
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/admin/contacts/:id
// @desc    Delete contact (admin only)
router.delete('/contacts/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM contacts WHERE id = ?', [id]);
    res.json({ success: true, message: 'Обращение удалено' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== УПРАВЛЕНИЕ ТУРАМИ ====================

// @route   GET /api/admin/tours
// @desc    Get all tours for admin
router.get('/tours', isAdmin, async (req, res) => {
  try {
    const [tours] = await pool.query('SELECT * FROM tours ORDER BY id DESC');
    res.json(tours);
  } catch (error) {
    console.error('Error fetching tours:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/admin/tours
// @desc    Create new tour
router.post('/tours', isAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const { title, location, description, fullDescription, shortDesc, price, duration, maxGroupSize, difficulty, badge, category } = req.body;

    const [result] = await pool.query(
      `INSERT INTO tours 
       (title, location, description, full_description, short_desc, price, duration, max_group_size, difficulty, badge, category) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, location, description, fullDescription, shortDesc, price, duration, maxGroupSize, difficulty, badge, category]
    );

    const tourId = result.insertId;

    // Сохраняем изображения
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageUrl = `/uploads/${file.filename}`;
        await pool.query(
          'INSERT INTO tour_images (tour_id, image_url) VALUES (?, ?)',
          [tourId, imageUrl]
        );
      }
    }

    res.json({ success: true, message: 'Тур создан', tourId });
  } catch (error) {
    console.error('Error creating tour:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/admin/tours/:id
// @desc    Update tour
router.put('/tours/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, location, description, fullDescription, shortDesc, price, duration, maxGroupSize, difficulty, badge, category } = req.body;

    await pool.query(
      `UPDATE tours SET 
       title = ?, location = ?, description = ?, full_description = ?, short_desc = ?, 
       price = ?, duration = ?, max_group_size = ?, difficulty = ?, badge = ?, category = ?
       WHERE id = ?`,
      [title, location, description, fullDescription, shortDesc, price, duration, maxGroupSize, difficulty, badge, category, id]
    );

    res.json({ success: true, message: 'Тур обновлен' });
  } catch (error) {
    console.error('Error updating tour:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/admin/tours/:id
// @desc    Delete tour
router.delete('/tours/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM tours WHERE id = ?', [id]);
    res.json({ success: true, message: 'Тур удален' });
  } catch (error) {
    console.error('Error deleting tour:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/admin/tours/:id/images
// @desc    Upload tour images
router.post('/tours/:id/images', isAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const images = [];
    for (const file of req.files) {
      const imageUrl = `/uploads/${file.filename}`;
      await pool.query(
        'INSERT INTO tour_images (tour_id, image_url) VALUES (?, ?)',
        [id, imageUrl]
      );
      images.push(imageUrl);
    }

    res.json({ success: true, message: 'Изображения загружены', images });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/admin/tours/images/:id
// @desc    Delete tour image
router.delete('/tours/images/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [image] = await pool.query('SELECT image_url FROM tour_images WHERE id = ?', [id]);
    if (image.length > 0) {
      const filename = path.basename(image[0].image_url);
      const filepath = path.join(__dirname, '../uploads', filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    await pool.query('DELETE FROM tour_images WHERE id = ?', [id]);
    res.json({ success: true, message: 'Изображение удалено' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== СТАТИСТИКА ====================

// @route   GET /api/admin/stats
// @desc    Get statistics (admin only)
router.get('/stats', isAdmin, async (req, res) => {
  try {
    // Статистика по бронированиям
    const [bookings] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new,
        SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM bookings
    `);

    // Статистика по обращениям
    const [contacts] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new,
        SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM contacts
    `);

    res.json({
      totalBookings: bookings[0].total || 0,
      newBookings: bookings[0].new || 0,
      processingBookings: bookings[0].processing || 0,
      confirmedBookings: bookings[0].confirmed || 0,
      cancelledBookings: bookings[0].cancelled || 0,
      totalContacts: contacts[0].total || 0,
      newContacts: contacts[0].new || 0,
      processingContacts: contacts[0].processing || 0,
      completedContacts: contacts[0].completed || 0
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/admin/stats/advanced
// @desc    Get advanced statistics with charts data
router.get('/stats/advanced', isAdmin, async (req, res) => {
  try {
    // Статистика по дням (последние 30 дней)
    const [dailyBookings] = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
        COALESCE(SUM(CAST(total_price AS DECIMAL(10,2))), 0) as revenue
      FROM bookings 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    // Популярные туры
    const [popularTours] = await pool.query(`
      SELECT 
        t.id,
        t.title,
        COUNT(b.id) as bookings_count,
        COALESCE(SUM(b.total_price), 0) as total_revenue,
        COALESCE(AVG(r.rating), 0) as avg_rating
      FROM tours t
      LEFT JOIN bookings b ON t.id = b.tour_id AND b.status = 'confirmed'
      LEFT JOIN reviews r ON t.id = r.tour_id AND r.status = 'approved'
      GROUP BY t.id
      ORDER BY bookings_count DESC
      LIMIT 10
    `);

    // Конверсия (упрощённая версия без tour_views)
    const [bookings] = await pool.query('SELECT COUNT(*) as count FROM bookings WHERE status = "confirmed"');
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
    
    const conversionRate = users[0].count > 0 
      ? ((bookings[0].count / users[0].count) * 100).toFixed(2) 
      : 0;

    // North Star Metric
    const [northStar] = await pool.query(`
      SELECT 
        COUNT(*) as total_confirmed,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today,
        SUM(CASE WHEN WEEK(created_at) = WEEK(CURDATE()) THEN 1 ELSE 0 END) as this_week,
        SUM(CASE WHEN MONTH(created_at) = MONTH(CURDATE()) THEN 1 ELSE 0 END) as this_month
      FROM bookings 
      WHERE status = 'confirmed'
    `);

    res.json({
      dailyBookings,
      popularTours,
      conversion: {
        users: users[0].count,
        bookings: bookings[0].count,
        rate: conversionRate
      },
      northStar: northStar[0],
      lastUpdated: new Date()
    });

  } catch (error) {
    console.error('Error fetching advanced stats:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// ==================== МОДЕРАЦИЯ ОТЗЫВОВ ====================

// @route   GET /api/admin/reviews
// @desc    Get all reviews for moderation
router.get('/reviews', isAdmin, async (req, res) => {
  try {
    const [reviews] = await pool.query(`
      SELECT r.*, u.name as user_name, u.email, t.title as tour_title 
      FROM reviews r 
      LEFT JOIN users u ON r.user_id = u.id 
      LEFT JOIN tours t ON r.tour_id = t.id 
      ORDER BY 
        CASE r.status 
          WHEN 'pending' THEN 1 
          WHEN 'approved' THEN 2 
          WHEN 'rejected' THEN 3 
        END,
        r.created_at DESC
    `);
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/admin/reviews/:id/status
// @desc    Update review status
router.put('/reviews/:id/status', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await pool.query('UPDATE reviews SET status = ? WHERE id = ?', [status, id]);

    // Если отзыв одобрен, обновляем рейтинг тура
    if (status === 'approved') {
      const [review] = await pool.query('SELECT tour_id FROM reviews WHERE id = ?', [id]);
      if (review.length > 0) {
        const { tour_id } = review[0];
        
        const [ratings] = await pool.query(
          'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE tour_id = ? AND status = "approved"',
          [tour_id]
        );
        
        await pool.query(
          'UPDATE tours SET rating = ?, reviews = ? WHERE id = ?',
          [ratings[0].avg_rating?.toFixed(1) || 0, ratings[0].count || 0, tour_id]
        );
      }
    }

    res.json({ success: true, message: 'Статус отзыва обновлен' });
  } catch (error) {
    console.error('Error updating review status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== СТАТИСТИКА ПО ЗАЯВКАМ ====================

// @route   GET /api/admin/bookings/stats
// @desc    Get detailed booking statistics
router.get('/bookings/stats', isAdmin, async (req, res) => {
  try {
    const [total] = await pool.query('SELECT COUNT(*) as count FROM bookings');
    const [byStatus] = await pool.query(`
      SELECT status, COUNT(*) as count, COALESCE(SUM(total_price), 0) as revenue 
      FROM bookings 
      GROUP BY status
    `);
    const [byMonth] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count,
        COALESCE(SUM(total_price), 0) as revenue
      FROM bookings 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month DESC
    `);

    res.json({
      total: total[0].count,
      byStatus,
      byMonth
    });
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;