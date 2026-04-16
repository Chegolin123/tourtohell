import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { contactService } from '../services/contactService';

const ContactsPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tourId: '',
    participants: 1,
    date: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tourList, setTourList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Автоматически заполняем данные пользователя, если он авторизован
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  // Загружаем список туров
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tours');
        const data = await response.json();
        setTourList(data);
      } catch (error) {
        console.error('Error fetching tours:', error);
        toast.error('Не удалось загрузить список туров');
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  // Получаем сегодняшнюю дату
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Валидация email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Валидация телефона
  const validatePhone = (phone) => {
    const digits = phone.replace(/\D/g, '');
    
    if (digits.length === 11) {
      return digits.startsWith('7') || digits.startsWith('8') || digits.startsWith('9');
    } else if (digits.length === 10) {
      return true;
    }
    return false;
  };

  // Форматирование телефона
  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 1) {
      return digits;
    } else if (digits.length <= 4) {
      return `+7 (${digits.slice(1, 4)}`;
    } else if (digits.length <= 7) {
      return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}`;
    } else if (digits.length <= 9) {
      return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}`;
    } else {
      return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      if (value === '') {
        setFormData({
          ...formData,
          [name]: ''
        });
        return;
      }
      
      const formattedPhone = formatPhoneNumber(value);
      setFormData({
        ...formData,
        [name]: formattedPhone
      });
      
      if (errors.phone) {
        setErrors({
          ...errors,
          phone: null
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
      
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: null
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const today = getTodayDate();

    if (!formData.name.trim()) {
      newErrors.name = 'Введите имя и фамилию';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Имя должно содержать минимум 3 символа';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Введите корректный номер телефона (например: +7 999 123-45-67)';
    }

    if (!formData.tourId) {
      newErrors.tourId = 'Выберите тур';
    }

    if (!formData.participants || formData.participants < 1) {
      newErrors.participants = 'Количество участников должно быть не менее 1';
    } else if (formData.participants > 10) {
      newErrors.participants = 'Максимальное количество участников - 10';
    }

    if (!formData.date) {
      newErrors.date = 'Выберите желаемую дату';
    } else if (formData.date < today) {
      newErrors.date = 'Дата не может быть в прошлом';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Пожалуйста, исправьте ошибки в форме');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const contactData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        tourId: formData.tourId,
        participants: parseInt(formData.participants),
        date: formData.date,
        message: formData.message?.trim() || null,
        userId: user?.id
      };
      
      console.log('Submitting contact:', contactData);
      
      const response = await contactService.createContact(contactData);
      
      if (response.success) {
        toast.success(response.message, {
          icon: '🔥',
          duration: 5000
        });
        
        // Очищаем форму, но оставляем данные пользователя если он авторизован
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          tourId: '',
          participants: 1,
          date: '',
          message: ''
        });
        setErrors({});
      } else {
        toast.error(response.message || 'Ошибка при отправке');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Ошибка при отправке. Проверьте подключение к серверу.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black text-white">
      {/* Hero секция */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600 rounded-full filter blur-3xl animate-pulse animation-delay-1000"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="text-8xl mb-6 animate-bounce">👹</div>
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                СВЯЖИСЬ С АДОМ
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Наши демоны всегда готовы ответить на твои вопросы и помочь выбрать идеальное чистилище
            </p>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="black"/>
          </svg>
        </div>
      </section>

      {/* Контактная информация - карточки по центру */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Адрес */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0 }}
              viewport={{ once: true }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 hover:border-red-500/50 transition-all group flex flex-col items-center text-center"
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                📍
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Адрес штаб-квартиры</h3>
              <div className="space-y-2 text-gray-300">
                <p>г. Москва, ул. Тверская, 15</p>
                <p>БЦ "Тверская Plaza", офис 666</p>
                <p>Вход через адскую приемную</p>
              </div>
            </motion.div>

            {/* Телефоны */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 hover:border-red-500/50 transition-all group flex flex-col items-center text-center"
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                📞
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Телефоны</h3>
              <div className="space-y-2 text-gray-300">
                <p>+7 (999) 666-55-44</p>
                <p>+7 (495) 123-45-67</p>
                <p className="text-sm text-gray-400 mt-2">Круглосуточно, без выходных</p>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 hover:border-red-500/50 transition-all group flex flex-col items-center text-center"
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                ✉️
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Email</h3>
              <div className="space-y-2 text-gray-300">
                <p>info@tourtohell.ru</p>
                <p>contact@tourtohell.ru</p>
                <p>help@tourtohell.ru</p>
              </div>
            </motion.div>

            {/* Режим работы */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 hover:border-red-500/50 transition-all group flex flex-col items-center text-center"
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                ⏰
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Режим работы</h3>
              <div className="space-y-2 text-gray-300">
                <p>Пн-Пт: 10:00 - 22:00</p>
                <p>Сб: 12:00 - 20:00</p>
                <p className="text-red-400 font-medium mt-2">Вс: прием душ по записи</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Форма обратной связи */}
      <section className="py-16 bg-black/50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Форма */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20"
            >
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                НАПИШИ НАМ
              </h2>
              <p className="text-gray-400 mb-8">
                Заполни форму, и наш демон свяжется с тобой для консультации
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Имя и Фамилия <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-800 border ${
                        errors.name ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                      placeholder="Иван Грозный"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-800 border ${
                        errors.email ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                      placeholder="ivan@hell.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Телефон <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-800 border ${
                        errors.phone ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                      placeholder="+7 (999) 666-55-44"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Интересующий тур <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="tourId"
                      value={formData.tourId}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-800 border ${
                        errors.tourId ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                    >
                      <option value="">-- Выберите тур --</option>
                      {tourList.map((tour) => (
                        <option key={tour.id} value={tour.id}>
                          🔥 {tour.title} - {tour.duration} - {tour.price.toLocaleString()} ₽
                        </option>
                      ))}
                    </select>
                    {errors.tourId && (
                      <p className="text-red-500 text-sm mt-1">{errors.tourId}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Количество участников <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="participants"
                      value={formData.participants}
                      onChange={handleChange}
                      min="1"
                      max="10"
                      className={`w-full px-4 py-3 bg-gray-800 border ${
                        errors.participants ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                    />
                    {errors.participants && (
                      <p className="text-red-500 text-sm mt-1">{errors.participants}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Желаемая дата <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={getTodayDate()}
                      className={`w-full px-4 py-3 bg-gray-800 border ${
                        errors.date ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Сообщение
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Напиши свои вопросы или пожелания..."
                  ></textarea>
                </div>

                {!user && (
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-300">
                    <p>💡 Авторизуйтесь, чтобы форма автоматически заполнялась вашими данными</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="w-full px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'ОТПРАВКА...' : 'ОТПРАВИТЬ СООБЩЕНИЕ'}
                </button>
              </form>
            </motion.div>

            {/* Яндекс Карта и соцсети */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Яндекс Карта */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
                <h3 className="text-2xl font-bold mb-4 text-white">МЫ ЗДЕСЬ</h3>
                <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  <iframe
                    src="https://yandex.ru/map-widget/v1/?ll=37.613281%2C55.758611&z=17&pt=37.613281%2C55.758611%2Cpm2rdl&l=map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    title="Яндекс Карта - Офис Tour to Hell"
                    className="w-full h-full"
                  ></iframe>
                </div>
                <div className="mt-4 space-y-3">
                  <p className="text-gray-300 flex items-center gap-2">
                    <span className="text-red-500">📍</span>
                    <span>г. Москва, ул. Тверская, д. 15, офис 666</span>
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-3">
                    <a 
                      href="https://yandex.ru/maps/?pt=37.613281,55.758611&z=17&l=map"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-white transition-colors"
                    >
                      <span>🗺️</span>
                      <span>Открыть карту</span>
                    </a>
                    <a 
                      href="https://yandex.ru/maps/?rtext=~55.758611,37.613281&rtt=mt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-white transition-colors"
                    >
                      <span>🚗</span>
                      <span>Маршрут</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Социальные сети */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
                <h3 className="text-2xl font-bold mb-4 text-white">МЫ В СОЦСЕТЯХ</h3>
                <p className="text-gray-400 mb-6">
                  Подпишись, чтобы видеть самые горячие предложения
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <a href="#" className="group flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-red-600 transition-colors">
                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📘</span>
                    <span className="text-sm">VK</span>
                  </a>
                  <a href="#" className="group flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-red-600 transition-colors">
                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📷</span>
                    <span className="text-sm">Instagram</span>
                  </a>
                  <a href="#" className="group flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-red-600 transition-colors">
                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎥</span>
                    <span className="text-sm">TikTok</span>
                  </a>
                  <a href="#" className="group flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-red-600 transition-colors">
                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">💬</span>
                    <span className="text-sm">Telegram</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Призыв к действию */}
      <section className="py-20 bg-gradient-to-br from-red-900/50 to-orange-900/50">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                ГОТОВ К ПРИКЛЮЧЕНИЮ?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Не откладывай свое путешествие в ад. Забронируй тур прямо сейчас!
            </p>
            <a href="/tours" className="inline-block px-8 py-4 bg-white text-red-600 rounded-lg font-bold text-lg hover:scale-105 transition-transform">
              ВЫБРАТЬ ТУР
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactsPage;