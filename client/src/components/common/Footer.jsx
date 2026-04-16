import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white border-t-4 border-primary-600 relative overflow-hidden">
      {/* Декоративный элемент - компас */}
      <div className="absolute top-10 right-10 opacity-5 text-9xl transform rotate-12 hidden lg:block">
        🧭
      </div>
      
      {/* Декоративный элемент - карта */}
      <div className="absolute bottom-10 left-10 opacity-5 text-9xl transform -rotate-12 hidden lg:block">
        🗺️
      </div>

      <div className="container-custom py-12 relative z-10">
        {/* Основная сетка футера */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Колонка 1: О компании */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-4xl">🔥</span>
              <div>
                <h3 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                  Tour to Hell
                </h3>
                <p className="text-xs text-gray-400">экстремальный туроператор</p>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed">
              Мы отправляем смельчаков в самые опасные места планеты с 2015 года. 
              Более 1000 душ успешно сгорели в наших турах.
            </p>
            
            <div className="flex space-x-4 pt-2">
              <a href="https://vk.com/tourtohell" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary-500 transition-colors">📘</a>
              <a href="https://instagram.com/tourtohell" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary-500 transition-colors">📷</a>
              <a href="https://tiktok.com/@tourtohell" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary-500 transition-colors">🎥</a>
              <a href="https://t.me/tourtohell" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary-500 transition-colors">📱</a>
            </div>
          </div>

          {/* Колонка 2: Навигация */}
          <div className="space-y-4">
            <h4 className="text-lg font-display font-bold text-primary-500 border-b-2 border-primary-500/30 pb-2 inline-block">
              Навигация
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-500 transition-colors flex items-center gap-2">
                  <span className="text-sm">🔥</span> Главная
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-gray-400 hover:text-primary-500 transition-colors flex items-center gap-2">
                  <span className="text-sm">🗺️</span> Экспедиции
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary-500 transition-colors flex items-center gap-2">
                  <span className="text-sm">📜</span> О нас
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-gray-400 hover:text-primary-500 transition-colors flex items-center gap-2">
                  <span className="text-sm">📔</span> Дневники
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="text-gray-400 hover:text-primary-500 transition-colors flex items-center gap-2">
                  <span className="text-sm">📞</span> Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Колонка 3: Контакты */}
          <div className="space-y-4">
            <h4 className="text-lg font-display font-bold text-primary-500 border-b-2 border-primary-500/30 pb-2 inline-block">
              Контакты
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400">
                <span className="text-xl">📍</span>
                <span>г. Москва, ул. Тверская, 15<br/>БЦ "Тверская Plaza", офис 405</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <span className="text-xl">📞</span>
                <div>
                  <p>+7 (999) 123-45-67</p>
                  <p className="text-sm text-gray-500">круглосуточно</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <span className="text-xl">✉️</span>
                <div>
                  <p>info@tourtohell.ru</p>
                  <p className="text-sm text-gray-500">booking@tourtohell.ru</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Колонка 4: Режим работы */}
          <div className="space-y-4">
            <h4 className="text-lg font-display font-bold text-primary-500 border-b-2 border-primary-500/30 pb-2 inline-block">
              Режим работы
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex justify-between">
                <span>Пн - Пт:</span>
                <span className="text-white">10:00 - 20:00</span>
              </li>
              <li className="flex justify-between">
                <span>Сб:</span>
                <span className="text-white">11:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Вс:</span>
                <span className="text-red-500">выходной</span>
              </li>
            </ul>
            
            <div className="mt-6 pt-4 border-t border-gray-800">
              <p className="text-sm text-gray-500 mb-2">Подпишись на адскую рассылку</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Твой email"
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-sm flex-grow focus:outline-none focus:border-primary-500"
                />
                <button className="px-4 py-2 bg-primary-600 rounded-r-lg hover:bg-primary-700 transition-colors text-sm font-bold">
                  🔥
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя часть с копирайтом и ссылками */}
        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {currentYear} Tour to Hell. Все права защищены. Ад не ждет.</p>
          
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-primary-500 transition-colors">
              Политика конфиденциальности
            </Link>
            <Link to="/terms" className="hover:text-primary-500 transition-colors">
              Условия использования
            </Link>
          </div>
        </div>

        {/* Счетчик душ (шутка) */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-700">
          {[...Array(5)].map((_, i) => '🔥').join('')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;