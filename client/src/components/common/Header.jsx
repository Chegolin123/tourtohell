import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useWishlist } from '../../context/WishlistContext';
import AuthModal from '../auth/AuthModal';

const Header = () => {
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const openAuthModal = (mode) => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
    setIsMenuOpen(false);
  };

  const goToProfile = () => {
    navigate('/profile');
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 via-red-950 to-black text-white sticky top-0 z-50 shadow-2xl border-b-4 border-red-600">
      {/* Модальное окно авторизации */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />

      <div className="container-custom">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <span className="text-4xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              🔥
            </span>
            <div>
              <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Tour to Hell
              </span>
              <span className="block text-xs text-gray-400">экстремальный туроператор</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-red-500 transition-colors font-medium">Главная</Link>
            <Link to="/tours" className="text-gray-300 hover:text-red-500 transition-colors font-medium">Экспедиции</Link>
            <Link to="/about" className="text-gray-300 hover:text-red-500 transition-colors font-medium">О нас</Link>
            <Link to="/reviews" className="text-gray-300 hover:text-red-500 transition-colors font-medium">Отзывы</Link>
            <Link to="/contacts" className="text-gray-300 hover:text-red-500 transition-colors font-medium">Контакты</Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 hover:bg-white/10 rounded-full transition-colors group">
              <span className="text-2xl group-hover:scale-110 transition-transform inline-block">❤️</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce-slow">
                  {wishlistCount}
                </span>
              )}
            </Link>

           

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/20 transition-all border border-red-500/30"
                >
                  <span>👤</span>
                  <span className="hidden lg:inline max-w-[100px] truncate">{user.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-lg shadow-2xl py-2 border-2 border-red-500/30 z-50">
                    <button
                      onClick={goToProfile}
                      className="block w-full text-left px-4 py-2 hover:bg-white/10 transition-colors"
                    >
                      👤 Мой профиль
                    </button>
                    <Link
                      to="/profile?tab=bookings"
                      className="block px-4 py-2 hover:bg-white/10 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      🎒 Мои бронирования
                    </Link>
                    <Link
                      to="/profile?tab=reviews"
                      className="block px-4 py-2 hover:bg-white/10 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      📝 Мои отзывы
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 hover:bg-white/10 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      ❤️ Избранное
                    </Link>
                    
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 hover:bg-white/10 transition-colors text-red-400 font-medium"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        👑 Админ-панель
                      </Link>
                    )}
                    
                    <div className="border-t border-gray-700 my-1"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-white/10 transition-colors text-red-400"
                    >
                      🚪 Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex space-x-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  Войти
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Регистрация
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-2xl p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-red-500/30 animate-fade-in">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                🏠 Главная
              </Link>
              <Link
                to="/tours"
                className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                🗺️ Экспедиции
              </Link>
              <Link
                to="/about"
                className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                📜 О нас
              </Link>
              <Link
                to="/reviews"
                className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                📝 Отзывы
              </Link>
              <Link
                to="/contacts"
                className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                📞 Контакты
              </Link>
              
              <div className="border-t border-gray-700 my-2"></div>
              
              <Link
                to="/wishlist"
                className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                ❤️ Избранное
              </Link>
             
              
              {!user && (
                <div className="flex flex-col space-y-2 pt-2">
                  <button
                    onClick={() => {
                      openAuthModal('login');
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg text-center hover:bg-red-500 hover:text-white transition-all"
                  >
                    Войти
                  </button>
                  <button
                    onClick={() => {
                      openAuthModal('register');
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg text-center hover:scale-105 transition-all"
                  >
                    Регистрация
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;