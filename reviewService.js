import api from './api';

export const reviewService = {
  // Получить все отзывы
  getAllReviews: async (filter = 'all', sort = 'newest') => {
    try {
      const params = new URLSearchParams();
      if (filter && filter !== 'all') params.append('filter', filter);
      if (sort) params.append('sort', sort);
      
      const response = await api.get(/reviews?);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  // Получить статистику отзывов
  getReviewsStats: async () => {
    try {
      const response = await api.get('/reviews/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews stats:', error);
      throw error;
    }
  },

  // Получить отзывы по тур ID
  getTourReviews: async (tourId) => {
    try {
      const response = await api.get(/reviews/tour/);
      return response.data;
    } catch (error) {
      console.error('Error fetching tour reviews:', error);
      throw error;
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
      const response = await api.put(/reviews//like);
      return response.data;
    } catch (error) {
      console.error('Error liking review:', error);
      throw error;
    }
  },

  // Получить отзывы пользователя
  getUserReviews: async (userId) => {
    try {
      const response = await api.get(/reviews/user/);
      return response.data;
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error;
    }
  },

  // Удалить отзыв
  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(/reviews/);
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }
};