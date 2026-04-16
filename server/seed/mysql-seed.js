const mysql = require('mysql2/promise');
require('dotenv').config();

const seedDatabase = async () => {
  let connection;
  
  try {
    // Подключаемся к MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to MySQL');

    // Создаем базу данных если не существует
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'tourtohell'}`);
    await connection.query(`USE ${process.env.DB_NAME || 'tourtohell'}`);
    
    console.log(`✅ Using database ${process.env.DB_NAME || 'tourtohell'}`);

    // Удаляем существующие таблицы если они есть
    await connection.query('DROP TABLE IF EXISTS tour_images, tour_dates, tour_included, tour_not_included, tour_itinerary, bookings, reviews, tours, users');
    
    console.log('✅ Old tables dropped');

    // Создаем таблицу пользователей
    await connection.query(`
      CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        avatar VARCHAR(255) DEFAULT 'default-avatar.jpg',
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Создаем таблицу туров
    await connection.query(`
      CREATE TABLE tours (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT,
        full_description TEXT,
        short_desc VARCHAR(255),
        price DECIMAL(10,2) NOT NULL,
        duration VARCHAR(50),
        max_group_size INT,
        difficulty ENUM('medium', 'hard', 'extreme'),
        rating DECIMAL(3,2) DEFAULT 0,
        reviews INT DEFAULT 0,
        image VARCHAR(255),
        badge VARCHAR(100),
        category ENUM('russia', 'world'),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Создаем таблицу изображений туров
    await connection.query(`
      CREATE TABLE tour_images (
        id INT PRIMARY KEY AUTO_INCREMENT,
        tour_id INT,
        image_url VARCHAR(255),
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
      )
    `);

    // Создаем таблицу дат туров
    await connection.query(`
      CREATE TABLE tour_dates (
        id INT PRIMARY KEY AUTO_INCREMENT,
        tour_id INT,
        date VARCHAR(50),
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
      )
    `);

    // Создаем таблицу включенных услуг
    await connection.query(`
      CREATE TABLE tour_included (
        id INT PRIMARY KEY AUTO_INCREMENT,
        tour_id INT,
        item TEXT,
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
      )
    `);

    // Создаем таблицу не включенных услуг
    await connection.query(`
      CREATE TABLE tour_not_included (
        id INT PRIMARY KEY AUTO_INCREMENT,
        tour_id INT,
        item TEXT,
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
      )
    `);

    // Создаем таблицу программы тура
    await connection.query(`
      CREATE TABLE tour_itinerary (
        id INT PRIMARY KEY AUTO_INCREMENT,
        tour_id INT,
        day INT,
        title VARCHAR(255),
        description TEXT,
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
      )
    `);

    // Создаем таблицу бронирований
    await connection.query(`
      CREATE TABLE bookings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        tour_id INT,
        participants INT DEFAULT 1,
        start_date DATE,
        total_price DECIMAL(10,2),
        status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
        special_requests TEXT,
        payment_method ENUM('card', 'cash', 'transfer') DEFAULT 'card',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE SET NULL
      )
    `);

    // Создаем таблицу отзывов
    await connection.query(`
      CREATE TABLE reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        tour_id INT,
        user_name VARCHAR(255),
        avatar VARCHAR(50) DEFAULT '👤',
        rating INT CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        likes INT DEFAULT 0,
        location VARCHAR(255),
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Tables created successfully');

    // Добавляем пользователей
    const users = [
      ['Администратор', 'admin@tourtohell.com', '$2a$12$K7TqXvU8yY5pWQ1Z9H8X4O9JkLmNnOpQrStUvWxYz', '+7 (999) 123-45-67', 'admin'],
      ['Иван Петров', 'ivan@example.com', '$2a$12$K7TqXvU8yY5pWQ1Z9H8X4O9JkLmNnOpQrStUvWxYz', '+7 (999) 765-43-21', 'user']
    ];

    for (const user of users) {
      await connection.query(
        'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
        user
      );
    }
    console.log(`✅ Added ${users.length} users`);

    // Добавляем туры
    const tours = [
      [1, 'Врата Ада', 'Пустыня Данакиль, Эфиопия', 'Самое жаркое место на Земле', 'Пустыня Данакиль считается одним из самых негостеприимных мест на планете...', 'Самое жаркое место на Земле', 250000, '7 дней', 6, 'extreme', 4.9, 24, '/assets/images/tours/danakil.jpg', 'Смертельный риск', 'world'],
      [2, 'Огненное кольцо', 'Камчатка, Россия', 'Действующие вулканы, гейзеры и долина смерти', 'Камчатка - край вулканов и гейзеров...', 'Действующие вулканы Камчатки', 180000, '10 дней', 8, 'hard', 4.8, 18, '/assets/images/tours/kamchatka.jpg', 'Опасно для жизни', 'russia'],
      [3, 'Проклятие Анд', 'Перу', 'Затерянные города инков, шаманские ритуалы', 'Анды хранят множество тайн...', 'Мистика древних цивилизаций', 320000, '14 дней', 10, 'medium', 4.7, 15, '/assets/images/tours/peru.jpg', 'Мистика', 'world'],
      [4, 'Ледяной ад', 'Якутия, Россия', 'Путешествие на Полюс Холода. Оймякон - самое холодное обитаемое место на Земле.', 'Оймякон - самое холодное место на Земле...', 'Полюс холода Оймякон', 280000, '9 дней', 5, 'extreme', 4.9, 12, '/assets/images/tours/kamchatka-2.jpg', 'Смертельный холод', 'russia'],
      [5, 'Остров дракона', 'Комодо, Индонезия', 'Экспедиция к легендарным драконам Комодо', 'Остров Комодо - единственное место на Земле...', 'В поисках драконов', 350000, '12 дней', 8, 'medium', 4.8, 21, '/assets/images/tours/danakil.jpg', 'Опасная фауна', 'world'],
      [6, 'Призраки Чернобыля', 'Чернобыль, Украина', 'Запретная зона отчуждения', 'Чернобыльская зона отчуждения - самое загадочное место...', 'Зона отчуждения', 220000, '5 дней', 4, 'medium', 4.9, 32, '/assets/images/hero/hero-bg.jpg', 'Радиация', 'world']
    ];

    for (const tour of tours) {
      await connection.query(
        `INSERT INTO tours (id, title, location, description, full_description, short_desc, 
                           price, duration, max_group_size, difficulty, rating, reviews, 
                           image, badge, category) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        tour
      );
    }
    console.log(`✅ Added ${tours.length} tours`);

    // Добавляем изображения для туров
    const tourImages = [
      [1, '/assets/images/tours/danakil.jpg'],
      [1, '/assets/images/tours/kamchatka.jpg'],
      [1, '/assets/images/hero/hero-bg.jpg'],
      [2, '/assets/images/tours/kamchatka.jpg'],
      [2, '/assets/images/tours/kamchatka-2.jpg'],
      [2, '/assets/images/hero/hero-bg.jpg'],
      [3, '/assets/images/tours/peru.jpg'],
      [3, '/assets/images/hero/hero-bg.jpg'],
      [3, '/assets/images/tours/danakil.jpg'],
      [4, '/assets/images/tours/kamchatka-2.jpg'],
      [4, '/assets/images/hero/hero-bg.jpg'],
      [4, '/assets/images/tours/kamchatka.jpg'],
      [5, '/assets/images/tours/danakil.jpg'],
      [5, '/assets/images/hero/hero-bg.jpg'],
      [5, '/assets/images/tours/peru.jpg'],
      [6, '/assets/images/hero/hero-bg.jpg'],
      [6, '/assets/images/tours/kamchatka.jpg'],
      [6, '/assets/images/tours/peru.jpg']
    ];

    for (const img of tourImages) {
      await connection.query(
        'INSERT INTO tour_images (tour_id, image_url) VALUES (?, ?)',
        img
      );
    }
    console.log(`✅ Added ${tourImages.length} tour images`);

    // Добавляем даты для туров
    const tourDates = [
      [1, '15 июл'], [1, '10 авг'], [1, '5 сен'],
      [2, '20 июл'], [2, '15 авг'], [2, '10 сен'],
      [3, '5 авг'], [3, '2 сен'], [3, '28 сен'],
      [4, '10 янв'], [4, '5 фев'], [4, '1 мар'],
      [5, '20 авг'], [5, '15 сен'], [5, '10 окт'],
      [6, '25 июл'], [6, '20 авг'], [6, '15 сен']
    ];

    for (const date of tourDates) {
      await connection.query(
        'INSERT INTO tour_dates (tour_id, date) VALUES (?, ?)',
        date
      );
    }
    console.log(`✅ Added ${tourDates.length} tour dates`);

    // Добавляем отзывы
    const reviews = [
      [1, 'Дмитрий Волков', '👨‍🚀', 5, 'Это было невероятно! 50 градусов жары, запах серы, лавовое озеро прямо под ногами...', 24, 'Москва'],
      [2, 'Елена Смирнова', '🧗‍♀️', 5, 'Вулканы Камчатки — это мощь природы! Мы ночевали у кратера действующего вулкана...', 18, 'Санкт-Петербург'],
      [3, 'Максим Грозный', '🧔‍♂️', 4, 'Мачу-Пикчу впечатляет, но настоящая магия началась с шаманской церемонии...', 15, 'Екатеринбург'],
      [4, 'Анна Адская', '👩‍🎤', 5, '-60°C — это реально адский холод! Но организация на высоте...', 32, 'Новосибирск'],
      [5, 'Игорь Бесстрашный', '🧛‍♂️', 5, 'Драконы Комодо — не миф! Мы видели их в дикой природе...', 27, 'Краснодар'],
      [6, 'Ольга Экстремальная', '🧟‍♀️', 5, 'Зона отчуждения — место силы. Ночная прогулка по Припяти с дозиметром...', 21, 'Киев']
    ];

    for (let i = 0; i < reviews.length; i++) {
      const review = reviews[i];
      await connection.query(
        'INSERT INTO reviews (tour_id, user_name, avatar, rating, comment, likes, location) VALUES (?, ?, ?, ?, ?, ?, ?)',
        review
      );
    }
    console.log(`✅ Added ${reviews.length} reviews`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('📊 Tables created and populated:');
    console.log('   - users');
    console.log('   - tours');
    console.log('   - tour_images');
    console.log('   - tour_dates');
    console.log('   - reviews');
    
    await connection.end();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    if (connection) await connection.end();
    process.exit(1);
  }
};

seedDatabase();