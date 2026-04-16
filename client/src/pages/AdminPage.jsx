import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { adminService } from '../services/adminService';
import Loader from '../components/common/Loader';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ToursManager from '../components/admin/ToursManager';
import BookingsManager from '../components/admin/BookingsManager';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [tours, setTours] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Проверка прав администратора
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Доступ запрещен');
      navigate('/');
    }
  }, [user, navigate]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const statsData = await adminService.getAdvancedStats();
        console.log('Dashboard stats:', statsData);
        setStats(statsData);
      } else if (activeTab === 'tours') {
        const toursData = await adminService.getAllTours();
        setTours(toursData);
      } else if (activeTab === 'reviews') {
        const reviewsData = await adminService.getAllReviews();
        setReviews(reviewsData);
      } else if (activeTab === 'bookings') {
        const bookingsData = await adminService.getAllBookings();
        setBookings(bookingsData);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  // Загрузка данных
  useEffect(() => {
    if (user?.role === 'admin') {
      loadData();
    }
  }, [user, activeTab, loadData]);

  const handleReviewStatus = async (reviewId, status) => {
    try {
      await adminService.updateReviewStatus(reviewId, status);
      toast.success(`Отзыв ${status === 'approved' ? 'одобрен' : status === 'rejected' ? 'отклонен' : 'возвращен на модерацию'}`);
      loadData();
    } catch (error) {
      toast.error('Ошибка при обновлении статуса');
    }
  };

  const handleBookingStatus = async (bookingId, status) => {
    try {
      await adminService.updateBookingStatus(bookingId, status);
      toast.success('Статус заявки обновлен');
      loadData();
    } catch (error) {
      toast.error('Ошибка при обновлении статуса');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту заявку?')) return;
    try {
      await adminService.deleteBooking(bookingId);
      toast.success('Заявка удалена');
      loadData();
    } catch (error) {
      toast.error('Ошибка при удалении заявки');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container-custom py-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-black mb-8"
        >
          <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            АДМИН-ПАНЕЛЬ
          </span>
        </motion.h1>

        {/* Навигация */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-red-500/20 pb-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            📊 Дашборд
          </button>
          <button
            onClick={() => setActiveTab('tours')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'tours' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            🗺️ Управление турами
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'bookings' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            📋 Заявки
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'reviews' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            📝 Модерация отзывов
          </button>
        </div>

        {/* Контент */}
        {activeTab === 'dashboard' && stats && (
          <Dashboard stats={stats} />
        )}

        {activeTab === 'tours' && (
          <ToursManager 
            tours={tours} 
            onRefresh={loadData}
          />
        )}

        {activeTab === 'bookings' && (
          <BookingsManager 
            bookings={bookings} 
            onUpdateStatus={handleBookingStatus}
            onDelete={handleDeleteBooking}
          />
        )}

        {activeTab === 'reviews' && (
          <ReviewsModeration 
            reviews={reviews} 
            onUpdateStatus={handleReviewStatus}
          />
        )}
      </div>
    </div>
  );
};

// Компонент дашборда с графиками
const Dashboard = ({ stats }) => {
  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

  // Функция для форматирования чисел с разделителями тысяч
  const formatCurrency = (value) => {
    if (!value && value !== 0) return '0';
    const num = Number(value);
    if (isNaN(num)) return '0';
    return num.toLocaleString('ru-RU');
  };

  // Функция для форматирования процентов
  const formatPercentage = (value) => {
    if (!value && value !== 0) return '0';
    const num = Number(value);
    if (isNaN(num)) return '0';
    return num.toFixed(1);
  };

  // Проверяем наличие данных
  if (!stats) {
    return (
      <div className="text-center py-12 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-red-500/20">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-medium text-gray-400">Нет данных для отображения</h3>
        <p className="text-gray-500 mt-2">Добавьте тестовые данные в базу</p>
      </div>
    );
  }

  // Преобразуем данные для графика
  const dailyData = stats.dailyBookings?.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
    count: Number(item.count) || 0,
    confirmed: Number(item.confirmed) || 0,
    revenue: Number(item.revenue) || 0
  })) || [];

  const popularToursData = stats.popularTours?.map(item => ({
    ...item,
    title: item.title?.length > 25 ? item.title.substring(0, 25) + '...' : item.title || 'Без названия',
    bookings_count: Number(item.bookings_count) || 0,
    total_revenue: Number(item.total_revenue) || 0
  })) || [];

  // Данные для круговой диаграммы (только туры с выручкой)
  const revenueData = popularToursData.filter(tour => tour.total_revenue > 0);
  const totalRevenue = revenueData.reduce((sum, tour) => sum + tour.total_revenue, 0);

  return (
    <div className="space-y-8">
      {/* North Star Metric */}
      <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-2xl p-8 border-2 border-red-500/30">
        <h2 className="text-2xl font-bold mb-4">⭐ Полярная звезда (North Star Metric)</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-red-500">{stats.northStar?.total_confirmed || 0}</div>
            <div className="text-sm text-gray-400">Всего подтверждено</div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-500">{stats.northStar?.today || 0}</div>
            <div className="text-sm text-gray-400">Сегодня</div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-yellow-500">{stats.northStar?.this_week || 0}</div>
            <div className="text-sm text-gray-400">На этой неделе</div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-500">{stats.northStar?.this_month || 0}</div>
            <div className="text-sm text-gray-400">В этом месяце</div>
          </div>
        </div>
      </div>

      {/* График заявок по дням */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
        <h2 className="text-xl font-bold mb-4">📈 Заявки по дням (последние 30 дней)</h2>
        {dailyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #ef4444' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value) => [value, '']}
              />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#ef4444" name="Всего заявок" />
              <Line type="monotone" dataKey="confirmed" stroke="#10b981" name="Подтверждено" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-8 text-gray-400">
            Нет данных о заявках за последние 30 дней
          </div>
        )}
      </div>

      {/* Популярные туры */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
        <h2 className="text-xl font-bold mb-4">🔥 Популярные туры</h2>
        {popularToursData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={popularToursData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="title" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #ef4444' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value) => [value, '']}
              />
              <Legend />
              <Bar dataKey="bookings_count" fill="#ef4444" name="Бронирований" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-8 text-gray-400">
            Нет данных о бронированиях
          </div>
        )}
      </div>

      {/* Конверсия и Выручка */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Конверсия - центрировано */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4 text-center">📊 Конверсия</h2>
          <div className="text-center">
            <div className="text-6xl font-bold text-green-500 mb-3">{formatPercentage(stats.conversion?.rate)}%</div>
            <p className="text-gray-400 text-lg">
              {stats.conversion?.bookings || 0} / {stats.conversion?.views || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">бронирований / просмотров</p>
          </div>
          {stats.conversion?.views === 0 && (
            <p className="text-sm text-yellow-500 mt-3 text-center">
              ⚠️ Нет данных о просмотрах
            </p>
          )}
        </div>

        {/* Выручка по турам */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
          <h2 className="text-xl font-bold mb-4 text-center">💰 Выручка по турам</h2>
          {revenueData.length > 0 ? (
            <>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-red-500">{formatCurrency(totalRevenue)} ₽</div>
                <p className="text-sm text-gray-400">Общая выручка</p>
              </div>
              
              {/* Круговая диаграмма */}
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={revenueData.slice(0, 5)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total_revenue"
                      nameKey="title"
                      label={false}
                    >
                      {revenueData.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #ef4444' }}
                      formatter={(value) => [`${formatCurrency(value)} ₽`, 'Выручка']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Легенда с процентами */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {revenueData.slice(0, 5).map((tour, index) => {
                  const percentage = totalRevenue > 0 ? ((tour.total_revenue / totalRevenue) * 100).toFixed(1) : 0;
                  
                  return (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-gray-300 truncate">{tour.title}</span>
                      <span className="text-red-500 font-medium ml-auto">{percentage}%</span>
                    </div>
                  );
                })}
              </div>

              {/* Таблица выручки */}
              <div className="mt-4 space-y-3 pt-4 border-t border-red-500/20">
                {revenueData.slice(0, 5).map((tour, index) => {
                  const percentage = totalRevenue > 0 ? ((tour.total_revenue / totalRevenue) * 100).toFixed(1) : 0;
                  
                  return (
                    <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-800/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-gray-300 font-medium">{tour.title}</span>
                      </div>
                      <div className="font-medium flex items-center gap-3">
                        <span className="text-red-500">{formatCurrency(tour.total_revenue)} ₽</span>
                        <span className="text-gray-400 text-xs bg-gray-700 px-2 py-1 rounded-full">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-lg mb-2">💸 Нет данных о выручке</p>
              <p className="text-sm">Добавьте подтвержденные бронирования с указанием суммы</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Компонент модерации отзывов с модальным окном для всех действий
const ReviewsModeration = ({ reviews, onUpdateStatus }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [actionType, setActionType] = useState(null);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return '🟡 Ожидает';
      case 'approved': return '✅ Одобрен';
      case 'rejected': return '❌ Отклонен';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Фильтрация отзывов
  const filteredReviews = reviews.filter(review => {
    if (filter !== 'all' && review.status !== filter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        review.user_name?.toLowerCase().includes(term) ||
        review.comment?.toLowerCase().includes(term) ||
        review.tour_name?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length
  };

  const openConfirmModal = (review, action) => {
    setSelectedReview(review);
    setActionType(action);
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    if (selectedReview && actionType) {
      await onUpdateStatus(selectedReview.id, actionType);
      setShowConfirmModal(false);
      setSelectedReview(null);
      setActionType(null);
    }
  };

  const getModalTitle = () => {
    switch(actionType) {
      case 'approved': return '✅ Подтверждение одобрения';
      case 'rejected': return '❌ Подтверждение отклонения';
      case 'pending': return '↩️ Подтверждение возврата';
      default: return 'Подтверждение';
    }
  };

  const getModalMessage = () => {
    switch(actionType) {
      case 'approved': return 'Вы уверены, что хотите одобрить этот отзыв?';
      case 'rejected': return 'Вы уверены, что хотите отклонить этот отзыв?';
      case 'pending': return 'Вы уверены, что хотите вернуть этот отзыв на модерацию?';
      default: return 'Вы уверены?';
    }
  };

  const getModalButtonColor = () => {
    switch(actionType) {
      case 'approved': return 'bg-green-600 hover:bg-green-700';
      case 'rejected': return 'bg-red-600 hover:bg-red-700';
      case 'pending': return 'bg-yellow-600 hover:bg-yellow-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const getModalButtonText = () => {
    switch(actionType) {
      case 'approved': return 'Одобрить';
      case 'rejected': return 'Отклонить';
      case 'pending': return 'Вернуть';
      default: return 'Подтвердить';
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и статистика */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Модерация отзывов</h2>
      </div>

      {/* Статистика отзывов */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div 
          className={`bg-gray-800/50 rounded-lg p-4 text-center border transition-all cursor-pointer ${
            filter === 'all' ? 'border-red-500 ring-2 ring-red-500/50' : 'border-gray-700 hover:border-red-500/30'
          }`}
          onClick={() => setFilter('all')}
        >
          <div className="text-3xl font-bold text-white">{stats.total}</div>
          <div className="text-sm text-gray-400">Всего отзывов</div>
        </div>
        <div 
          className={`bg-yellow-500/10 rounded-lg p-4 text-center border transition-all cursor-pointer ${
            filter === 'pending' ? 'border-yellow-500 ring-2 ring-yellow-500/50' : 'border-yellow-500/30 hover:bg-yellow-500/20'
          }`}
          onClick={() => setFilter('pending')}
        >
          <div className="text-3xl font-bold text-yellow-500">{stats.pending}</div>
          <div className="text-sm text-gray-400">Ожидают</div>
        </div>
        <div 
          className={`bg-green-500/10 rounded-lg p-4 text-center border transition-all cursor-pointer ${
            filter === 'approved' ? 'border-green-500 ring-2 ring-green-500/50' : 'border-green-500/30 hover:bg-green-500/20'
          }`}
          onClick={() => setFilter('approved')}
        >
          <div className="text-3xl font-bold text-green-500">{stats.approved}</div>
          <div className="text-sm text-gray-400">Одобрено</div>
        </div>
        <div 
          className={`bg-red-500/10 rounded-lg p-4 text-center border transition-all cursor-pointer ${
            filter === 'rejected' ? 'border-red-500 ring-2 ring-red-500/50' : 'border-red-500/30 hover:bg-red-500/20'
          }`}
          onClick={() => setFilter('rejected')}
        >
          <div className="text-3xl font-bold text-red-500">{stats.rejected}</div>
          <div className="text-sm text-gray-400">Отклонено</div>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Поиск</label>
            <input
              type="text"
              placeholder="Имя, отзыв, тур..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Статус</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Все статусы</option>
              <option value="pending">Ожидают</option>
              <option value="approved">Одобренные</option>
              <option value="rejected">Отклоненные</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilter('all');
                setSearchTerm('');
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors w-full"
            >
              Сбросить фильтры
            </button>
          </div>
        </div>
      </div>

      {/* Список отзывов */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-red-500/20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-medium text-gray-400">Отзывов не найдено</h3>
            <p className="text-gray-500 mt-2">Попробуйте изменить параметры фильтрации</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 hover:border-red-500/50 transition-all"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                {/* Основная информация */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      {review.user_name?.charAt(0) || 'А'}
                    </div>
                    <div>
                      <span className="font-bold text-white">{review.user_name || 'Аноним'}</span>
                      <span className="text-sm text-gray-400 ml-2">
                        • {formatDate(review.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-yellow-500 mb-2">
                      {'★'.repeat(review.rating || 0)}
                      {'☆'.repeat(5 - (review.rating || 0))}
                    </p>
                    <p className="text-gray-300 text-lg mb-2">"{review.comment}"</p>
                    <p className="text-sm text-gray-400">
                      🧭 Тур: <span className="text-red-400">{review.tour_name || 'Не указан'}</span>
                    </p>
                    {review.location && (
                      <p className="text-xs text-gray-500 mt-1">
                        📍 {review.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Статус и действия */}
                <div className="lg:w-64 flex flex-col items-start lg:items-end gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(review.status)} w-full lg:w-auto text-center`}>
                    {getStatusBadge(review.status)}
                  </span>
                  
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full">
                    {review.status === 'pending' && (
                      <>
                        <button
                          onClick={() => openConfirmModal(review, 'approved')}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2 w-full"
                        >
                          <span>✅</span> Одобрить
                        </button>
                        <button
                          onClick={() => openConfirmModal(review, 'rejected')}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2 w-full"
                        >
                          <span>❌</span> Отклонить
                        </button>
                      </>
                    )}

                    {review.status !== 'pending' && (
                      <button
                        onClick={() => openConfirmModal(review, 'pending')}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-medium transition-colors text-sm flex items-center justify-center gap-2 w-full"
                      >
                        <span>↩️</span> Вернуть на модерацию
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Модальное окно подтверждения */}
      <AnimatePresence>
        {showConfirmModal && selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-b from-gray-900 to-black border-2 border-red-500/30 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4 text-center">
                {getModalTitle()}
              </h3>
              
              <p className="text-gray-300 mb-6 text-center">
                {getModalMessage()}
              </p>

              <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-400 mb-2">Отзыв от <span className="text-white">{selectedReview.user_name}</span>:</p>
                <p className="text-gray-300 italic">"{selectedReview.comment.substring(0, 100)}..."</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 px-4 py-3 rounded-lg text-white font-medium transition-colors ${getModalButtonColor()}`}
                >
                  {getModalButtonText()}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Информация о количестве */}
      {filteredReviews.length > 0 && (
        <div className="text-sm text-gray-400 text-center">
          Показано {filteredReviews.length} из {reviews.length} отзывов
        </div>
      )}
    </div>
  );
};

export default AdminPage;