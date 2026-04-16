const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tourtohell',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    console.log(`📊 Database: ${process.env.DB_NAME || 'tourtohell'}`);
    
    // Проверяем наличие таблицы users и создаем если нет
    await createTablesIfNotExist(connection);
    
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection error:', error);
    console.error('💡 Make sure MySQL is running and database exists');
    return false;
  }
};

const createTablesIfNotExist = async (connection) => {
  try {
    // Создаем таблицу users если не существует
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
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
    console.log('✅ Users table ready');

    // Создаем таблицу tours если не существует
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tours (
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
    console.log('✅ Tours table ready');

    // Создаем таблицу bookings если не существует
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        tour_id INT,
        tour_name VARCHAR(255),
        participants INT DEFAULT 1,
        preferred_date DATE,
        message TEXT,
        status ENUM('new', 'processing', 'confirmed', 'cancelled') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Bookings table ready');

    // Создаем таблицу reviews если не существует
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_name VARCHAR(255) NOT NULL,
        user_id INT,
        avatar VARCHAR(50) DEFAULT '👤',
        rating INT CHECK (rating >= 1 AND rating <= 5),
        tour_id INT,
        tour_name VARCHAR(255),
        comment TEXT,
        likes INT DEFAULT 0,
        location VARCHAR(255),
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Reviews table ready');

    // Создаем таблицу contacts если не существует
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        tour_id INT,
        tour_name VARCHAR(255),
        participants INT DEFAULT 1,
        preferred_date DATE,
        message TEXT,
        status ENUM('new', 'processing', 'completed') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Contacts table ready');

  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

module.exports = { pool, connectDB };