import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { reviewService } from '../../services/reviewService';
import { tourService } from '../../services/tourService';
import { toast } from 'react-hot-toast';

const ReviewModal = ({ isOpen, onClose, tour }) => {
  const { user } = useAuth();
  const [tours, setTours] = useState([]);
  const [loadingTours, setLoadingTours] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    tourId: tour?.id || '',
    tourName: tour?.title || ''
  });
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Загрузка списка туров при открытии модалки
  useEffect(() => {
    if (isOpen && !tour) {
      loadTours();
    }
  }, [isOpen, tour]);

  // Сброс формы при открытии
  useEffect(() => {
    if (isOpen) {
      setFormData({
        rating: 5,
        comment: '',
        tourId: tour?.id || '',
        tourName: tour?.title || ''
      });
    }
  }, [isOpen, tour]);

  const loadTours = async () => {
    setLoadingTours(true);
    try {
      const data = await tourService.getTours();
      setTours(data);
    } catch (error) {
      console.error('Error loading tours:', error);
      toast.error('Не удалось загрузить список туров');
    } finally {
      setLoadingTours(false);
    }
  };

  const handleTourChange = (e) => {
    const selectedTourId = e.target.value;
    const selectedTour = tours.find(t => t.id === parseInt(selectedTourId));
    setFormData({
      ...formData,
      tourId: selectedTourId,
      tourName: selectedTour?.title || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Необходимо войти в систему');
      return;
    }

    if (!formData.comment.trim()) {
      toast.error('Напишите текст отзыва');
      return;
    }

    if (!formData.tourId && !tour) {
      toast.error('Выберите тур');
      return;
    }

    setLoading(true);

    try {
      const reviewData = {
        user_name: user.name,
        user_id: user.id,
        avatar: '👤',
        rating: formData.rating,
        tour_id: formData.tourId || tour?.id || null,
        tour_name: formData.tourName || tour?.title || null,
        comment: formData.comment.trim(),
        location: user.city || 'Неизвестно'
      };

      const response = await reviewService.createReview(reviewData);
      
      if (response) {
        toast.success('Отзыв отправлен на модерацию!', {
          icon: '✅',
          duration: 5000
        });
        onClose();
      }
    } catch (error) {
      console.error('Error creating review:', error);
      toast.error('Ошибка при отправке отзыва');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

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
            className="relative bg-gradient-to-b from-gray-900 to-black border-2 border-red-500/30 rounded-2xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Кнопка закрытия */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-2xl"
            >
              ✕
            </button>

            {/* Заголовок */}
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">📝</div>
              <h2 className="text-2xl font-bold mb-2">Написать отзыв</h2>
              {tour && (
                <p className="text-gray-400">
                  о туре <span className="text-red-400">{tour.title}</span>
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Выбор тура (если не передан конкретный тур) */}
              {!tour && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Выберите тур <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.tourId}
                    onChange={handleTourChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">-- Выберите тур --</option>
                    {loadingTours ? (
                      <option disabled>Загрузка...</option>
                    ) : (
                      tours.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title} - {t.location}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              )}

              {/* Рейтинг */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Ваша оценка
                </label>
                <div className="flex justify-center gap-2 text-3xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <span className={
                        star <= (hoverRating || formData.rating)
                          ? 'text-yellow-500'
                          : 'text-gray-600'
                      }>
                        ★
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                  {formData.rating === 1 && 'Ужасно'}
                  {formData.rating === 2 && 'Плохо'}
                  {formData.rating === 3 && 'Нормально'}
                  {formData.rating === 4 && 'Хорошо'}
                  {formData.rating === 5 && 'Отлично!'}
                </p>
              </div>

              {/* Текст отзыва */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Ваш отзыв
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Поделитесь своими впечатлениями..."
                  rows="5"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Информация о модерации */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-sm text-yellow-400">
                <p className="flex items-center gap-2 mb-1">
                  <span>📝</span> Отзыв будет отправлен на модерацию
                </p>
                <p className="flex items-center gap-2">
                  <span>⏳</span> После проверки администратором он появится на сайте
                </p>
              </div>

              {/* Кнопки */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-medium hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {loading ? 'Отправка...' : 'Отправить'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReviewModal;