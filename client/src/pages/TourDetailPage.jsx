import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { tourService } from '../services/tourService';
import Loader from '../components/common/Loader';
import BookingModal from '../components/booking/BookingModal';
import TourMap from '../components/tours/TourMap';

const TourDetailPage = () => {
  const { id } = useParams();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllItinerary, setShowAllItinerary] = useState(false);
  const [showAllIncluded, setShowAllIncluded] = useState(false);
  const [showAllNotIncluded, setShowAllNotIncluded] = useState(false);
  const [similarTours, setSimilarTours] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const loadTour = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tourService.getTourById(id);
      console.log('Tour data:', data);
      setTour(data);
    } catch (err) {
      console.error('Error loading tour:', err);
      setError('Тур не найден');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadSimilarTours = useCallback(async () => {
    if (!tour) return;
    try {
      const allTours = await tourService.getTours();
      const similar = allTours
        .filter(t => t.category === tour.category && t.id !== tour.id)
        .slice(0, 3);
      setSimilarTours(similar);
    } catch (err) {
      console.error('Error loading similar tours:', err);
    }
  }, [tour]);

  useEffect(() => {
    loadTour();
  }, [loadTour]);

  useEffect(() => {
    loadSimilarTours();
  }, [loadSimilarTours]);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'hard': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'extreme': return 'text-red-600 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch(difficulty) {
      case 'medium': return 'Средняя сложность';
      case 'hard': return 'Высокая сложность';
      case 'extreme': return 'Экстремальная сложность';
      default: return 'Не указана';
    }
  };

  if (loading) return <Loader />;
  
  if (error || !tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-center bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl max-w-md border border-red-500/30">
          <div className="text-6xl mb-4">😈</div>
          <h2 className="text-2xl font-bold text-white mb-2">Тур не найден</h2>
          <p className="text-gray-400 mb-4">Запрашиваемый тур не существует или был удален</p>
          <Link to="/tours" className="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg text-white font-bold hover:scale-105 transition-transform">
            Вернуться к турам
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = tour.images && tour.images.length > 0 
    ? tour.images[selectedImage] 
    : (tour.image || '/assets/images/hero/hero-bg.jpg');

  const isFavorite = isInWishlist(tour.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black text-white">
      {/* Модальное окно бронирования */}
      <BookingModal 
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        tour={tour}
      />

      {/* Хлебные крошки */}
      <div className="container-custom py-4 text-sm text-gray-400">
        <Link to="/" className="hover:text-red-500 transition-colors">Главная</Link>
        <span className="mx-2">/</span>
        <Link to="/tours" className="hover:text-red-500 transition-colors">Туры</Link>
        <span className="mx-2">/</span>
        <span className="text-red-500">{tour.title}</span>
      </div>

      {/* Основной контент */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая колонка - Галерея, карта и информация */}
          <div className="lg:col-span-2 space-y-8">
            {/* Галерея изображений */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20"
            >
              <div className="relative h-96 rounded-xl overflow-hidden mb-4">
                <img 
                  src={mainImage}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/images/hero/hero-bg.jpg';
                  }}
                />
                {tour.badge && (
                  <div className="absolute top-4 left-4 bg-red-600/90 text-white px-4 py-2 rounded-full text-sm font-bold">
                    {tour.badge}
                  </div>
                )}
              </div>
              
              {tour.images && tour.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {tour.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index 
                          ? 'border-red-500 scale-105' 
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`${tour.title} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Карта маршрута */}
            <TourMap tour={tour} />

            {/* Информация о туре */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20"
            >
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl md:text-4xl font-bold">{tour.title}</h1>
                <button
                  onClick={() => toggleWishlist(tour)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isFavorite 
                      ? 'bg-red-600 text-white scale-110' 
                      : 'bg-gray-800 text-white hover:bg-red-600/80'
                  }`}
                >
                  <span className="text-2xl">❤️</span>
                </button>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="flex items-center gap-2 text-gray-300 bg-gray-800 px-3 py-1 rounded-full">
                  <span>📍</span> {tour.location}
                </span>
                <span className="flex items-center gap-2 text-gray-300 bg-gray-800 px-3 py-1 rounded-full">
                  <span>⏱️</span> {tour.duration}
                </span>
                <span className="flex items-center gap-2 text-gray-300 bg-gray-800 px-3 py-1 rounded-full">
                  <span>👥</span> до {tour.maxGroupSize} чел
                </span>
                <span className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getDifficultyColor(tour.difficulty)}`}>
                  <span>⚡</span> {getDifficultyLabel(tour.difficulty)}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <span className="text-yellow-500 text-2xl">★</span>
                  <span className="text-2xl font-bold ml-1">{tour.rating}</span>
                  <span className="text-gray-400 ml-2">({tour.reviews} отзывов)</span>
                </div>
                <div className="text-3xl font-bold text-red-500">
                  {tour.price.toLocaleString()} ₽
                  <span className="text-sm text-gray-400 ml-2">за человека</span>
                </div>
              </div>

              {/* Расширенное описание */}
              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold mb-4 text-red-400">Описание тура</h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {tour.fullDescription || tour.description}
                </p>
                
                {tour.highlights && tour.highlights.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-3 text-red-400">Ключевые моменты</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {tour.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-300">
                          <span className="text-red-500">🔥</span> {highlight}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Программа тура */}
              {tour.itinerary && tour.itinerary.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4 text-red-400">Программа тура</h2>
                  <div className="space-y-4">
                    {(showAllItinerary ? tour.itinerary : tour.itinerary.slice(0, 3)).map((day) => (
                      <div key={day.day} className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-red-500">
                        <h3 className="font-bold text-lg mb-2">День {day.day}: {day.title}</h3>
                        <p className="text-gray-400">{day.description}</p>
                      </div>
                    ))}
                    {tour.itinerary.length > 3 && (
                      <button
                        onClick={() => setShowAllItinerary(!showAllItinerary)}
                        className="text-red-500 hover:text-red-400 font-medium mt-2"
                      >
                        {showAllItinerary ? 'Скрыть' : 'Показать полностью'} ↓
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Включено в стоимость */}
              {tour.included && tour.included.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4 text-red-400">В стоимость включено</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(showAllIncluded ? tour.included : tour.included.slice(0, 6)).map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-300">
                        <span className="text-green-500">✅</span> {item}
                      </div>
                    ))}
                  </div>
                  {tour.included.length > 6 && (
                    <button
                      onClick={() => setShowAllIncluded(!showAllIncluded)}
                      className="text-red-500 hover:text-red-400 font-medium mt-2"
                    >
                      {showAllIncluded ? 'Скрыть' : 'Показать еще'} ↓
                    </button>
                  )}
                </div>
              )}

              {/* Дополнительно оплачивается */}
              {tour.notIncluded && tour.notIncluded.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4 text-red-400">Дополнительно оплачивается</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(showAllNotIncluded ? tour.notIncluded : tour.notIncluded.slice(0, 4)).map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-300">
                        <span className="text-red-500">❌</span> {item}
                      </div>
                    ))}
                  </div>
                  {tour.notIncluded.length > 4 && (
                    <button
                      onClick={() => setShowAllNotIncluded(!showAllNotIncluded)}
                      className="text-red-500 hover:text-red-400 font-medium mt-2"
                    >
                      {showAllNotIncluded ? 'Скрыть' : 'Показать еще'} ↓
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Правая колонка - Бронирование */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-24 space-y-6"
            >
              {/* Блок бронирования */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
                <h3 className="text-2xl font-bold mb-6 text-center">Забронировать</h3>
                
                {/* Краткая информация */}
                <div className="mb-6 space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-400">Длительность:</span>
                    <span className="font-medium">{tour.duration}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-400">Группа:</span>
                    <span className="font-medium">до {tour.maxGroupSize} чел</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Цена:</span>
                    <span className="text-2xl font-bold text-red-500">{tour.price.toLocaleString()} ₽</span>
                  </div>
                </div>

                {/* Кнопка бронирования */}
                <button 
                  onClick={() => setShowBookingModal(true)}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-bold text-lg hover:scale-105 transition-transform mb-3"
                >
                  Забронировать
                </button>

                {/* Кнопка избранного */}
                <button
                  onClick={() => toggleWishlist(tour)}
                  className={`w-full py-3 rounded-lg font-medium text-lg transition-all flex items-center justify-center gap-2 ${
                    isFavorite
                      ? 'bg-red-600/20 text-red-400 border-2 border-red-500'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="text-xl">❤️</span>
                  {isFavorite ? 'В избранном' : 'Добавить в избранное'}
                </button>

                {/* Информация */}
                <div className="text-xs text-gray-500 text-center space-y-1 mt-4">
                  <p>✅ Бесплатная отмена за 7 дней</p>
                  <p>🔥 Мгновенное подтверждение</p>
                  <p>👥 Профессиональный гид</p>
                </div>
              </div>

              {/* Похожие туры */}
              {similarTours.length > 0 && (
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
                  <h3 className="text-xl font-bold mb-4">Похожие туры</h3>
                  <div className="space-y-4">
                    {similarTours.map((similar) => (
                      <Link
                        key={similar.id}
                        to={`/tours/${similar.id}`}
                        className="flex gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                          <img 
                            src={similar.image || '/assets/images/hero/hero-bg.jpg'} 
                            alt={similar.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white line-clamp-1">{similar.title}</h4>
                          <p className="text-sm text-gray-400">{similar.duration}</p>
                          <p className="text-red-500 font-bold">{similar.price.toLocaleString()} ₽</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailPage;