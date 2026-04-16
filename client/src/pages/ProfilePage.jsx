import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { bookingService } from '../services/bookingService';
import { reviewService } from '../services/reviewService';
import { userService } from '../services/userService';
import Loader from '../components/common/Loader';
import { toast } from 'react-hot-toast';
import ReviewModal from '../components/reviews/ReviewModal';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });
  const [editErrors, setEditErrors] = useState({});

  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState({
    bookings: false,
    reviews: false
  });
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    upcomingBookings: 0,
    totalReviews: 0,
    averageRating: 0,
    memberSince: ''
  });

  useEffect(() => {
    if (user) {
      setStats(prev => ({
        ...prev,
        memberSince: new Date(user.created_at || Date.now()).toLocaleDateString('ru-RU', {
          month: 'long',
          year: 'numeric'
        })
      }));
    }
  }, [user]);

  const loadUserData = useCallback(async () => {
    try {
      const [bookingsData, reviewsData] = await Promise.all([
        bookingService.getUserBookings(user?.id),
        reviewService.getUserReviews(user?.id)
      ]);

      setBookings(bookingsData || []);
      setReviews(reviewsData || []);

      // Подсчет статистики
      const now = new Date();
      const upcoming = (bookingsData || []).filter(b => 
        new Date(b.preferred_date) > now && b.status !== 'cancelled'
      ).length;
      const completed = (bookingsData || []).filter(b => 
        b.status === 'completed'
      ).length;

      const totalRating = (reviewsData || []).reduce((sum, r) => sum + r.rating, 0);
      const avgRating = reviewsData?.length ? (totalRating / reviewsData.length).toFixed(1) : 0;

      setStats(prev => ({
        ...prev,
        totalBookings: bookingsData?.length || 0,
        completedBookings: completed,
        upcomingBookings: upcoming,
        totalReviews: reviewsData?.length || 0,
        averageRating: avgRating
      }));

    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Ошибка при загрузке данных');
    }
  }, [user]);

  const loadBookings = useCallback(async () => {
    setLoading(prev => ({ ...prev, bookings: true }));
    try {
      const data = await bookingService.getUserBookings(user?.id);
      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Не удалось загрузить бронирования');
    } finally {
      setLoading(prev => ({ ...prev, bookings: false }));
    }
  }, [user]);

  const loadReviews = useCallback(async () => {
    setLoading(prev => ({ ...prev, reviews: true }));
    try {
      const data = await reviewService.getUserReviews(user?.id);
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Не удалось загрузить отзывы');
    } finally {
      setLoading(prev => ({ ...prev, reviews: false }));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user, loadUserData]);

  useEffect(() => {
    if (activeTab === 'bookings') {
      loadBookings();
    } else if (activeTab === 'reviews') {
      loadReviews();
    }
  }, [activeTab, loadBookings, loadReviews]);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const validateEditForm = () => {
    const errors = {};
    if (!editForm.name.trim()) {
      errors.name = 'Имя обязательно';
    }
    if (!editForm.email.trim()) {
      errors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      errors.email = 'Некорректный email';
    }
    if (editForm.phone && !/^[\d\s\-+()]+$/.test(editForm.phone)) {
      errors.phone = 'Некорректный телефон';
    }
    return errors;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const errors = validateEditForm();
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    try {
      const updatedUser = await userService.updateProfile(editForm);
      updateUser(updatedUser);
      setIsEditing(false);
      setEditErrors({});
      toast.success('Профиль успешно обновлен');
    } catch (error) {
      toast.error('Ошибка при обновлении профиля');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Вы уверены, что хотите отменить бронирование?')) return;

    try {
      await bookingService.cancelBooking(bookingId);
      toast.success('Бронирование отменено');
      loadBookings();
    } catch (error) {
      toast.error('Ошибка при отмене бронирования');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'confirmed': return 'Подтверждено';
      case 'pending': return 'Ожидает';
      case 'cancelled': return 'Отменено';
      case 'completed': return 'Завершено';
      default: return status;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-center bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl max-w-md border border-red-500/30">
          <div className="text-6xl mb-4">👹</div>
          <h2 className="text-2xl font-bold text-white mb-2">Не авторизован</h2>
          <p className="text-gray-400 mb-4">Войдите в аккаунт, чтобы просмотреть профиль</p>
          <Link to="/login" className="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg text-white font-bold hover:scale-105 transition-transform">
            Войти
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black text-white">
      {/* Модальное окно для отзыва */}
      <ReviewModal 
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        tour={null}
      />

      {/* Hero секция профиля */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600 rounded-full filter blur-3xl animate-pulse animation-delay-1000"></div>
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Аватар */}
              <div className="relative group">
                <div className="w-32 h-32 bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl flex items-center justify-center text-6xl transform group-hover:rotate-12 transition-transform shadow-2xl">
                  {user.avatar || '👤'}
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border-2 border-red-500 hover:bg-gray-700 transition-colors">
                  📷
                </button>
              </div>

              {/* Информация о пользователе */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{user.name}</h1>
                <p className="text-gray-400 mb-4 flex items-center justify-center md:justify-start gap-2 flex-wrap">
                  <span>📧</span> {user.email}
                  {user.phone && (
                    <>
                      <span className="mx-2">•</span>
                      <span>📞</span> {user.phone}
                    </>
                  )}
                </p>
                
                {/* Статистика */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-red-500">{stats.totalBookings}</div>
                    <div className="text-xs text-gray-400">Всего бронирований</div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-500">{stats.completedBookings}</div>
                    <div className="text-xs text-gray-400">Завершено</div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-500">{stats.upcomingBookings}</div>
                    <div className="text-xs text-gray-400">Предстоит</div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-purple-500">{stats.totalReviews}</div>
                    <div className="text-xs text-gray-400">Отзывов</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Табы навигации */}
      <div className="container-custom">
        <div className="flex flex-wrap gap-2 mb-8 border-b border-red-500/20 pb-2">
          <button
            onClick={() => handleTabChange('profile')}
            className={`px-6 py-3 rounded-t-lg font-medium transition-all ${
              activeTab === 'profile' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            👤 Профиль
          </button>
          <button
            onClick={() => handleTabChange('bookings')}
            className={`px-6 py-3 rounded-t-lg font-medium transition-all ${
              activeTab === 'bookings' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            🎒 Бронирования {bookings.length > 0 && `(${bookings.length})`}
          </button>
          <button
            onClick={() => handleTabChange('reviews')}
            className={`px-6 py-3 rounded-t-lg font-medium transition-all ${
              activeTab === 'reviews' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            📝 Отзывы {reviews.length > 0 && `(${reviews.length})`}
          </button>
          <button
            onClick={() => handleTabChange('settings')}
            className={`px-6 py-3 rounded-t-lg font-medium transition-all ${
              activeTab === 'settings' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            ⚙️ Настройки
          </button>
        </div>

        {/* Контент табов */}
        <div className="py-8">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Личная информация</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-sm transition-colors"
                    >
                      ✏️ Редактировать
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Имя</p>
                        <p className="text-lg font-medium">{user.name}</p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Email</p>
                        <p className="text-lg font-medium">{user.email}</p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Телефон</p>
                        <p className="text-lg font-medium">{user.phone || 'Не указан'}</p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Участник с</p>
                        <p className="text-lg font-medium">{stats.memberSince}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Имя *
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className={`w-full px-4 py-3 bg-gray-800 border ${
                          editErrors.name ? 'border-red-500' : 'border-gray-700'
                        } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500`}
                      />
                      {editErrors.name && (
                        <p className="text-red-500 text-sm mt-1">{editErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className={`w-full px-4 py-3 bg-gray-800 border ${
                          editErrors.email ? 'border-red-500' : 'border-gray-700'
                        } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500`}
                      />
                      {editErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{editErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Телефон
                      </label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        className={`w-full px-4 py-3 bg-gray-800 border ${
                          editErrors.phone ? 'border-red-500' : 'border-gray-700'
                        } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500`}
                        placeholder="+7 (999) 123-45-67"
                      />
                      {editErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">{editErrors.phone}</p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-bold hover:scale-105 transition-transform"
                      >
                        Сохранить
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({
                            name: user.name,
                            phone: user.phone || '',
                            email: user.email
                          });
                          setEditErrors({});
                        }}
                        className="flex-1 px-6 py-3 bg-gray-700 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'bookings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold mb-6">Мои бронирования</h2>
              
              {loading.bookings ? (
                <Loader />
              ) : bookings.length === 0 ? (
                <div className="text-center bg-gray-900/50 backdrop-blur-sm rounded-2xl p-12 border border-red-500/20">
                  <div className="text-6xl mb-4">🏕️</div>
                  <h3 className="text-2xl font-bold mb-2">У вас пока нет бронирований</h3>
                  <p className="text-gray-400 mb-6">Отправляйтесь в свое первое приключение!</p>
                  <Link to="/tours" className="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg text-white font-bold hover:scale-105 transition-transform">
                    Выбрать тур
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {bookings.map((booking) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 hover:border-red-500/50 transition-all"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Изображение тура */}
                        <div className="md:w-48 h-32 rounded-lg overflow-hidden">
                          <img
                            src={booking.tour_image || '/assets/images/hero/hero-bg.jpg'}
                            alt={booking.tour_title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Информация о бронировании */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                            <h3 className="text-xl font-bold">{booking.tour_title}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                              {getStatusText(booking.status)}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-400">Дата начала</p>
                              <p className="font-medium">{new Date(booking.preferred_date).toLocaleDateString('ru-RU')}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Участников</p>
                              <p className="font-medium">{booking.participants}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Стоимость</p>
                              <p className="font-medium text-red-500">{booking.total_price?.toLocaleString()} ₽</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Оплата</p>
                              <p className="font-medium">{booking.payment_method === 'card' ? 'Карта' : 'Наличные'}</p>
                            </div>
                          </div>

                          {booking.special_requests && (
                            <p className="text-sm text-gray-400 mb-4">
                              <span className="text-gray-500">Пожелания:</span> {booking.special_requests}
                            </p>
                          )}

                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-sm transition-colors"
                            >
                              Отменить бронирование
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Мои отзывы</h2>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg text-white font-medium hover:scale-105 transition-transform"
                >
                  ✍️ Написать отзыв
                </button>
              </div>
              
              {loading.reviews ? (
                <Loader />
              ) : reviews.length === 0 ? (
                <div className="text-center bg-gray-900/50 backdrop-blur-sm rounded-2xl p-12 border border-red-500/20">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-2xl font-bold mb-2">У вас пока нет отзывов</h3>
                  <p className="text-gray-400 mb-6">Поделитесь своими впечатлениями о путешествиях!</p>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg text-white font-bold hover:scale-105 transition-transform"
                  >
                    Написать отзыв
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 hover:border-red-500/50 transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <Link to={`/tours/${review.tour_id}`} className="text-lg font-bold hover:text-red-500 transition-colors">
                            {review.tour_name || 'Тур'}
                          </Link>
                          <p className="text-sm text-gray-400">
                            {new Date(review.created_at).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-yellow-500">
                            {'★'.repeat(review.rating)}
                            {'☆'.repeat(5 - review.rating)}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            review.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                            review.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {review.status === 'approved' && 'Одобрен'}
                            {review.status === 'pending' && 'На модерации'}
                            {review.status === 'rejected' && 'Отклонен'}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-300">{review.comment}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20">
                <h2 className="text-2xl font-bold mb-6">Настройки</h2>
                
                {/* Смена пароля */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Смена пароля</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Текущий пароль
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Новый пароль
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Подтверждение пароля
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="••••••••"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-bold hover:scale-105 transition-transform"
                    >
                      Изменить пароль
                    </button>
                  </form>
                </div>

                {/* Уведомления */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Уведомления</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 accent-red-500" defaultChecked />
                      <span>Email-уведомления о новых турах</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 accent-red-500" defaultChecked />
                      <span>SMS-уведомления о статусе бронирования</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 accent-red-500" />
                      <span>Рассылка спецпредложений</span>
                    </label>
                  </div>
                </div>

                {/* Опасная зона */}
                <div>
                  <h3 className="text-xl font-bold mb-4 text-red-500">Опасная зона</h3>
                  <button
                    className="px-6 py-3 bg-red-600/20 border-2 border-red-500/50 rounded-lg font-bold hover:bg-red-600/30 transition-colors"
                  >
                    Удалить аккаунт
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;