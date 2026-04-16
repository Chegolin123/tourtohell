import api from './api';

export const tourService = {
  // Получить все туры
  getTours: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.category && filters.category !== 'all') {
      params.append('category', filters.category);
    }
    
    if (filters.difficulty && filters.difficulty !== 'all') {
      params.append('difficulty', filters.difficulty);
    }
    
    if (filters.priceRange && filters.priceRange[1] < 500000) {
      params.append('maxPrice', filters.priceRange[1]);
    }
    
    if (filters.search) {
      params.append('search', filters.search);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/tours?${queryString}` : '/tours';
    
    const response = await api.get(url);
    return response.data;
  },

  // Получить популярные туры
  getFeaturedTours: async () => {
    const response = await api.get('/tours/featured');
    return response.data;
  },

  // Получить тур по ID
  getTourById: async (id) => {
    const response = await api.get(`/tours/${id}`);
    return response.data;
  }
};