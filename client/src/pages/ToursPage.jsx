import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { tourService } from '../services/tourService';
import Loader from '../components/common/Loader';

const ToursPage = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  
  // Состояние фильтров
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    difficulty: 'all',
    priceRange: [0, 500000],
    sortBy: 'popular'
  });

  const difficulties = [
    { value: 'all', label: 'Любая сложность' },
    { value: 'medium', label: 'Средне' },
    { value: 'hard', label: 'Сложно' },
    { value: 'extreme', label: 'Экстремально' }
  ];

  const categories = [
    { value: 'all', label: 'Все направления' },
    { value: 'russia', label: 'Россия' },
    { value: 'world', label: 'Мир' }
  ];

  // Загрузка туров при монтировании
  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Loading tours...');
      const data = await tourService.getTours();
      console.log('Tours loaded:', data);
      setTours(data);
      setFilteredTours(data);
    } catch (error) {
      console.error('Error loading tours:', error);
      setError('Не удалось загрузить туры. Проверьте подключение к серверу.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let result = [...tours];

    // Фильтр по поиску
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(tour => 
        tour.title.toLowerCase().includes(searchLower) ||
        tour.location.toLowerCase().includes(searchLower) ||
        (tour.description && tour.description.toLowerCase().includes(searchLower))
      );
    }

    // Фильтр по категории
    if (filters.category !== 'all') {
      result = result.filter(tour => tour.category === filters.category);
    }

    // Фильтр по сложности
    if (filters.difficulty !== 'all') {
      result = result.filter(tour => tour.difficulty === filters.difficulty);
    }

    // Фильтр по цене
    result = result.filter(tour => tour.price <= filters.priceRange[1]);

    // Сортировка
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'duration':
        result.sort((a, b) => {
          const durationA = parseInt(a.duration) || 0;
          const durationB = parseInt(b.duration) || 0;
          return durationA - durationB;
        });
        break;
      default: // popular - по рейтингу и отзывам
        result.sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews));
    }

    setFilteredTours(result);
  }, [tours, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      console.log('Filters updated:', newFilters);
      return newFilters;
    });
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setFilters(prev => ({
      ...prev,
      priceRange: [0, value]
    }));
  };

  const clearFilter = (filterName) => {
    switch(filterName) {
      case 'category':
        setFilters(prev => ({ ...prev, category: 'all' }));
        break;
      case 'difficulty':
        setFilters(prev => ({ ...prev, difficulty: 'all' }));
        break;
      case 'search':
        setFilters(prev => ({ ...prev, search: '' }));
        break;
      case 'price':
        setFilters(prev => ({ ...prev, priceRange: [0, 500000] }));
        break;
      case 'all':
        setFilters({
          search: '',
          category: 'all',
          difficulty: 'all',
          priceRange: [0, 500000],
          sortBy: 'popular'
        });
        break;
      default:
        break;
    }
  };

  const hasActiveFilters = () => {
    return filters.category !== 'all' || 
           filters.difficulty !== 'all' || 
           filters.search !== '' || 
           filters.priceRange[1] < 500000;
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.difficulty !== 'all') count++;
    if (filters.search !== '') count++;
    if (filters.priceRange[1] < 500000) count++;
    return count;
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'hard': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'extreme': return 'text-red-600 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const handleTourClick = (tourId) => {
    navigate(`/tours/${tourId}`);
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-center bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl max-w-md border border-red-500/30">
          <div className="text-6xl mb-4">😈</div>
          <h2 className="text-2xl font-bold text-white mb-2">Ошибка подключения</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={loadTours}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-bold hover:scale-105 transition-transform"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
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
                ЭКСПЕДИЦИИ
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Выбери свое личное чистилище. Мы доставим тебя в самые опасные места планеты.
            </p>
            
            {/* Статистика */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="text-3xl font-bold text-primary-500">{tours.length}</div>
                <div className="text-sm text-gray-400">Маршрутов</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="text-3xl font-bold text-primary-500">1000+</div>
                <div className="text-sm text-gray-400">Душ сгорело</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="text-3xl font-bold text-primary-500">15</div>
                <div className="text-sm text-gray-400">Стран</div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Декоративная волна */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="black"/>
          </svg>
        </div>
      </section>

      <div className="container-custom py-12">
        {/* Панель фильтров */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border-2 border-red-500/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-primary-500">🔍</span> 
              Найти экспедицию
            </h2>
            {hasActiveFilters() && (
              <button 
                onClick={() => clearFilter('all')}
                className="text-sm text-primary-500 hover:text-primary-400 font-medium flex items-center gap-1"
              >
                <span>Сбросить все ({getActiveFiltersCount()})</span>
                <span>✕</span>
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Поиск */}
            <div className="relative lg:col-span-2">
              <label className="absolute -top-2 left-3 bg-gray-900 px-1 text-xs font-medium text-gray-400 z-10">
                Поиск
              </label>
              <input 
                type="text"
                placeholder="Название тура или страна..."
                className="w-full px-4 py-3 pl-10 border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-500 bg-gray-800"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
              <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
            </div>

            {/* Категория */}
            <div className="relative">
              <label className="absolute -top-2 left-3 bg-gray-900 px-1 text-xs font-medium text-gray-400 z-10">
                Направление
              </label>
              <select 
                className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white bg-gray-800 appearance-none"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <span className="absolute right-3 top-3.5 text-gray-500 pointer-events-none">▼</span>
            </div>

            {/* Сложность */}
            <div className="relative">
              <label className="absolute -top-2 left-3 bg-gray-900 px-1 text-xs font-medium text-gray-400 z-10">
                Сложность
              </label>
              <select 
                className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white bg-gray-800 appearance-none"
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              >
                {difficulties.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <span className="absolute right-3 top-3.5 text-gray-500 pointer-events-none">▼</span>
            </div>

            {/* Цена */}
            <div className="relative">
              <label className="absolute -top-2 left-3 bg-gray-900 px-1 text-xs font-medium text-gray-400 z-10">
                Цена до {filters.priceRange[1].toLocaleString()} ₽
              </label>
              <div className="mt-6 px-2">
                <input 
                  type="range"
                  min="0"
                  max="500000"
                  step="10000"
                  value={filters.priceRange[1]}
                  onChange={handlePriceChange}
                  className="w-full accent-red-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 ₽</span>
                  <span>500 000 ₽</span>
                </div>
              </div>
            </div>

            {/* Сортировка */}
            <div className="relative lg:col-span-1">
              <label className="absolute -top-2 left-3 bg-gray-900 px-1 text-xs font-medium text-gray-400 z-10">
                Сортировка
              </label>
              <select 
                className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white bg-gray-800 appearance-none"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="popular">По популярности</option>
                <option value="price-asc">Сначала дешевле</option>
                <option value="price-desc">Сначала дороже</option>
                <option value="rating">По рейтингу</option>
                <option value="duration">По длительности</option>
              </select>
              <span className="absolute right-3 top-3.5 text-gray-500 pointer-events-none">▼</span>
            </div>
          </div>

          {/* Активные фильтры */}
          {hasActiveFilters() && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t-2 border-gray-700">
              <span className="text-sm font-medium text-gray-400 mr-2">Активные фильтры:</span>
              {filters.category !== 'all' && (
                <span className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-full text-sm font-medium flex items-center gap-1 border border-red-500/30">
                  {categories.find(c => c.value === filters.category)?.label}
                  <button onClick={() => clearFilter('category')} className="ml-1 hover:text-red-300 font-bold text-lg">×</button>
                </span>
              )}
              {filters.difficulty !== 'all' && (
                <span className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-full text-sm font-medium flex items-center gap-1 border border-red-500/30">
                  {difficulties.find(d => d.value === filters.difficulty)?.label}
                  <button onClick={() => clearFilter('difficulty')} className="ml-1 hover:text-red-300 font-bold text-lg">×</button>
                </span>
              )}
              {filters.search && (
                <span className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-full text-sm font-medium flex items-center gap-1 border border-red-500/30">
                  🔍 {filters.search}
                  <button onClick={() => clearFilter('search')} className="ml-1 hover:text-red-300 font-bold text-lg">×</button>
                </span>
              )}
              {filters.priceRange[1] < 500000 && (
                <span className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-full text-sm font-medium flex items-center gap-1 border border-red-500/30">
                  💰 до {filters.priceRange[1].toLocaleString()} ₽
                  <button onClick={() => clearFilter('price')} className="ml-1 hover:text-red-300 font-bold text-lg">×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Результаты поиска */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl shadow-md border border-red-500/20">
          <div className="flex items-center gap-4">
            <p className="text-gray-300 font-medium">
              Найдено <span className="text-2xl font-bold text-red-500 mx-1">{filteredTours.length}</span> 
              {filteredTours.length === 1 ? ' экспедиция' : 
               filteredTours.length >= 2 && filteredTours.length <= 4 ? ' экспедиции' : ' экспедиций'}
            </p>
            {filteredTours.length !== tours.length && (
              <button 
                onClick={() => clearFilter('all')}
                className="text-sm text-red-400 hover:text-red-300 underline"
              >
                Показать все ({tours.length})
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition-all duration-300 border-2 ${
                viewMode === 'grid' 
                  ? 'bg-red-600 text-white border-red-600' 
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
              }`}
              title="Сетка"
            >
              ⊞
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg transition-all duration-300 border-2 ${
                viewMode === 'list' 
                  ? 'bg-red-600 text-white border-red-600' 
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
              }`}
              title="Список"
            >
              ≡
            </button>
          </div>
        </div>

        {/* Сетка туров */}
        {filteredTours.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-red-500/20">
            <div className="text-8xl mb-4 animate-bounce">😈</div>
            <h3 className="text-3xl font-bold text-gray-300 mb-2">Ничего не найдено</h3>
            <p className="text-gray-500 text-lg mb-4">Попробуйте изменить параметры поиска</p>
            <button 
              onClick={() => clearFilter('all')}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-bold hover:scale-105 transition-transform"
            >
              Сбросить все фильтры
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden cursor-pointer border-2 border-gray-800 hover:border-red-500 transition-all duration-300"
                onClick={() => handleTourClick(tour.id)}
              >
                {/* Изображение */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={tour.image} 
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/images/hero/hero-bg.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  
                  {/* Бейдж */}
                  <div className="absolute top-4 left-4 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-bold border border-red-500/30">
                    {tour.badge}
                  </div>
                  
                  {/* Рейтинг */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-sm border border-yellow-500/30">
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
                    <span className="font-medium">{tour.location}</span>
                  </p>
                  
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2 border-l-2 border-red-500/30 pl-3 italic">
                    {tour.shortDesc || tour.description}
                  </p>

                  {/* Даты */}
                  {tour.dates && tour.dates.length > 0 && (
                    <div className="flex gap-2 mb-4">
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
                  <div className="flex items-center justify-between pt-4 border-t-2 border-gray-800">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getDifficultyColor(tour.difficulty)}`}>
                      {difficulties.find(d => d.value === tour.difficulty)?.label || tour.difficulty}
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-red-500">{tour.price.toLocaleString()} ₽</span>
                      <span className="text-xs text-gray-500 block">за человека</span>
                    </div>
                  </div>
                </div>

                {/* Эффект при наведении */}
                <div className="absolute inset-0 border-4 border-red-500/0 group-hover:border-red-500/30 rounded-2xl transition-all duration-300 pointer-events-none"></div>
              </motion.div>
            ))}
          </div>
        ) : (
          // List view
          <div className="space-y-4">
            {filteredTours.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ x: 10 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-gray-800 hover:border-red-500"
                onClick={() => handleTourClick(tour.id)}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 h-48 md:h-auto relative">
                    <img 
                      src={tour.image} 
                      alt={tour.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/images/hero/hero-bg.jpg';
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-red-600/90 text-white px-2 py-1 rounded-full text-xs font-bold border border-red-500/30">
                      {tour.badge}
                    </div>
                  </div>
                  
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold text-white group-hover:text-red-500 transition-colors">
                        {tour.title}
                      </h3>
                      <span className="text-sm font-medium text-gray-400 bg-gray-800 px-3 py-1 rounded-full flex items-center gap-1">
                        <span>📍</span> {tour.location}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 mb-4 border-l-4 border-red-500 pl-4 py-1">
                      {tour.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                      <div className="flex flex-wrap gap-3">
                        <span className="text-sm font-medium text-gray-300 bg-gray-800 px-3 py-1.5 rounded-full flex items-center gap-1">
                          ⏱ {tour.duration}
                        </span>
                        <span className="text-sm font-medium text-gray-300 bg-gray-800 px-3 py-1.5 rounded-full flex items-center gap-1">
                          👥 до {tour.maxGroupSize} чел
                        </span>
                        <span className={`text-sm font-bold px-3 py-1.5 rounded-full border-2 ${getDifficultyColor(tour.difficulty)}`}>
                          {difficulties.find(d => d.value === tour.difficulty)?.label || tour.difficulty}
                        </span>
                        <span className="text-sm font-medium text-gray-300 bg-gray-800 px-3 py-1.5 rounded-full flex items-center gap-1">
                          <span className="text-yellow-500">★</span> {tour.rating} ({tour.reviews})
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-bold text-red-500">{tour.price.toLocaleString()} ₽</span>
                        <span className="text-xs text-gray-500 block">за человека</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToursPage;