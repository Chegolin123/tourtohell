const mongoose = require('mongoose');
const Tour = require('../models/Tour');
require('dotenv').config();

const newTours = [
  {
    id: 4,
    title: 'Ледяной ад',
    location: 'Якутия, Россия',
    description: 'Путешествие на Полюс Холода. Оймякон - самое холодное обитаемое место на Земле.',
    fullDescription: 'Оймякон - самое холодное место на Земле, где постоянно живут люди. Температура здесь опускается до -70°C. Вы увидите, как люди выживают в таких условиях, посетите ледяные пещеры и примете участие в обряде местных шаманов. Настоящее испытание для тех, кто думал, что ад - это только жара.',
    shortDesc: 'Полюс холода Оймякон',
    price: 280000,
    duration: '9 дней',
    maxGroupSize: 5,
    difficulty: 'extreme',
    rating: 4.9,
    reviews: 12,
    image: '/assets/images/tours/kamchatka-2.jpg',
    images: ['/assets/images/tours/kamchatka-2.jpg', '/assets/images/hero/hero-bg.jpg', '/assets/images/tours/kamchatka.jpg'],
    badge: 'Смертельный холод',
    category: 'russia',
    dates: ['10 янв', '5 фев', '1 мар'],
    highlights: ['Полюс холода', 'Ледяные пещеры', 'Якутский шаманизм'],
    included: [
      'Проживание в традиционных якутских домах',
      'Питание (национальная кухня)',
      'Трансферы на вездеходах',
      'Услуги гида-проводника',
      'Специальное зимнее снаряжение',
      'Обряд шамана'
    ],
    notIncluded: [
      'Авиабилеты до Якутска',
      'Страховка',
      'Личные расходы',
      'Сувениры'
    ],
    itinerary: [
      { day: 1, title: 'Прибытие в Якутск', description: 'Встреча в аэропорту, выдача снаряжения, инструктаж' },
      { day: 2, title: 'Дорога на Полюс холода', description: 'Переезд на вездеходах в Оймякон, знакомство с местными жителями' },
      { day: 3, title: 'Ледяные пещеры', description: 'Экскурсия в ледяные пещеры, ночевка в пещере' },
      { day: 4, title: 'Шаманский обряд', description: 'Участие в традиционном обряде очищения' }
    ],
    startDates: ['2025-01-10', '2025-02-05', '2025-03-01']
  },
  {
    id: 5,
    title: 'Остров дракона',
    location: 'Комодо, Индонезия',
    description: 'Экспедиция к легендарным драконам Комодо. Поиск комодских варанов в дикой природе.',
    fullDescription: 'Остров Комодо - единственное место на Земле, где в дикой природе обитают легендарные драконы - комодские вараны. Мы отправимся на их поиск с опытными рейнджерами, а также исследуем подводный мир, увидим затонувшие корабли и отдохнем на розовых пляжах.',
    shortDesc: 'В поисках драконов',
    price: 350000,
    duration: '12 дней',
    maxGroupSize: 8,
    difficulty: 'medium',
    rating: 4.8,
    reviews: 21,
    image: '/assets/images/tours/danakil.jpg',
    images: ['/assets/images/tours/danakil.jpg', '/assets/images/hero/hero-bg.jpg', '/assets/images/tours/peru.jpg'],
    badge: 'Опасная фауна',
    category: 'world',
    dates: ['20 авг', '15 сен', '10 окт'],
    highlights: ['Драконы Комодо', 'Розовый пляж', 'Затонувшие корабли'],
    included: [
      'Проживание в отелях и эко-лоджах',
      'Питание',
      'Трансферы на катерах',
      'Услуги гида и рейнджеров',
      'Снаряжение для дайвинга',
      'Входные билеты в национальный парк'
    ],
    notIncluded: [
      'Авиабилеты до Лабуан-Баджо',
      'Страховка (обязательно)',
      'Личные расходы'
    ],
    itinerary: [
      { day: 1, title: 'Прибытие на Флорес', description: 'Перелет в Лабуан-Баджо, размещение в отеле' },
      { day: 2, title: 'Остров Комодо', description: 'Поиск драконов с рейнджерами, наблюдение за варанами' },
      { day: 3, title: 'Розовый пляж', description: 'Дайвинг у затонувших кораблей, отдых на розовом пляже' },
      { day: 4, title: 'Остров Падар', description: 'Треккинг на смотровую площадку с панорамным видом' }
    ],
    startDates: ['2024-08-20', '2024-09-15', '2024-10-10']
  },
  {
    id: 6,
    title: 'Призраки Чернобыля',
    location: 'Чернобыль, Украина',
    description: 'Запретная зона отчуждения. Экскурсия по Припяти, посещение реактора и заброшенных городов.',
    fullDescription: 'Чернобыльская зона отчуждения - самое загадочное место на планете. Заброшенный город Припять, покинутые деревни, дикая природа, захватившая территорию. Мы посетим самые интересные места, включая 4-й энергоблок, и проведем ночную экскурсию с дозиметрами. Прикоснитесь к истории самой страшной техногенной катастрофы.',
    shortDesc: 'Зона отчуждения',
    price: 220000,
    duration: '5 дней',
    maxGroupSize: 4,
    difficulty: 'medium',
    rating: 4.9,
    reviews: 32,
    image: '/assets/images/hero/hero-bg.jpg',
    images: ['/assets/images/hero/hero-bg.jpg', '/assets/images/tours/kamchatka.jpg', '/assets/images/tours/peru.jpg'],
    badge: 'Радиация',
    category: 'world',
    dates: ['25 июл', '20 авг', '15 сен'],
    highlights: ['Припять', 'Саркофаг', 'Рыжий лес'],
    included: [
      'Проживание в гостинице в Киеве',
      'Трансферы в зону',
      'Услуги лицензированного гида',
      'Дозиметры',
      'Разрешения на вход в зону',
      'Спецодежда'
    ],
    notIncluded: [
      'Авиабилеты до Киева',
      'Страховка',
      'Личные расходы'
    ],
    itinerary: [
      { day: 1, title: 'Прибытие в Киев', description: 'Встреча в аэропорту, размещение в отеле, инструктаж по безопасности' },
      { day: 2, title: 'Въезд в зону', description: 'КПП "Дитятки", заброшенные деревни, посещение Припяти' },
      { day: 3, title: 'ЧАЭС и Припять', description: 'Экскурсия к 4-му энергоблоку, детальный осмотр города' },
      { day: 4, title: 'Ночная экскурсия', description: 'Ночная прогулка по Припяти с дозиметрами, наблюдение за радиоактивным фоном' }
    ],
    startDates: ['2024-07-25', '2024-08-20', '2024-09-15']
  }
];

const addNewTours = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourtohell');
    console.log('✅ Connected to MongoDB');

    // Проверяем, какие туры уже есть
    const existingTours = await Tour.find();
    console.log(`📊 Existing tours: ${existingTours.length}`);

    // Добавляем новые туры
    for (const tour of newTours) {
      const existing = await Tour.findOne({ id: tour.id });
      if (existing) {
        console.log(`⚠️ Tour with ID ${tour.id} already exists, updating...`);
        await Tour.updateOne({ id: tour.id }, tour);
      } else {
        console.log(`➕ Adding new tour: ${tour.title}`);
        await Tour.create(tour);
      }
    }

    const finalCount = await Tour.countDocuments();
    console.log(`✅ Total tours now: ${finalCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding tours:', error);
    process.exit(1);
  }
};

addNewTours();