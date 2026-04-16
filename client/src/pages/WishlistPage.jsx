import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import TourCard from '../components/tours/TourCard';

const WishlistPage = () => {
  const { wishlistItems, clearWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black text-white">
      {/* Hero секция */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600 rounded-full filter blur-3xl animate-pulse animation-delay-1000"></div>
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <div className="text-8xl mb-6 animate-bounce">❤️</div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              ИЗБРАННОЕ
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Туры, которые ты хочешь посетить
          </p>
        </div>
      </section>

      {/* Список избранных туров */}
      <div className="container-custom py-16">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-red-500/20">
            <div className="text-8xl mb-4">💔</div>
            <h3 className="text-3xl font-bold text-gray-300 mb-2">В избранном пока пусто</h3>
            <p className="text-gray-400 text-lg mb-6">Добавляй понравившиеся туры ❤️, чтобы не потерять</p>
            <Link 
              to="/tours" 
              className="inline-block px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg text-white font-bold hover:scale-105 transition-transform"
            >
              Выбрать тур
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <p className="text-gray-300">
                В избранном <span className="text-2xl font-bold text-red-500">{wishlistItems.length}</span> туров
              </p>
              <button
                onClick={clearWishlist}
                className="px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-600/30 transition-colors"
              >
                Очистить избранное
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlistItems.map((tour, index) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <TourCard tour={tour} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;