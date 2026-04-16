import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import AuthModal from '../components/auth/AuthModal';
import ReviewModal from '../components/reviews/ReviewModal';

const ReviewsPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ 
    total: 0, 
    average: 0, 
    distribution: {5:0, 4:0, 3:0, 2:0, 1:0} 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [likedReviews, setLikedReviews] = useState({});
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Loading reviews with filter:', filter, 'sort:', sort);
      const data = await reviewService.getAllReviews(filter, sort);
      console.log('Reviews data received:', data);
      
      if (Array.isArray(data)) {
        setReviews(data);
      } else {
        console.error('Data is not an array:', data);
        setReviews([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError('Не удалось загрузить отзывы');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [filter, sort]);

  const loadStats = useCallback(async () => {
    try {
      console.log('Loading stats...');
      const data = await reviewService.getReviewsStats();
      console.log('Stats data received:', data);
      setStats(data || { total: 0, average: 0, distribution: {5:0, 4:0, 3:0, 2:0, 1:0} });
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }, []);

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [loadReviews, loadStats]);

  const handleLike = async (reviewId) => {
    if (likedReviews[reviewId]) return;
    
    try {
      const data = await reviewService.likeReview(reviewId);
      setReviews(reviews.map(r => 
        r._id === reviewId ? { ...r, likes: data.likes } : r
      ));
      setLikedReviews({ ...likedReviews, [reviewId]: true });
    } catch (err) {
      console.error('Error liking review:', err);
    }
  };

  const handleWriteReview = () => {
    if (user) {
      setShowReviewModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Дата неизвестна';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-center bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl max-w-md border border-red-500/30">
          <div className="text-6xl mb-4">😈</div>
          <h2 className="text-2xl font-bold text-white mb-2">Ошибка загрузки</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={loadReviews}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-bold hover:scale-105 transition-transform"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black text-white">
      {/* Модальные окна */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
      <ReviewModal 
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        tour={null}
      />

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
                КРИКИ ДУШ
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Реальные отзывы тех, кто уже побывал в аду и вернулся, чтобы рассказать
            </p>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="black"/>
          </svg>
        </div>
      </section>

      {/* Статистика отзывов */}
      <section className="py-16 bg-black/50 backdrop-blur-sm">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20"
            >
              <div className="text-6xl font-bold text-red-500 mb-2">{stats.average}</div>
              <div className="text-2xl text-yellow-500 mb-2">★★★★★</div>
              <div className="text-gray-400">Средняя оценка</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20"
            >
              <div className="text-6xl font-bold text-red-500 mb-2">{stats.total}</div>
              <div className="text-2xl mb-2">👹</div>
              <div className="text-gray-400">Всего отзывов</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20"
            >
              {[5,4,3,2,1].map(star => (
                <div key={star} className="flex items-center gap-2 mb-2">
                  <span className="w-12 text-yellow-500">{star} ★</span>
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                      style={{ width: stats.total > 0 ? `${(stats.distribution[star] / stats.total) * 100}%` : '0%' }}
                    ></div>
                  </div>
                  <span className="w-12 text-sm text-gray-400">{stats.distribution[star]}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Фильтры и сортировка */}
      <div className="container-custom py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex gap-2">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'all' 
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Все отзывы ({reviews.length})
              </button>
              <button 
                onClick={() => setFilter('with-photos')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'with-photos' 
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                С фото
              </button>
            </div>
            
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
              <option value="highest">С высоким рейтингом</option>
              <option value="lowest">С низким рейтингом</option>
            </select>
          </div>
        </motion.div>

        {/* Список отзывов */}
        {reviews.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-red-500/20">
            <div className="text-8xl mb-4 animate-bounce">👻</div>
            <h3 className="text-3xl font-bold text-gray-300 mb-2">Пока нет отзывов</h3>
            <p className="text-gray-500 text-lg mb-4">Будь первым, кто расскажет свою адскую историю</p>
            <button
              onClick={handleWriteReview}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-bold hover:scale-105 transition-transform inline-block"
            >
              Написать отзыв
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review._id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20 hover:border-red-500/50 transition-all group"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Аватар */}
                  <div className="md:w-20 flex flex-col items-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center text-4xl transform group-hover:rotate-12 transition-transform">
                      {review.avatar || '👤'}
                    </div>
                    <div className="text-yellow-500 text-sm mt-2">
                      {'★'.repeat(review.rating || 0)}
                      {'☆'.repeat(5 - (review.rating || 0))}
                    </div>
                  </div>

                  {/* Контент отзыва */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white">{review.user_name || review.user || 'Аноним'}</h3>
                        <p className="text-sm text-gray-400">{review.location || 'Неизвестно'}</p>
                      </div>
                      <div className="text-sm text-gray-400 mt-2 md:mt-0">
                        {formatDate(review.created_at || review.date)}
                      </div>
                    </div>

                    <Link 
                      to={`/tours/${review.tour_id || review.tourId || 1}`}
                      className="inline-block mb-3 text-red-400 hover:text-red-300 font-medium transition-colors"
                    >
                      🧭 {review.tour_name || review.tour || 'Неизвестный тур'}
                    </Link>

                    <p className="text-gray-300 mb-4 text-lg leading-relaxed">
                      "{review.comment || 'Нет комментария'}"
                    </p>

                    {/* Лайки */}
                    <div className="flex items-center gap-4 text-sm">
                      <button 
                        onClick={() => handleLike(review._id)}
                        disabled={likedReviews[review._id]}
                        className={`flex items-center gap-1 transition-colors ${
                          likedReviews[review._id] 
                            ? 'text-red-500 cursor-default' 
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <span>🔥</span> {review.likes || 0}
                      </button>
                      <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors">
                        <span>💬</span> Ответить
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Призыв оставить отзыв */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-2xl p-12 border border-red-500/30"
        >
          <h3 className="text-3xl font-bold text-white mb-4">Был в аду? Расскажи!</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Поделись своими впечатлениями с будущими грешниками. 
            Самые страшные истории получат скидку 10% на следующий тур.
          </p>
          <button
            onClick={handleWriteReview}
            className="px-8 py-4 bg-white text-red-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors inline-block"
          >
            Написать отзыв
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ReviewsPage;