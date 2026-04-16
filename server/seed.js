const mongoose = require('mongoose');
const Tour = require('./models/Tour');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const sampleTours = [
  {
    title: 'Путешествие в ад - Вулканы Камчатки',
    description: 'Экстремальный тур к действующим вулканам Камчатки. Вы увидите настоящие гейзеры, вулканические кратеры и дьявольские пейзажи.',
    destination: 'Камчатка',
    country: 'Россия',
    duration: 10,
    price: 150000,
    maxGroupSize: 8,
    category: 'russia',
    images: ['/uploads/kamchatka1.jpg', '/uploads/kamchatka2.jpg'],
    included: [
      'Проживание в отелях 3*',
      '3-разовое питание',
      'Трансфер из аэропорта',
      'Услуги гида-проводника',
      'Все входные билеты',
      'Транспортное обслуживание'
    ],
    notIncluded: [
      'Авиабилеты до Петропавловска-Камчатского',
      'Страховка от несчастных случаев',
      'Личные расходы',
      'Дополнительные экскурсии'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Прибытие в Петропавловск-Камчатский',
        description: 'Встреча в аэропорту, трансфер в отель, знакомство с группой и гидом',
        activities: ['Трансфер', 'Размещение', 'Вечерняя прогулка по городу']
      },
      {
        day: 2,
        title: 'Вулкан Мутновский',
        description: 'Треккинг к активному вулкану, наблюдение за фумаролами',
        activities: ['Треккинг', 'Фотосессия', 'Пикник на склоне вулкана']
      },
      {
        day: 3,
        title: 'Долина гейзеров',
        description: 'Вертолетная экскурсия в Долину гейзеров',
        activities: ['Вертолетная экскурсия', 'Наблюдение за гейзерами', 'Купание в термальных источниках']
      }
    ],
    startDates: [
      { date: new Date('2024-07-15'), available: true, participants: 0 },
      { date: new Date('2024-08-10'), available: true, participants: 0 },
      { date: new Date('2024-09-05'), available: true, participants: 0 }
    ],
    featured: true,
    rating: 4.8
  },
  {
    title: 'Врата ада - Пустыня Данакиль',
    description: 'Путешествие в самое жаркое место на Земле. Соляные равнины, кислотные озера и действующие вулканы.',
    destination: 'Данакиль',
    country: 'Эфиопия',
    duration: 7,
    price: 250000,
    maxGroupSize: 6,
    category: 'world',
    images: ['/uploads/danakil1.jpg', '/uploads/danakil2.jpg'],
    included: [
      'Проживание в палаточных лагерях',
      'Питание (полный пансион)',
      'Трансфер на внедорожниках',
      'Услуги местного проводника',
      'Разрешения на посещение парков'
    ],
    notIncluded: [
      'Авиабилеты до Аддис-Абебы',
      'Визовый сбор',
      'Страховка',
      'Чаевые местным жителям'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Прибытие в Аддис-Абебу',
        description: 'Встреча в аэропорту, перелет в Мекеле',
        activities: ['Перелет', 'Размещение', 'Брифинг по безопасности']
      },
      {
        day: 2,
        title: 'Вулкан Эрта Але',
        description: 'Треккинг к действующему вулкану, ночевка у кратера',
        activities: ['Треккинг', 'Наблюдение за лавовым озером', 'Ночная фотосъемка']
      }
    ],
    startDates: [
      { date: new Date('2024-09-05'), available: true, participants: 0 },
      { date: new Date('2024-10-20'), available: true, participants: 0 },
      { date: new Date('2024-11-15'), available: true, participants: 0 }
    ],
    featured: true,
    rating: 4.9
  },
  {
    title: 'Тайны Горного Алтая',
    description: 'Мистические места Алтая. Гора Белуха, перевалы и шаманские обряды.',
    destination: 'Горный Алтай',
    country: 'Россия',
    duration: 12,
    price: 120000,
    maxGroupSize: 10,
    category: 'russia',
    images: ['/uploads/altai1.jpg'],
    included: [
      'Проживание на турбазах',
      'Питание',
      'Трансферы',
      'Услуги гида',
      'Прокат снаряжения'
    ],
    notIncluded: [
      'Авиабилеты до Горно-Алтайска',
      'Страховка',
      'Баня (по желанию)'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Прибытие на Алтай',
        description: 'Встреча в аэропорту, трансфер на турбазу',
        activities: ['Трансфер', 'Размещение', 'Знакомство']
      }
    ],
    startDates: [
      { date: new Date('2024-06-10'), available: true, participants: 0 },
      { date: new Date('2024-07-22'), available: true, participants: 0 }
    ],
    featured: false,
    rating: 4.6
  }
];

const seedDatabase = async () => {
  try {
    // Подключение к БД
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourtohell');
    console.log('✅ Подключено к MongoDB');

    // Очистка коллекций
    await Tour.deleteMany({});
    await User.deleteMany({});
    console.log('✅ База данных очищена');

    // Добавление туров
    const tours = await Tour.insertMany(sampleTours);
    console.log(`✅ Добавлено ${tours.length} туров`);

    // Создание тестового админа
    const adminExists = await User.findOne({ email: 'admin@tourtohell.com' });
    
    if (!adminExists) {
      await User.create({
        name: 'Администратор',
        email: 'admin@tourtohell.com',
        password: 'admin123',
        role: 'admin',
        phone: '+7 (999) 123-45-67'
      });
      console.log('✅ Создан тестовый администратор');
      console.log('   Email: admin@tourtohell.com');
      console.log('   Пароль: admin123');
    }

    // Создание тестового пользователя
    const userExists = await User.findOne({ email: 'user@example.com' });
    
    if (!userExists) {
      await User.create({
        name: 'Тестовый пользователь',
        email: 'user@example.com',
        password: 'user123',
        role: 'user',
        phone: '+7 (999) 765-43-21'
      });
      console.log('✅ Создан тестовый пользователь');
    }

    console.log('\n🎉 База данных успешно заполнена!');
    console.log('📊 Статистика:');
    console.log(`   Туров: ${tours.length}`);
    console.log(`   Пользователей: ${await User.countDocuments()}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  }
};

seedDatabase();