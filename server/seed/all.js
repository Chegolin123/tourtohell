const mongoose = require('mongoose');
const Tour = require('../models/Tour');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
require('dotenv').config();

const tours = [
  {
    id: 1,
    title: 'Врата Ада',
    location: 'Пустыня Данакиль, Эфиопия',
    description: 'Самое жаркое место на Земле. Лавовые озера, кислотные источники и соляные пустоши.',
    fullDescription: 'Пустыня Данакиль считается одним из самых негостеприимных мест на планете. Температура здесь поднимается до 50C, воздух наполнен парами серы, а под ногами - раскаленная соль. Но именно здесь вы увидите настоящие лавовые озера, кислотные источники невероятных цветов и соляные равнины, которые кажутся инопланетными.',
    shortDesc: 'Самое жаркое место на Земле',
    price: 250000,
    duration: '7 дней',
    maxGroupSize: 6,
    difficulty: 'extreme',
    rating: 4.9,
    reviews: 24,
    image: '/assets/images/tours/danakil.jpg',
    images: ['/assets/images/tours/danakil.jpg', '/assets/images/tours/kamchatka.jpg', '/assets/images/hero/hero-bg.jpg'],
    badge: 'Смертельный риск',
    category: 'world',
    dates: ['15 июл', '10 авг', '5 сен'],
    highlights: ['Лавовое озеро', 'Соляные равнины', 'Кислотные источники'],
    included: [
      'Проживание в палаточных лагерях',
      'Питание (полный пансион)',
      'Трансфер на внедорожниках',
      'Услуги местного проводника',
      'Разрешения на посещение парков',
      'Прокат специального снаряжения'
    ],
    notIncluded: [
      'Авиабилеты до Аддис-Абебы',
      'Визовый сбор',
      'Страховка',
      'Личные расходы',
      'Чаевые местным жителям'
    ],
    itinerary: [
      { day: 1, title: 'Прибытие в Аддис-Абебу', description: 'Встреча в аэропорту, перелет в Мекеле, размещение в отеле, брифинг по безопасности' },
      { day: 2, title: 'Вулкан Эрта Але', description: 'Треккинг к действующему вулкану, наблюдение за лавовым озером, ночевка у кратера' },
      { day: 3, title: 'Соляные равнины', description: 'Спуск с вулкана, поездка по соляным равнинам, посещение деревни соледобытчиков' }
    ],
    startDates: ['2024-07-15', '2024-08-10', '2024-09-05']
  },
  {
    id: 2,
    title: 'Огненное кольцо',
    location: 'Камчатка, Россия',
    description: 'Действующие вулканы, гейзеры и долина смерти. Ночлег у кратера вулкана.',
    fullDescription: 'Камчатка - край вулканов и гейзеров. Здесь вы увидите настоящие извержения, прогуляетесь по долине гейзеров и спуститесь в кратер действующего вулкана. Это путешествие для настоящих экстремалов.',
    shortDesc: 'Действующие вулканы Камчатки',
    price: 180000,
    duration: '10 дней',
    maxGroupSize: 8,
    difficulty: 'hard',
    rating: 4.8,
    reviews: 18,
    image: '/assets/images/tours/kamchatka.jpg',
    images: ['/assets/images/tours/kamchatka.jpg', '/assets/images/tours/kamchatka-2.jpg', '/assets/images/hero/hero-bg.jpg'],
    badge: 'Опасно для жизни',
    category: 'russia',
    dates: ['20 июл', '15 авг', '10 сен'],
    highlights: ['Вулкан Мутновский', 'Долина гейзеров', 'Термальные источники'],
    included: [
      'Проживание в отелях и приютах',
      'Питание',
      'Трансферы',
      'Услуги гида',
      'Прокат снаряжения',
      'Вертолетная экскурсия'
    ],
    notIncluded: [
      'Авиабилеты до Петропавловска-Камчатского',
      'Страховка',
      'Личные расходы'
    ],
    itinerary: [
      { day: 1, title: 'Прибытие', description: 'Встреча в аэропорту, трансфер в отель, знакомство с группой' },
      { day: 2, title: 'Вулкан Мутновский', description: 'Треккинг к вулкану, наблюдение за фумаролами' },
      { day: 3, title: 'Долина гейзеров', description: 'Вертолетная экскурсия, купание в термальных источниках' }
    ],
    startDates: ['2024-07-15', '2024-08-10', '2024-09-05']
  },
  {
    id: 3,
    title: 'Проклятие Анд',
    location: 'Перу',
    description: 'Затерянные города инков, шаманские ритуалы, священные горы.',
    fullDescription: 'Анды хранят множество тайн. Затерянные города инков, древние шаманские ритуалы, священные горы - все это ждет вас в этом мистическом путешествии.',
    shortDesc: 'Мистика древних цивилизаций',
    price: 320000,
    duration: '14 дней',
    maxGroupSize: 10,
    difficulty: 'medium',
    rating: 4.7,
    reviews: 15,
    image: '/assets/images/tours/peru.jpg',
    images: ['/assets/images/tours/peru.jpg', '/assets/images/hero/hero-bg.jpg', '/assets/images/tours/danakil.jpg'],
    badge: 'Мистика',
    category: 'world',
    dates: ['5 авг', '2 сен', '28 сен'],
    highlights: ['Мачу-Пикчу', 'Шаманская церемония', 'Священная долина'],
    included: [
      'Проживание в отелях',
      'Питание',
      'Трансферы',
      'Услуги гида',
      'Входные билеты',
      'Шаманская церемония'
    ],
    notIncluded: [
      'Авиабилеты до Лимы',
      'Страховка',
      'Личные расходы'
    ],
    itinerary: [
      { day: 1, title: 'Прибытие в Лиму', description: 'Встреча в аэропорту, трансфер в отель' },
      { day: 2, title: 'Куско', description: 'Перелет в Куско, акклиматизация' },
      { day: 3, title: 'Мачу-Пикчу', description: 'Поезд к Мачу-Пикчу, экскурсия по затерянному городу' }
    ],
    startDates: ['2024-07-15', '2024-08-10', '2024-09-05']
  }
];

const users = [
  {
    name: 'Администратор',
    email: 'admin@tourtohell.com',
    password: '',
    role: 'admin',
    phone: '+7 (999) 123-45-67'
  },
  {
    name: 'Иван Петров',
    email: 'ivan@example.com',
    password: '',
    role: 'user',
    phone: '+7 (999) 765-43-21'
  }
];

const bookings = [
  {
    tourId: 1,
    userId: 'user1',
    userName: 'Иван Петров',
    userEmail: 'ivan@example.com',
    userPhone: '+7 (999) 765-43-21',
    participants: 2,
    startDate: new Date('2024-07-15'),
    totalPrice: 500000,
    status: 'confirmed',
    paymentMethod: 'card',
    createdAt: new Date()
  },
  {
    tourId: 2,
    userId: 'user1',
    userName: 'Иван Петров',
    userEmail: 'ivan@example.com',
    userPhone: '+7 (999) 765-43-21',
    participants: 1,
    startDate: new Date('2024-08-10'),
    totalPrice: 180000,
    status: 'pending',
    paymentMethod: 'cash',
    createdAt: new Date()
  }
];

const reviews = [
  {
    tourId: 1,
    userId: 'user1',
    userName: 'Иван Петров',
    rating: 5,
    comment: 'Невероятное путешествие! Лавовое озеро - это что-то нереальное. Гид профессионал, организация на высшем уровне.',
    createdAt: new Date('2024-03-15')
  },
  {
    tourId: 2,
    userId: 'user1',
    userName: 'Иван Петров',
    rating: 5,
    comment: 'Вулканы Камчатки - это мощь природы! Очень понравилась вертолетная экскурсия и купание в термальных источниках.',
    createdAt: new Date('2024-03-10')
  },
  {
    tourId: 3,
    userId: 'user1',
    userName: 'Иван Петров',
    rating: 4,
    comment: 'Мистическое место. Шаманская церемония оставила неизгладимые впечатления. Немного не хватило времени на треккинг.',
    createdAt: new Date('2024-03-05')
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourtohell');
    console.log(' Connected to MongoDB');

    // Очищаем коллекции
    await Tour.deleteMany({});
    await User.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    console.log(' Collections cleared');

    // Добавляем туры
    await Tour.insertMany(tours);
    console.log(' Added ' + tours.length + ' tours');

    // Добавляем пользователей
    await User.insertMany(users);
    console.log(' Added ' + users.length + ' users');

    // Добавляем бронирования
    await Booking.insertMany(bookings);
    console.log(' Added ' + bookings.length + ' bookings');

    // Добавляем отзывы
    await Review.insertMany(reviews);
    console.log(' Added ' + reviews.length + ' reviews');

    console.log('\n Database seeded successfully!');
    console.log(' Collections:');
    console.log('   Tours: ' + await Tour.countDocuments());
    console.log('   Users: ' + await User.countDocuments());
    console.log('   Bookings: ' + await Booking.countDocuments());
    console.log('   Reviews: ' + await Review.countDocuments());
    
    process.exit(0);
  } catch (error) {
    console.error(' Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
