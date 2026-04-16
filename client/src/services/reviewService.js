import api from './api';

export const reviewService = {
  // Получить все отзывы
  getAllReviews: async (filter = 'all', sort = 'newest') => {
    try {
      const params = new URLSearchParams();
      if (filter && filter !== 'all') params.append('filter', filter);
      if (sort) params.append('sort', sort);
      
      const response = await api.get(`/reviews?${params.toString()}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },

  // Получить статистику отзывов
  getReviewsStats: async () => {
    try {
      const response = await api.get('/reviews/stats');
      return response.data || { 
        total: 0, 
        average: 0, 
        distribution: {5:0, 4:0, 3:0, 2:0, 1:0} 
      };
    } catch (error) {
      console.error('Error fetching reviews stats:', error);
      return { 
        total: 0, 
        average: 0, 
        distribution: {5:0, 4:0, 3:0, 2:0, 1:0} 
      };
    }
  },

  // Получить отзывы по тур ID
  getTourReviews: async (tourId) => {
    try {
      const response = await api.get(`/reviews/tour/${tourId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching tour reviews:', error);
      return [];
    }
  },

  // Получить отзывы пользователя
  getUserReviews: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/reviews`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      return [];
    }
  },

  // Создать отзыв
  createReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  // Поставить лайк
  likeReview: async (reviewId) => {
    try {
      const response = await api.put(`/reviews/${reviewId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error liking review:', error);
      throw error;
    }
  },

  // Удалить отзыв (для админа или владельца)
  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  // Обновить отзыв
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }
};