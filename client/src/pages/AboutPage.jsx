import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AboutPage = () => {
  const stats = [
    { value: '8', label: 'лет в аду', icon: '⏳' },
    { value: '1500+', label: 'сгоревших душ', icon: '🔥' },
    { value: '15', label: 'стран', icon: '🗺️' },
    { value: '24/7', label: 'поддержка грешников', icon: '😈' }
  ];

  const team = [
    {
      name: 'Демьян Адович',
      role: 'Главный демон-организатор',
      desc: 'Побывал в 50+ странах, спускался в кратеры вулканов 12 раз',
      icon: '👹',
      color: 'from-red-600 to-orange-600'
    },
    {
      name: 'Люцифер Путешественников',
      role: 'Ведущий гид по самым опасным местам',
      desc: 'Знает все тропы в аду, выжил после встречи с драконом Комодо',
      icon: '👿',
      color: 'from-orange-600 to-red-600'
    },
    {
      name: 'Астарта Экстремальная',
      role: 'Специалист по выживанию',
      desc: 'Обучает, как не сгореть раньше времени и вернуться с рассказами',
      icon: '💀',
      color: 'from-red-700 to-orange-700'
    }
  ];

  const values = [
    {
      title: 'Безопасность в аду',
      desc: 'Мы гарантируем, что ты вернешься живым. Или вернем деньги твоим родственникам.',
      icon: '🛡️'
    },
    {
      title: 'Честность',
      desc: 'Мы не скрываем, что будет страшно, больно и опасно. Именно за этим ты и идешь.',
      icon: '⚔️'
    },
    {
      title: 'Профессионализм',
      desc: 'Наши гиды — бывшие спецназовцы, вулканологи и шаманы с многолетним опытом.',
      icon: '🎯'
    },
    {
      title: 'Индивидуальный подход',
      desc: 'Каждому грешнику — свое чистилище. Программа подбирается под твои страхи.',
      icon: '🔮'
    }
  ];

  const achievements = [
    { year: '2015', event: 'Основание компании. Первая экспедиция на Камчатку.' },
    { year: '2017', event: 'Покорение пустыни Данакиль. 50 туристов выжили.' },
    { year: '2019', event: 'Открытие маршрута в Чернобыль. Ночные экскурсии с дозиметром.' },
    { year: '2022', event: 'Экспедиция на Полюс холода в Якутии. -60°C — это адский холод.' },
    { year: '2024', event: '1000+ сгоревших душ. Мы гордимся каждым клиентом.' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black text-white">
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
            <div className="text-8xl mb-6 animate-bounce">🔥</div>
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Добро пожаловать в ад
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Мы — единственный туроператор, который отправляет грешников 
              в самые опасные места планеты с 2015 года.
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                to="/tours" 
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg text-white font-bold text-lg hover:scale-105 transition-transform shadow-2xl"
              >
                Выбрать чистилище
              </Link>
              <Link 
                to="/contacts" 
                className="px-8 py-4 border-2 border-red-500 text-red-500 rounded-lg font-bold text-lg hover:bg-red-500 hover:text-white transition-all"
              >
                Связаться с демоном
              </Link>
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

      {/* Статистика */}
      <section className="py-16 bg-black/50 backdrop-blur-sm">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-red-500">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Наша история */}
      <section className="py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                НАША ИСТОРИЯ
              </span>
            </h2>
            <p className="text-lg text-gray-300">
              Все началось с безумной идеи отправить туристов в самое жаркое место на Земле. 
              Теперь мы водим экскурсии в ад и обратно. Буквально.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {achievements.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-4 mb-8 relative"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center font-bold text-white z-10 relative">
                    {item.year}
                  </div>
                  {index < achievements.length - 1 && (
                    <div className="absolute top-12 left-1/2 w-0.5 h-16 bg-gradient-to-b from-red-600 to-transparent"></div>
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <p className="text-white text-lg">{item.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Наши ценности */}
      <section className="py-24 bg-black/50">
        <div className="container-custom">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-center mb-16"
          >
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              НАШИ ЦЕННОСТИ
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-red-500/20 hover:border-red-500/50 transition-all group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Команда демонов */}
      <section className="py-24">
        <div className="container-custom">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-center mb-6"
          >
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              КОМАНДА ДЕМОНОВ
            </span>
          </motion.h2>
          <p className="text-center text-gray-400 text-lg mb-16 max-w-2xl mx-auto">
            Те, кто проведут тебя через ад и вернут обратно (если повезет)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-b from-gray-900 to-black rounded-2xl p-8 border border-red-500/20 hover:border-red-500/50 transition-all group text-center"
              >
                <div className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${member.color} rounded-2xl flex items-center justify-center text-5xl transform group-hover:rotate-12 transition-transform`}>
                  {member.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-red-500 font-medium mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.desc}</p>
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
            Присоединяйся к тысячам грешников, которые уже прошли через ад
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/tours"
              className="group relative inline-block px-12 py-6 bg-black text-white rounded-2xl font-black text-2xl overflow-hidden hover:scale-105 transition-transform"
            >
              <span className="relative z-10">ВЫБРАТЬ ТУР</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </Link>
            
            <Link
              to="/contacts"
              className="px-12 py-6 border-4 border-white text-white rounded-2xl font-black text-2xl hover:bg-white hover:text-red-600 transition-all"
            >
              СВЯЗАТЬСЯ С НАМИ
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-8 text-sm text-red-200"
          >
            *Билеты в один конец не продаем. Пока что.
          </motion.p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;