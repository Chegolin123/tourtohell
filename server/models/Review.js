const { pool } = require('../config/database');

const Review = {
  // Получить все отзывы (для админа)
  getAllForAdmin: async () => {
    const [rows] = await pool.query(`
      SELECT r.*, u.name as user_name, u.email as user_email, t.title as tour_title 
      FROM reviews r 
      LEFT JOIN users u ON r.user_id = u.id 
      LEFT JOIN tours t ON r.tour_id = t.id 
      ORDER BY r.created_at DESC
    `);
    return rows;
  },

  // Обновить статус отзыва
  updateStatus: async (id, status) => {
    await pool.query('UPDATE reviews SET status = ? WHERE id = ?', [status, id]);
    const [updated] = await pool.query('SELECT * FROM reviews WHERE id = ?', [id]);
    return updated[0];
  },

  // Получить статистику по отзывам
  getStats: async () => {
    const [pending] = await pool.query('SELECT COUNT(*) as count FROM reviews WHERE status = "pending"');
    const [approved] = await pool.query('SELECT COUNT(*) as count FROM reviews WHERE status = "approved"');
    const [rejected] = await pool.query('SELECT COUNT(*) as count FROM reviews WHERE status = "rejected"');
    
    return {
      pending: pending[0].count,
      approved: approved[0].count,
      rejected: rejected[0].count,
      total: pending[0].count + approved[0].count + rejected[0].count
    };
  },

  // ... остальные методы
};

module.exports = Review;