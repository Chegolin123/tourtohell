import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { adminService } from '../../services/adminService';

const ToursManager = ({ tours: initialTours, onRefresh }) => {
  const [tours, setTours] = useState(initialTours || []);
  const [showForm, setShowForm] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    fullDescription: '',
    shortDesc: '',
    price: '',
    duration: '',
    maxGroupSize: '',
    difficulty: 'medium',
    badge: '',
    category: 'world',
    images: []
  });

  useEffect(() => {
    setTours(initialTours);
  }, [initialTours]);

  const difficulties = [
    { value: 'medium', label: 'Средняя' },
    { value: 'hard', label: 'Сложная' },
    { value: 'extreme', label: 'Экстремальная' }
  ];

  const categories = [
    { value: 'russia', label: '🇷🇺 Россия' },
    { value: 'world', label: '🌍 Мир' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      description: '',
      fullDescription: '',
      shortDesc: '',
      price: '',
      duration: '',
      maxGroupSize: '',
      difficulty: 'medium',
      badge: '',
      category: 'world',
      images: []
    });
    setEditingTour(null);
    setShowForm(false);
  };

  const handleEdit = (tour) => {
    setEditingTour(tour);
    setFormData({
      title: tour.title || '',
      location: tour.location || '',
      description: tour.description || '',
      fullDescription: tour.fullDescription || '',
      shortDesc: tour.shortDesc || '',
      price: tour.price || '',
      duration: tour.duration || '',
      maxGroupSize: tour.maxGroupSize || '',
      difficulty: tour.difficulty || 'medium',
      badge: tour.badge || '',
      category: tour.category || 'world',
      images: []
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Добавляем все поля
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          formData.images.forEach(image => {
            formDataToSend.append('images', image);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (editingTour) {
        // Обновление существующего тура
        await adminService.updateTour(editingTour.id, formData);
        toast.success('Тур успешно обновлен!');
      } else {
        // Создание нового тура
        await adminService.createTour(formDataToSend);
        toast.success('Тур успешно создан!');
      }

      resetForm();
      onRefresh();
    } catch (error) {
      console.error('Error saving tour:', error);
      toast.error('Ошибка при сохранении тура');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tourId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот тур?')) return;

    try {
      await adminService.deleteTour(tourId);
      toast.success('Тур удален');
      onRefresh();
    } catch (error) {
      console.error('Error deleting tour:', error);
      toast.error('Ошибка при удалении тура');
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопка добавления */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Управление турами</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
        >
          <span>➕</span>
          Добавить тур
        </button>
      </div>

      {/* Форма создания/редактирования */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-red-500/30 overflow-hidden"
          >
            <h3 className="text-xl font-bold mb-4 text-red-400">
              {editingTour ? '✏️ Редактировать тур' : '➕ Новый тур'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Основная информация */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Название тура *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Врата Ада"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Локация *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Пустыня Данакиль, Эфиопия"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Краткое описание
                    </label>
                    <input
                      type="text"
                      name="shortDesc"
                      value={formData.shortDesc}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Краткое описание для карточки"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Полное описание *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Подробное описание тура..."
                    />
                  </div>
                </div>

                {/* Цена и параметры */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Цена (₽) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="250000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Длительность *
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="7 дней"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Макс. группа (чел) *
                    </label>
                    <input
                      type="number"
                      name="maxGroupSize"
                      value={formData.maxGroupSize}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="8"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Сложность *
                    </label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {difficulties.map(d => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Категория *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {categories.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Бейдж (метка)
                    </label>
                    <input
                      type="text"
                      name="badge"
                      value={formData.badge}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Смертельный риск"
                    />
                  </div>
                </div>
              </div>

              {/* Загрузка изображений */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Изображения
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                
                {/* Превью загруженных изображений */}
                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`preview-${index}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-red-500/30"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Кнопки управления */}
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-medium hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {loading ? 'Сохранение...' : (editingTour ? 'Сохранить' : 'Создать')}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Таблица туров */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-red-500/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Изображение</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Название</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Локация</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Цена</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Длительность</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Сложность</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {tours.map((tour) => (
                <tr key={tour.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm">#{tour.id}</td>
                  <td className="px-6 py-4">
                    <img 
                      src={tour.image || '/assets/images/hero/hero-bg.jpg'} 
                      alt={tour.title}
                      className="w-12 h-12 rounded-lg object-cover border border-red-500/30"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{tour.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{tour.location}</td>
                  <td className="px-6 py-4 text-sm text-red-500 font-bold">
                    {tour.price?.toLocaleString()} ₽
                  </td>
                  <td className="px-6 py-4 text-sm">{tour.duration}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tour.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      tour.difficulty === 'hard' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {tour.difficulty === 'medium' && 'Средняя'}
                      {tour.difficulty === 'hard' && 'Сложная'}
                      {tour.difficulty === 'extreme' && 'Экстремальная'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(tour)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="Редактировать"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(tour.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ToursManager;