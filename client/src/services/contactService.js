import api from './api';

export const contactService = {
  // Создать обращение
  createContact: async (contactData) => {
    try {
      console.log('Sending contact data:', contactData);
      const response = await api.post('/contacts', contactData);
      console.log('Contact response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in createContact:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить все обращения (для админа)
  getAllContacts: async () => {
    try {
      const response = await api.get('/contacts');
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },

  // Получить обращения по email
  getContactsByEmail: async (email) => {
    try {
      const response = await api.get(`/contacts/email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts by email:', error);
      throw error;
    }
  }
};