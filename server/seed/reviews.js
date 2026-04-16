const mongoose = require('mongoose');
const Review = require('../models/Review');
require('dotenv').config();

const reviews = [
  {
    user: 'Дмитрий Волков',
    userId: 'user1',
    avatar: '👨‍🚀',
    rating: 5,
    date: new Date('2024-03-15'),
    tour: 'Врата Ада (Пустыня Данакиль)',
    tourId: 1,
    comment: 'Это было невероятно! 50 градусов жары, запах серы, лавовое озеро прямо под ногами. Я думал, что не выживу, но гид Демьян профессионал. Вернулся другим человеком. Теперь знаю, что такое настоящий ад.',
    images: [],
    likes: 24,
    location: 'Москва',
    status: 'approved'
  },
  {
    user: 'Елена Смирнова',
    userId: 'user2',
    avatar: '🧗‍♀️',
    rating: 5,
    date: new Date('2024-03-10'),
    tour: 'Огненное кольцо (Камчатка)',
    tourId: 2,
    comment: 'Вулканы Камчатки — это мощь природы! Мы ночевали у кратера действующего вулкана, земля дрожала, внизу бурлила лава. Вертолетная экскурсия над долиной гейзеров — лучшее, что я видела в жизни. Спасибо команде за безопасность!',
    images: [],
    likes: 18,
    location: 'Санкт-Петербург',
    status: 'approved'
  },
  {
    user: 'Максим Грозный',
    userId: 'user3',
    avatar: '🧔‍♂️',
    rating: 4,
    date: new Date('2024-03-05'),
    tour: 'Проклятие Анд (Перу)',
    tourId: 3,
    comment: 'Мачу-Пикчу впечатляет, но настоящая магия началась с шаманской церемонии. Ощущение, что прикоснулся к чему-то древнему и мистическому. Минус звезда только за то, что мало времени дали на треккинг в горах.',
    images: [],
    likes: 15,
    location: 'Екатеринбург',
    status: 'approved'
  }
];

const seedReviews = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourtohell');
    console.log('✅ Connected to MongoDB');

    await Review.deleteMany({});
    console.log('✅ Reviews collection cleared');

    const result = await Review.insertMany(reviews);
    console.log(`✅ Added ${result.length} reviews to database`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    process.exit(1);
  }
};

seedReviews();