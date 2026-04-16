const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// @route   POST /api/bookings
// @desc    Create a new booking
router.post('/', async (req, res) => {
  try {
    console.log('📝 Received booking request:', req.body);
    
    const { 
      tourId, tourName, startDate, participants, 
      name, email, phone, paymentMethod, specialRequests, 
      totalPrice, userId 
    } = req.body;
    
    if (!name || !email || !phone || !startDate || !participants) {
      return res.status(400).json({ 
        success: false, 
        message: 'Пожалуйста, заполните все обязательные поля' 
      });
    }
    
    const [result] = await pool.query(
      `INSERT INTO bookings 
       (user_id, name, email, phone, tour_id, tour_name, participants, preferred_date, 
        payment_method, special_requests, total_price, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        userId || null, 
        name, 
        email, 
        phone, 
        tourId || null, 
        tourName, 
        participants, 
        startDate,
        paymentMethod || 'card',
        specialRequests || null,
        totalPrice || 0
      ]
    );
    
    console.log('✅ Booking created with ID:', result.insertId);
    
    res.status(201).json({ 
      success: true, 
      message: 'Бронирование успешно создано! Демон свяжется с вами для подтверждения.',
      bookingId: result.insertId
    });
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка при создании бронирования',
      error: error.message 
    });
  }
});

module.exports = router;