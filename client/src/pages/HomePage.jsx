import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
  const features = [
    {
      icon: '🔥',
      title: 'Экстремальные маршруты',
      desc: 'Уникальные туры в самые опасные места планеты: вулканы, пустыни, горные вершины',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: '⚔️',
      title: 'Испытание себя',
      desc: 'Проверка на прочность в диких условиях, выживание, преодоление страхов',
      color: 'from-red-600 to-red-800'
    },
    {
      icon: '🗺️',
      title: 'Запретные места',
      desc: 'Доступ в закрытые для туристов локации, секретные пещеры и кратеры',
      color: 'from-red-800 to-purple-900'
    },
    {
      icon: '🏆',
      title: 'Настоящие легенды',
      desc: 'Станьте частью сообщества бесстрашных путешественников',
      color: 'from-purple-900 to-orange-600'
    }
  ];

  const popularTours = [
    {
      id: 1,
      title: 'Врата Ада',
      location: 'Пустыня Данакиль, Эфиопия',
      description: 'Самое жаркое место на Земле. Лавовые озера, кислотные источники и соляные пустоши',
      price: 250000,
      duration: '7 дней',
      difficulty: 'Экстремально',
      image: '/assets/images/tours/danakil.jpg',
      badge: 'Смертельный риск'
    },
    {
      id: 2,
      title: 'Огненное кольцо',
      location: 'Камчатка, Россия',
      description: 'Действующие вулканы, гейзеры и долина смерти. Ночлег у кратера',
      price: 180000,
      duration: '10 дней',
      difficulty: 'Сложно',
      image: '/assets/images/tours/kamchatka.jpg',
      badge: 'Опасно для жизни'
    },
    {
      id: 3,
      title: 'Проклятие Анд',
      location: 'Перу',
      description: 'Затерянные города инков, шаманские ритуалы, священные горы',
      price: 320000,
      duration: '14 дней',
      difficulty: 'Средне',
      image: '/assets/images/tours/peru.jpg',
      badge: 'Мистика'
    }
  ];

  const reviews = [
    {
      id: 1,
      name: 'Дмитрий Волков',
      avatar: '/assets/images/avatars/default-avatar.png',
      rating: 5,
      text: 'Я думал, что видел всё, пока не спустился в кратер действующего вулкана. Это было невероятно страшно и красиво одновременно!',
      tour: 'Огненное кольцо',
      date: '2 недели назад'
    },
    {
      id: 2,
      name: 'Анна Смертная',
      avatar: '/assets/images/avatars/default-avatar.png',
      rating: 5,
      text: 'Пустыня Данакиль - это настоящий ад на Земле. 50 градусов жары, запах серы и нереальные пейзажи. Спасибо гидам, что выжили!',
      tour: 'Врата Ада',
      date: 'месяц назад'
    },
    {
      id: 3,
      name: 'Максим Грозный',
      avatar: '/assets/images/avatars/default-avatar.png',
      rating: 4,
      text: 'Тур в Перу перевернул мое сознание. Шаманские обряды, древние проклятия... Это не просто путешествие, это трансформация.',
      tour: 'Проклятие Анд',
      date: '3 недели назад'
    }
  ];

  return (
    <div className="overflow-hidden">
     {/* Hero секция - исправленная версия */}
<section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
  {/* Фоновое изображение */}
  <div className="absolute inset-0 z-0">
    <img 
      src="/assets/images/hero/hero-bg.jpg"
      alt="Горный пейзаж"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
  </div>

  {/* Основной контент - центрирован по вертикали */}
  <div className="relative z-10 container-custom flex flex-col items-center justify-center min-h-screen py-20">
    <div className="text-center text-white max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl font-black mb-4">
          <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Добро пожаловать
          </span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-2xl md:text-3xl mb-4 text-gray-200 font-bold"
      >
        В АД БИЛЕТОВ НЕТ, НО МЫ ИХ ПРОДАЕМ
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-300"
      >
        Экстремальные туры в самые опасные места планеты. 
        Только для тех, кто готов сгореть!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link 
          to="/tours" 
          className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg text-white font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-xl"
        >
          СГОРЕТЬ В АДУ
        </Link>
        
        <Link 
          to="/about" 
          className="px-8 py-4 border-2 border-red-500 text-red-500 rounded-lg font-bold text-lg hover:bg-red-500 hover:text-white transition-all duration-300 bg-black/20 backdrop-blur-sm"
        >
          УЗНАТЬ ЦЕНУ АДА
        </Link>
      </motion.div>
    </div>
  </div>

  {/* Счетчик - вынесен отдельно внизу, вне основного контента */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay: 0.8 }}
    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 w-full px-4"
  >
    <div className="max-w-xs mx-auto bg-black/60 backdrop-blur-md rounded-full px-6 py-3 border border-red-500/30 shadow-2xl">
      <p className="text-sm text-gray-300 text-center mb-1">Душ сгорело сегодня</p>
      <div className="flex gap-3 justify-center">
        {[3, 7, 6, 4].map((num, i) => (
          <span 
            key={i} 
            className="w-8 h-10 bg-gradient-to-b from-red-900 to-red-800 border border-red-500/50 rounded-lg flex items-center justify-center text-xl font-bold text-red-400"
          >
            {num}
          </span>
        ))}
      </div>
    </div>
  </motion.div>

  {/* Анимированный огонь */}
  <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10">
    <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-orange-600/30 to-transparent animate-pulse"></div>
  </div>
</section>

      {/* Секция с преимуществами */}
<section className="py-24 bg-black relative overflow-hidden">
  <div className="absolute inset-0 opacity-20">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600 rounded-full filter blur-3xl animate-pulse"></div>
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600 rounded-full filter blur-3xl animate-pulse animation-delay-1000"></div>
  </div>

  <div className="container-custom relative z-10">
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-5xl md:text-6xl font-black text-center mb-6"
    >
      <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
        ЧТО ТЕБЯ ЖДЕТ В АДУ
      </span>
    </motion.h2>
    
    <p className="text-center text-gray-400 text-xl mb-16 max-w-3xl mx-auto">
      Мы не обещаем райского отдыха. Мы предлагаем настоящие испытания, после которых ты уже никогда не будешь прежним.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="group relative h-full"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
          <div className="relative bg-gray-900/90 backdrop-blur-sm p-8 rounded-2xl border border-red-500/20 hover:border-red-500/50 transition-all duration-300 h-full flex flex-col">
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300 text-center">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 text-center">{feature.title}</h3>
            <p className="text-gray-400 text-center flex-grow">{feature.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* Популярные туры */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="container-custom">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-black text-center mb-6"
          >
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              САМЫЕ ГОРЯЧИЕ ТУРЫ
            </span>
          </motion.h2>
          
          <p className="text-center text-gray-400 text-xl mb-16 max-w-3xl mx-auto">
            Выбери свое личное чистилище
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularTours.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
                onClick={() => window.location.href = `/tours/${tour.id}`}
              >
                <div className="relative h-80 rounded-2xl overflow-hidden border-2 border-red-500/20 group-hover:border-red-500/50 transition-all duration-300">
                  <img 
                    src={tour.image} 
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/images/hero/hero-bg.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                  
                  <div className="absolute top-4 left-4 bg-red-600/90 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {tour.badge}
                  </div>
                  
                  <div className="absolute top-4 right-4 bg-black/70 text-red-500 px-3 py-1 rounded-full text-sm border border-red-500/30">
                    {tour.difficulty}
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{tour.title}</h3>
                    <p className="text-gray-300 text-sm mb-3">{tour.location}</p>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{tour.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-red-500">{tour.price.toLocaleString()} ₽</span>
                        <span className="text-gray-400 text-sm ml-2">{tour.duration}</span>
                      </div>
                      <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                        <span className="text-white text-xl">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/tours" 
              className="inline-flex items-center gap-2 text-xl text-red-500 hover:text-red-400 transition-colors group"
            >
              <span>Смотреть все адские туры</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Секция с отзывами */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <span className="text-[200px] font-black text-red-600 rotate-12">DEMONS</span>
        </div>

        <div className="container-custom relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-black text-center mb-6"
          >
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              КРИКИ ДУШ
            </span>
          </motion.h2>
          
          <p className="text-center text-gray-400 text-xl mb-16 max-w-3xl mx-auto">
            Что говорят те, кто уже побывал в аду
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-red-500/20 hover:border-red-500/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-600/20 rounded-full overflow-hidden">
                    <img 
                      src={review.avatar} 
                      alt={review.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'20\' fill=\'%23ef4444\'/%3E%3Ctext x=\'20\' y=\'25\' font-size=\'20\' text-anchor=\'middle\' fill=\'%23ffffff\'%3E👤%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{review.name}</h4>
                    <p className="text-sm text-gray-400">{review.tour}</p>
                  </div>
                  <div className="ml-auto text-yellow-500">
                    {'★'.repeat(review.rating)}
                  </div>
                </div>
                
                <p className="text-gray-300 mb-3 italic">"{review.text}"</p>
                
                <p className="text-sm text-gray-500">{review.date}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Призыв к действию */}
      <section className="py-32 bg-gradient-to-br from-red-900 via-red-700 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-ping"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>

        <div className="container-custom text-center text-white relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black mb-8"
          >
            ГОТОВ СГОРЕТЬ?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-2xl mb-12 max-w-3xl mx-auto"
          >
            Ад не ждет. Места в аду ограничены.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link
              to="/tours"
              className="group relative inline-block px-12 py-6 bg-black text-white rounded-2xl font-black text-2xl overflow-hidden"
            >
              <span className="relative z-10">ЗАБРОНИРОВАТЬ АД</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-8 text-sm text-red-200"
          >
            *Обратный билет из ада не предусмотрен
          </motion.p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;