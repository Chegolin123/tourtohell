const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkTable() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tourtohell'
  });

  try {
    console.log('🔍 Checking database...');
    
    const [tables] = await pool.query('SHOW TABLES');
    console.log('\n📊 Existing tables:');
    tables.forEach(table => {
      console.log(`   - ${Object.values(table)[0]}`);
    });

    const [rows] = await pool.query("SHOW TABLES LIKE 'bookings'");
    if (rows.length > 0) {
      console.log('\n✅ Table "bookings" exists');
      
      const [columns] = await pool.query('DESCRIBE bookings');
      console.log('\n📋 Table structure:');
      columns.forEach(col => {
        console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''} ${col.Default ? 'DEFAULT ' + col.Default : ''}`);
      });
      
      const [count] = await pool.query('SELECT COUNT(*) as total FROM bookings');
      console.log(`\n📊 Total records: ${count[0].total}`);
      
    } else {
      console.log('\n❌ Table "bookings" does not exist');
      console.log('\n🔨 Creating table "bookings"...');
      
      await pool.query(`
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
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Table "bookings" created successfully');
    }
    
    // Проверяем подключение к bookings API
    console.log('\n🔍 Testing database connection...');
    const [testResult] = await pool.query('SELECT 1+1 as result');
    console.log(`✅ Database connection OK: 1+1 = ${testResult[0].result}`);
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

checkTable();