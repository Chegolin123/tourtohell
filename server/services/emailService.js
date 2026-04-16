const nodemailer = require('nodemailer');

// Создаем транспортер для отправки писем
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.mail.ru',
  port: process.env.EMAIL_PORT || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const emailService = {
  // Отправка уведомления о новой заявке администратору
  sendNewBookingNotification: async (booking) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: '🔥 Новая заявка на бронирование!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ef4444;">Новая заявка на бронирование</h2>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 10px;">
              <p><strong>Клиент:</strong> ${booking.name}</p>
              <p><strong>Email:</strong> ${booking.email}</p>
              <p><strong>Телефон:</strong> ${booking.phone}</p>
              <p><strong>Тур:</strong> ${booking.tour_name}</p>
              <p><strong>Дата:</strong> ${new Date(booking.preferred_date).toLocaleDateString('ru-RU')}</p>
              <p><strong>Участников:</strong> ${booking.participants}</p>
              <p><strong>Сумма:</strong> ${booking.total_price?.toLocaleString()} ₽</p>
              ${booking.message ? `<p><strong>Сообщение:</strong> ${booking.message}</p>` : ''}
            </div>
            <p style="margin-top: 20px;">
              <a href="${process.env.CLIENT_URL}/admin" style="background: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Перейти в админ-панель</a>
            </p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Email notification sent to admin');
    } catch (error) {
      console.error('❌ Error sending email:', error);
    }
  },

  // Отправка уведомления клиенту об изменении статуса
  sendBookingStatusUpdate: async (booking) => {
    try {
      const statusText = {
        'pending': 'ожидает подтверждения',
        'confirmed': 'подтверждена',
        'cancelled': 'отменена',
        'completed': 'завершена'
      };

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: booking.email,
        subject: `Статус вашего бронирования - ${statusText[booking.status]}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ef4444;">Статус бронирования обновлен</h2>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 10px;">
              <p><strong>Тур:</strong> ${booking.tour_name}</p>
              <p><strong>Новый статус:</strong> 
                <span style="
                  display: inline-block;
                  padding: 3px 10px;
                  border-radius: 15px;
                  font-size: 14px;
                  ${booking.status === 'confirmed' ? 'background: #10b981; color: white;' : ''}
                  ${booking.status === 'pending' ? 'background: #f59e0b; color: white;' : ''}
                  ${booking.status === 'cancelled' ? 'background: #ef4444; color: white;' : ''}
                  ${booking.status === 'completed' ? 'background: #3b82f6; color: white;' : ''}
                ">
                  ${statusText[booking.status]}
                </span>
              </p>
              ${booking.status === 'confirmed' ? '<p>Спасибо за подтверждение! Ждем вас в путешествии.</p>' : ''}
              ${booking.status === 'cancelled' ? '<p>Ваше бронирование отменено. Если у вас есть вопросы, свяжитесь с нами.</p>' : ''}
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Email notification sent to client');
    } catch (error) {
      console.error('❌ Error sending email:', error);
    }
  },

  // Отправка уведомления о новом отзыве
  sendNewReviewNotification: async (review) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: '📝 Новый отзыв требует модерации',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ef4444;">Новый отзыв ожидает модерации</h2>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 10px;">
              <p><strong>Автор:</strong> ${review.user_name}</p>
              <p><strong>Тур:</strong> ${review.tour_name}</p>
              <p><strong>Рейтинг:</strong> ${'★'.repeat(review.rating)}</p>
              <p><strong>Отзыв:</strong> ${review.comment}</p>
            </div>
            <p style="margin-top: 20px;">
              <a href="${process.env.CLIENT_URL}/admin?tab=reviews" style="background: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Перейти к модерации</a>
            </p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Email notification sent to admin');
    } catch (error) {
      console.error('❌ Error sending email:', error);
    }
  }
};

module.exports = emailService;