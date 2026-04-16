import api from './api';

export const adminService = {
  // Получить расширенную статистику
  getAdvancedStats: async () => {
    try {
      const response = await api.get('/admin/stats/advanced');
      return response.data;
    } catch (error) {
      console.error('Error fetching advanced stats:', error);
      throw error;
    }
  },

  // ==================== УПРАВЛЕНИЕ ТУРАМИ ====================

  // Получить все туры
  getAllTours: async () => {
    try {
      const response = await api.get('/admin/tours');
      return response.data;
    } catch (error) {
      console.error('Error fetching tours:', error);
      throw error;
    }
  },

  // Создать новый тур
  createTour: async (tourData) => {
    try {
      const response = await api.post('/admin/tours', tourData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating tour:', error);
      throw error;
    }
  },

  // Обновить тур
  updateTour: async (id, tourData) => {
    try {
      const response = await api.put(`/admin/tours/${id}`, tourData);
      return response.data;
    } catch (error) {
      console.error('Error updating tour:', error);
      throw error;
    }
  },

  // Удалить тур
  deleteTour: async (id) => {
    try {
      const response = await api.delete(`/admin/tours/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting tour:', error);
      throw error;
    }
  },

  // Загрузить изображения для тура
  uploadTourImages: async (tourId, images) => {
    try {
      const formData = new FormData();
      images.forEach(image => formData.append('images', image));
      const response = await api.post(`/admin/tours/${tourId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  },

  // Удалить изображение тура
  deleteTourImage: async (imageId) => {
    try {
      const response = await api.delete(`/admin/tours/images/${imageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  // ==================== УПРАВЛЕНИЕ ЗАЯВКАМИ ====================

  // Получить все заявки
  getAllBookings: async () => {
    try {
      const response = await api.get('/admin/bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Обновить статус заявки
  updateBookingStatus: async (bookingId, status) => {
    try {
      const response = await api.put(`/admin/bookings/${bookingId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  // Удалить заявку
  deleteBooking: async (bookingId) => {
    try {
      const response = await api.delete(`/admin/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  },

  // ==================== УПРАВЛЕНИЕ ОБРАЩЕНИЯМИ ====================

  // Получить все обращения
  getAllContacts: async () => {
    try {
      const response = await api.get('/admin/contacts');
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },

  // Обновить статус обращения
  updateContactStatus: async (contactId, status) => {
    try {
      const response = await api.put(`/admin/contacts/${contactId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating contact status:', error);
      throw error;
    }
  },

  // Удалить обращение
  deleteContact: async (contactId) => {
    try {
      const response = await api.delete(`/admin/contacts/${contactId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  },

  // ==================== МОДЕРАЦИЯ ОТЗЫВОВ ====================

  // Получить все отзывы для модерации
  getAllReviews: async () => {
    try {
      const response = await api.get('/admin/reviews');
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  // Обновить статус отзыва
  updateReviewStatus: async (reviewId, status) => {
    try {
      const response = await api.put(`/admin/reviews/${reviewId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating review status:', error);
      throw error;
    }
  },

  // ==================== СТАТИСТИКА ====================

  // Получить базовую статистику
  getStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  // Получить статистику по заявкам
  getBookingStats: async () => {
    try {
      const response = await api.get('/admin/bookings/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      throw error;
    }
  }
};