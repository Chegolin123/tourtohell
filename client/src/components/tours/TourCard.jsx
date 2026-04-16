import React from 'react';
import { motion } from 'framer-motion';
import { useWishlist } from '../../context/WishlistContext';

const TourCard = ({ tour }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(tour.id);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'medium': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30';
      case 'hard': return 'text-orange-500 bg-orange-500/20 border-orange-500/30';
      case 'extreme': return 'text-red-500 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch(difficulty) {
      case 'medium': return 'Средне';
      case 'hard': return 'Сложно';
      case 'extreme': return 'Экстремально';
      default: return 'Не указано';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-red-500/20 hover:border-red-500/50 transition-all cursor-pointer"
      onClick={() => window.location.href = `/tours/${tour.id}`}
    >
      {/* Изображение */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={tour.image || '/assets/images/hero/hero-bg.jpg'}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/images/hero/hero-bg.jpg';
          }}
        />
        
        {/* Кнопка избранного */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(tour);
          }}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all z-10 ${
            isFavorite 
              ? 'bg-red-600 text-white scale-110 shadow-lg' 
              : 'bg-black/50 text-white hover:bg-red-600/80'
          }`}
        >
          <span className={`text-xl transition-transform ${isFavorite ? 'scale-110' : ''}`}>
            ❤️
          </span>
        </button>
        
        {/* Бейдж */}
        {tour.badge && (
          <div className="absolute top-4 left-4 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-bold border border-red-500/30">
            {tour.badge}
          </div>
        )}
        
        {/* Рейтинг */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-sm border border-yellow-500/30">
          <span className="text-yellow-500">★</span>
          <span className="text-white ml-1">{tour.rating}</span>
          <span className="text-gray-400 text-xs ml-1">({tour.reviews})</span>
        </div>
      </div>

      {/* Контент */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">
            {tour.title}
          </h3>
          <span className="text-sm font-medium text-gray-400 bg-gray-800 px-2 py-1 rounded-lg">
            {tour.duration}
          </span>
        </div>
        
        <p className="text-gray-400 text-sm mb-3 flex items-center gap-1">
          <span className="text-lg">📍</span>
          <span>{tour.location}</span>
        </p>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 border-l-2 border-red-500/30 pl-3 italic">
          {tour.shortDesc || tour.description}
        </p>

        {/* Даты */}
        {tour.dates && tour.dates.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {tour.dates.slice(0, 3).map((date, i) => (
              <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs font-medium border border-gray-700">
                {date}
              </span>
            ))}
          </div>
        )}

        {/* Хайлайты */}
        {tour.highlights && tour.highlights.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tour.highlights.slice(0, 3).map((highlight, i) => (
              <span key={i} className="px-2 py-1 bg-red-500/10 text-red-400 rounded-full text-xs font-medium border border-red-500/30">
                {highlight}
              </span>
            ))}
          </div>
        )}

        {/* Сложность и цена */}
        <div className="flex items-center justify-between pt-4 border-t border-red-500/20">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getDifficultyColor(tour.difficulty)}`}>
            {getDifficultyLabel(tour.difficulty)}
          </span>
          <div className="text-right">
            <span className="text-2xl font-bold text-red-500">{tour.price.toLocaleString()} ₽</span>
            <span className="text-xs text-gray-500 block">за человека</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TourCard;