const express = require('express');
const router = express.Router();
const { Contact } = require('../models');

// @route   POST /api/contacts
// @desc    Create a new contact request
router.post('/', async (req, res) => {
  try {
    console.log('📝 Received contact request:', req.body);
    
    const { name, email, phone } = req.body;
    
    if (!name || !email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Пожалуйста, заполните все обязательные поля' 
      });
    }
    
    const contact = await Contact.create(req.body);
    
    console.log('✅ Contact created:', contact);
    
    res.status(201).json({ 
      success: true, 
      message: 'Сообщение успешно отправлено! Демон свяжется с вами в ближайшее время.',
      contact 
    });
  } catch (error) {
    console.error('❌ Error creating contact:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка при отправке сообщения',
      error: error.message 
    });
  }
});

// @route   GET /api/contacts
// @desc    Get all contact requests (admin only)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/contacts/email/:email
// @desc    Get contacts by email
router.get('/email/:email', async (req, res) => {
  try {
    const contacts = await Contact.findByEmail(req.params.email);
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts by email:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/contacts/:id/status
// @desc    Update contact status (admin only)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.updateStatus(req.params.id, status);
    res.json({ success: true, contact });
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;