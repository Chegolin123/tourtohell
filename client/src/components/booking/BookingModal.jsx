import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { bookingService } from '../../services/bookingService';
import { toast } from 'react-hot-toast';

const BookingModal = ({ isOpen, onClose, tour }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    participants: 1,
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'card',
    specialRequests: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Заполняем данные пользователя если авторизован
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
      const formattedPhone = formatPhoneNumber(value);
      setFormData({
        ...formData,
        [name]: formattedPhone
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Очищаем ошибку поля
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    const today = getTodayDate();

    if (!formData.date) {
      newErrors.date = 'Выберите дату начала тура';
    } else if (formData.date < today) {
      newErrors.date = 'Дата не может быть в прошлом';
    }

    if (!formData.participants || formData.participants < 1) {
      newErrors.participants = 'Укажите количество участников';
    } else if (formData.participants > (tour?.maxGroupSize || 10)) {
      newErrors.participants = `Максимум ${tour?.maxGroupSize || 10} участников`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Введите имя и фамилию';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Введите корректный номер телефона';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (step !== 3) return;

    setLoading(true);
    try {
      const bookingData = {
        tourId: tour.id,
        tourName: tour.title,
        startDate: formData.date,
        participants: formData.participants,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        paymentMethod: formData.paymentMethod,
        specialRequests: formData.specialRequests || null,
        totalPrice: tour.price * formData.participants,
        userId: user?.id || null
      };

      const response = await bookingService.createBooking(bookingData);
      
      if (response.success) {
        toast.success('Бронирование успешно создано!', {
          icon: '🔥',
          duration: 5000
        });
        onClose();
        // Сбрасываем форму
        setStep(1);
        setFormData({
          date: '',
          participants: 1,
          name: '',
          email: '',
          phone: '',
          paymentMethod: 'card',
          specialRequests: ''
        });
      } else {
        toast.error(response.message || 'Ошибка при бронировании');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Ошибка при создании бронирования');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = tour ? tour.price * formData.participants : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Затемнение фона */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Модальное окно */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-gradient-to-b from-gray-900 to-black border-2 border-red-500/30 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Кнопка закрытия */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-2xl"
            >
              ✕
            </button>

            {/* Заголовок */}
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🔥</div>
              <h2 className="text-3xl font-bold mb-2">Бронирование тура</h2>
              <p className="text-gray-400">{tour?.title}</p>
            </div>

            {/* Прогресс шагов */}
            <div className="flex justify-between mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    s <= step ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      s < step ? 'bg-red-600' : 'bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Шаг 1: Выбор даты и участников */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold mb-4">Шаг 1: Выберите дату и количество участников</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Дата начала <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={getTodayDate()}
                    className={`w-full px-4 py-3 bg-gray-800 border ${
                      errors.date ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500`}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Количество участников <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        participants: Math.max(1, formData.participants - 1)
                      })}
                      className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      name="participants"
                      value={formData.participants}
                      onChange={handleChange}
                      min="1"
                      max={tour?.maxGroupSize || 10}
                      className="w-20 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        participants: Math.min(tour?.maxGroupSize || 10, formData.participants + 1)
                      })}
                      className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  {errors.participants && (
                    <p className="text-red-500 text-sm mt-1">{errors.participants}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Стоимость за человека: {tour?.price.toLocaleString()} ₽
                  </p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Предварительная стоимость:</span>
                    <span className="text-2xl font-bold text-red-500">
                      {totalPrice.toLocaleString()} ₽
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Шаг 2: Контактные данные */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold mb-4">Шаг 2: Ваши контактные данные</h3>
                
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
                    } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500`}
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
                    } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500`}
                    placeholder="ivan@hell.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

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
                    } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500`}
                    placeholder="+7 (999) 666-55-44"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {!user && (
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-300">
                    💡 Рекомендуем <button className="text-blue-400 underline">войти</button> - тогда данные заполнятся автоматически
                  </div>
                )}
              </div>
            )}

            {/* Шаг 3: Оплата и подтверждение */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold mb-4">Шаг 3: Способ оплаты и подтверждение</h3>
                
                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                  <h4 className="font-bold mb-3">Детали бронирования:</h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-400">Тур:</span>
                      <span className="text-white">{tour?.title}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-400">Дата:</span>
                      <span className="text-white">{new Date(formData.date).toLocaleDateString('ru-RU')}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-400">Участников:</span>
                      <span className="text-white">{formData.participants}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-400">Имя:</span>
                      <span className="text-white">{formData.name}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white">{formData.email}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-400">Телефон:</span>
                      <span className="text-white">{formData.phone}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    Выберите способ оплаты <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === 'card' 
                        ? 'border-red-500 bg-red-500/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <span className="text-3xl mb-2">💳</span>
                      <span className="font-medium">Картой</span>
                      <span className="text-xs text-gray-400 mt-1">Онлайн</span>
                    </label>

                    <label className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === 'cash' 
                        ? 'border-red-500 bg-red-500/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <span className="text-3xl mb-2">💵</span>
                      <span className="font-medium">Наличными</span>
                      <span className="text-xs text-gray-400 mt-1">При встрече</span>
                    </label>

                    <label className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === 'transfer' 
                        ? 'border-red-500 bg-red-500/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="transfer"
                        checked={formData.paymentMethod === 'transfer'}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <span className="text-3xl mb-2">🏦</span>
                      <span className="font-medium">Перевод</span>
                      <span className="text-xs text-gray-400 mt-1">На счет</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Дополнительные пожелания
                  </label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Особые пожелания, диета, специальные условия..."
                  />
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-400">Итого к оплате:</span>
                    <span className="text-3xl font-bold text-red-500">
                      {totalPrice.toLocaleString()} ₽
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Кнопки навигации */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  ← Назад
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-medium hover:scale-105 transition-transform ml-auto"
                >
                  Далее →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-bold hover:scale-105 transition-transform ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Обработка...' : 'Подтвердить бронирование'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;