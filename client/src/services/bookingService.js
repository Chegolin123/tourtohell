import api from './api';

export const bookingService = {
  // Создать бронирование
  createBooking: async (bookingData) => {
    try {
      console.log('Creating booking:', bookingData);
      const response = await api.post('/bookings', {
        tourId: bookingData.tourId,
        tourName: bookingData.tourName,
        startDate: bookingData.startDate,
        participants: bookingData.participants,
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        paymentMethod: bookingData.paymentMethod,
        specialRequests: bookingData.specialRequests,
        totalPrice: bookingData.totalPrice,
        userId: bookingData.userId
      });
      return response.data;
    } catch (error) {
      console.error('Error in createBooking:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить все бронирования (для админа)
  getAllBookings: async () => {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Получить бронирования пользователя по ID
  getUserBookings: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/bookings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }
};