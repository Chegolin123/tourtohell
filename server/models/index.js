const { pool } = require('../config/database');

// Модель для туров
const Tour = {
  // Получить все туры
  findAll: async () => {
    const [rows] = await pool.query('SELECT * FROM tours');
    return rows;
  },

  // Получить тур по ID
  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM tours WHERE id = ?', [id]);
    return rows[0];
  },

  // Создать тур
  create: async (tourData) => {
    const { title, location, description, price, duration, difficulty, image } = tourData;
    const [result] = await pool.query(
      'INSERT INTO tours (title, location, description, price, duration, difficulty, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, location, description, price, duration, difficulty, image]
    );
    return { id: result.insertId, ...tourData };
  },

  // Обновить тур
  update: async (id, tourData) => {
    const { title, location, description, price, duration, difficulty, image } = tourData;
    await pool.query(
      'UPDATE tours SET title = ?, location = ?, description = ?, price = ?, duration = ?, difficulty = ?, image = ? WHERE id = ?',
      [title, location, description, price, duration, difficulty, image, id]
    );
    return { id, ...tourData };
  },

  // Удалить тур
  delete: async (id) => {
    await pool.query('DELETE FROM tours WHERE id = ?', [id]);
    return { message: 'Tour deleted' };
  }
};

// Модель для пользователей
const User = {
  // Получить всех пользователей
  findAll: async () => {
    const [rows] = await pool.query('SELECT id, name, email, phone, role, created_at FROM users');
    return rows;
  },

  // Получить пользователя по ID
  findById: async (id) => {
    const [rows] = await pool.query('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  // Получить пользователя по email
  findByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  // Создать пользователя
  create: async (userData) => {
    const { name, email, password, phone, role = 'user' } = userData;
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, phone, role]
    );
    return { id: result.insertId, name, email, phone, role };
  },

  // Обновить пользователя
  update: async (id, userData) => {
    const { name, email, phone } = userData;
    await pool.query(
      'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
      [name, email, phone, id]
    );
    return { id, name, email, phone };
  }
};

// Модель для бронирований
const Booking = {
  // Получить все бронирования
  findAll: async () => {
    const [rows] = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
    return rows;
  },

  // Получить бронирования пользователя
  findByUserId: async (userId) => {
    const [rows] = await pool.query(
      'SELECT b.*, t.title as tour_title FROM bookings b LEFT JOIN tours t ON b.tour_id = t.id WHERE b.user_id = ? ORDER BY b.created_at DESC',
      [userId]
    );
    return rows;
  },

  // Получить бронирование по ID
  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
    return rows[0];
  },

  // Создать бронирование
  create: async (bookingData) => {
    try {
      console.log('📝 Creating booking:', bookingData);
      
      const { user_id, tour_id, participants, start_date, total_price, status = 'pending', special_requests, payment_method } = bookingData;
      
      const [result] = await pool.query(
        'INSERT INTO bookings (user_id, tour_id, participants, start_date, total_price, status, special_requests, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [user_id, tour_id, participants, start_date, total_price, status, special_requests, payment_method]
      );
      
      return { id: result.insertId, ...bookingData };
    } catch (error) {
      console.error('Error in Booking.create:', error);
      throw error;
    }
  },

  // Обновить статус бронирования
  updateStatus: async (id, status) => {
    await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
    const [updated] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
    return updated[0];
  },

  // Получить статистику по бронированиям
  getStats: async () => {
    const [total] = await pool.query('SELECT COUNT(*) as count FROM bookings');
    const [byStatus] = await pool.query('SELECT status, COUNT(*) as count FROM bookings GROUP BY status');
    const [recent] = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5');
    
    const statusObj = {};
    byStatus.forEach(item => {
      statusObj[item.status] = item.count;
    });
    
    return {
      total: total[0].count,
      byStatus: statusObj,
      recent
    };
  }
};

// Модель для отзывов
const Review = {
  // Получить все отзывы
  findAll: async (filter = 'all', sort = 'newest') => {
    let query = 'SELECT * FROM reviews WHERE status = "approved"';
    let orderBy = 'ORDER BY created_at DESC';
    
    if (sort === 'oldest') orderBy = 'ORDER BY created_at ASC';
    if (sort === 'highest') orderBy = 'ORDER BY rating DESC';
    if (sort === 'lowest') orderBy = 'ORDER BY rating ASC';
    
    const [rows] = await pool.query(query + ' ' + orderBy);
    return rows;
  },

  // Получить отзывы по тур ID
  findByTourId: async (tourId) => {
    const [rows] = await pool.query(
      'SELECT * FROM reviews WHERE tour_id = ? AND status = "approved" ORDER BY created_at DESC',
      [tourId]
    );
    return rows;
  },

  // Получить статистику отзывов
  getStats: async () => {
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
    
    return { total, average, distribution };
  },

  // Создать отзыв
  create: async (reviewData) => {
    const { user_name, user_id, avatar, rating, tour_id, comment, location } = reviewData;
    const [result] = await pool.query(
      'INSERT INTO reviews (user_name, user_id, avatar, rating, tour_id, comment, location) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_name, user_id || null, avatar || '👤', rating, tour_id, comment, location || 'Неизвестно']
    );
    return { id: result.insertId, ...reviewData };
  },

  // Поставить лайк
  like: async (id) => {
    await pool.query('UPDATE reviews SET likes = likes + 1 WHERE id = ?', [id]);
    const [rows] = await pool.query('SELECT likes FROM reviews WHERE id = ?', [id]);
    return { likes: rows[0].likes };
  }
};

// Модель для обратной связи
const Contact = {
  // Получить все обращения
  findAll: async () => {
    const [rows] = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    return rows;
  },

  // Получить обращение по ID
  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM contacts WHERE id = ?', [id]);
    return rows[0];
  },

  // Получить обращения по email
  findByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM contacts WHERE email = ? ORDER BY created_at DESC', [email]);
    return rows;
  },

  // Создать обращение
  create: async (contactData) => {
    try {
      console.log('📝 Creating contact request:', contactData);
      
      const { 
        name, 
        email, 
        phone, 
        tourId, 
        participants, 
        date, 
        message 
      } = contactData;
      
      // Получаем название тура если есть tourId
      let tourName = null;
      if (tourId) {
        const [tourRows] = await pool.query('SELECT title FROM tours WHERE id = ?', [tourId]);
        if (tourRows.length > 0) {
          tourName = tourRows[0].title;
        }
      }
      
      const query = `
        INSERT INTO contacts 
        (name, email, phone, tour_id, tour_name, participants, preferred_date, message, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')
      `;
      
      const values = [
        name, 
        email, 
        phone, 
        tourId || null, 
        tourName, 
        participants || 1, 
        date || null, 
        message || null
      ];
      
      const [result] = await pool.query(query, values);
      
      console.log('✅ Contact created with ID:', result.insertId);
      
      const [newContact] = await pool.query('SELECT * FROM contacts WHERE id = ?', [result.insertId]);
      return newContact[0];
    } catch (error) {
      console.error('❌ Error in Contact.create:', error);
      throw error;
    }
  },

  // Обновить статус обращения
  updateStatus: async (id, status) => {
    await pool.query('UPDATE contacts SET status = ? WHERE id = ?', [status, id]);
    const [updated] = await pool.query('SELECT * FROM contacts WHERE id = ?', [id]);
    return updated[0];
  },

  // Получить статистику по обращениям
  getStats: async () => {
    const [total] = await pool.query('SELECT COUNT(*) as count FROM contacts');
    const [byStatus] = await pool.query('SELECT status, COUNT(*) as count FROM contacts GROUP BY status');
    const [recent] = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5');
    
    const statusObj = {};
    byStatus.forEach(item => {
      statusObj[item.status] = item.count;
    });
    
    return {
      total: total[0].count,
      byStatus: statusObj,
      recent
    };
  }
};

// Экспортируем все модели
module.exports = {
  Tour,
  User,
  Booking,
  Review,
  Contact
};