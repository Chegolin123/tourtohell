import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const BookingsManager = ({ bookings, onUpdateStatus, onDelete }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Функция для форматирования валюты
  const formatCurrency = (value) => {
    if (!value && value !== 0) return '0';
    const num = Number(value);
    if (isNaN(num)) return '0';
    return num.toLocaleString('ru-RU');
  };

  // Статистика по заявкам
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    totalRevenue: bookings.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0)
  };

  // Фильтрация заявок
  const filteredBookings = bookings.filter(booking => {
    // Фильтр по статусу
    if (filter !== 'all' && booking.status !== filter) return false;

    // Поиск по тексту
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matches = 
        booking.name?.toLowerCase().includes(term) ||
        booking.email?.toLowerCase().includes(term) ||
        booking.phone?.toLowerCase().includes(term) ||
        booking.tour_name?.toLowerCase().includes(term);
      if (!matches) return false;
    }

    // Фильтр по дате
    if (dateRange.start && dateRange.end) {
      const bookingDate = new Date(booking.created_at);
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      if (bookingDate < start || bookingDate > end) return false;
    }

    return true;
  });

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

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await onUpdateStatus(bookingId, newStatus);
      toast.success(`Статус изменен на "${getStatusText(newStatus)}"`);
    } catch (error) {
      toast.error('Ошибка при изменении статуса');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Дата', 'Клиент', 'Email', 'Телефон', 'Тур', 'Участников', 'Сумма', 'Статус'];
    const csvData = filteredBookings.map(b => [
      b.id,
      new Date(b.created_at).toLocaleDateString('ru-RU'),
      b.name,
      b.email,
      b.phone,
      b.tour_name,
      b.participants,
      b.total_price,
      getStatusText(b.status)
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и статистика */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Управление заявками</h2>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
        >
          <span>📥</span>
          Экспорт в CSV
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-xs text-gray-400">Всего</div>
        </div>
        <div className="bg-yellow-500/10 rounded-lg p-4 text-center border border-yellow-500/30">
          <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
          <div className="text-xs text-gray-400">Ожидают</div>
        </div>
        <div className="bg-green-500/10 rounded-lg p-4 text-center border border-green-500/30">
          <div className="text-2xl font-bold text-green-500">{stats.confirmed}</div>
          <div className="text-xs text-gray-400">Подтверждено</div>
        </div>
        <div className="bg-blue-500/10 rounded-lg p-4 text-center border border-blue-500/30">
          <div className="text-2xl font-bold text-blue-500">{stats.completed}</div>
          <div className="text-xs text-gray-400">Завершено</div>
        </div>
        <div className="bg-red-500/10 rounded-lg p-4 text-center border border-red-500/30">
          <div className="text-2xl font-bold text-red-500">{stats.cancelled}</div>
          <div className="text-xs text-gray-400">Отменено</div>
        </div>
        <div className="bg-purple-500/10 rounded-lg p-4 text-center border border-purple-500/30">
          <div className="text-2xl font-bold text-purple-500">{formatCurrency(stats.totalRevenue)} ₽</div>
          <div className="text-xs text-gray-400">Выручка</div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Поиск</label>
            <input
              type="text"
              placeholder="Имя, email, телефон..."
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
              <option value="pending">Ожидает</option>
              <option value="confirmed">Подтверждено</option>
              <option value="completed">Завершено</option>
              <option value="cancelled">Отменено</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Дата с</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Дата по</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Таблица заявок */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-red-500/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Дата</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Клиент</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Тур</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Дата тура</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Участников</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Сумма</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <AnimatePresence>
                {filteredBookings.map((booking) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-800/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <td className="px-6 py-4 text-sm">#{booking.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{booking.name}</div>
                      <div className="text-xs text-gray-400">{booking.email}</div>
                      <div className="text-xs text-gray-400">{booking.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">{booking.tour_name}</td>
                    <td className="px-6 py-4 text-sm">
                      {booking.preferred_date ? new Date(booking.preferred_date).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm">{booking.participants}</td>
                    <td className="px-6 py-4 text-sm text-red-500 font-bold">
                      {formatCurrency(booking.total_price)} ₽
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={booking.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(booking.id, e.target.value);
                        }}
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)} bg-transparent cursor-pointer`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="pending">Ожидает</option>
                        <option value="confirmed">Подтверждено</option>
                        <option value="completed">Завершено</option>
                        <option value="cancelled">Отменено</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Вы уверены, что хотите удалить эту заявку?')) {
                            onDelete(booking.id);
                          }
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Если нет заявок */}
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-medium text-gray-400">Заявок не найдено</h3>
            <p className="text-gray-500 mt-2">Попробуйте изменить параметры фильтрации</p>
          </div>
        )}
      </div>

      {/* Модальное окно с деталями заявки */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-b from-gray-900 to-black border-2 border-red-500/30 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold">Детали заявки #{selectedBooking.id}</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Информация о клиенте */}
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h4 className="font-bold text-red-400 mb-3">👤 Информация о клиенте</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Имя</p>
                      <p className="font-medium">{selectedBooking.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="font-medium">{selectedBooking.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Телефон</p>
                      <p className="font-medium">{selectedBooking.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Дата заявки</p>
                      <p className="font-medium">{formatDate(selectedBooking.created_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Информация о туре */}
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h4 className="font-bold text-red-400 mb-3">🗺️ Информация о туре</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Тур</p>
                      <p className="font-medium">{selectedBooking.tour_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Желаемая дата</p>
                      <p className="font-medium">
                        {selectedBooking.preferred_date ? new Date(selectedBooking.preferred_date).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) : 'Не указана'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Участников</p>
                      <p className="font-medium">{selectedBooking.participants}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Общая стоимость</p>
                      <p className="font-bold text-red-500">{formatCurrency(selectedBooking.total_price)} ₽</p>
                    </div>
                  </div>
                </div>

                {/* Дополнительные пожелания */}
                {selectedBooking.message && (
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <h4 className="font-bold text-red-400 mb-3">💬 Дополнительные пожелания</h4>
                    <p className="text-gray-300">{selectedBooking.message}</p>
                  </div>
                )}

                {/* Управление статусом */}
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h4 className="font-bold text-red-400 mb-3">📊 Управление статусом</h4>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        handleStatusChange(selectedBooking.id, 'confirmed');
                        setSelectedBooking(null);
                      }}
                      className="flex-1 px-4 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      ✅ Подтвердить
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedBooking.id, 'completed');
                        setSelectedBooking(null);
                      }}
                      className="flex-1 px-4 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      ✔️ Завершить
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedBooking.id, 'cancelled');
                        setSelectedBooking(null);
                      }}
                      className="flex-1 px-4 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      ❌ Отменить
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingsManager;