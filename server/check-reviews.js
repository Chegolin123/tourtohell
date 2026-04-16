const mongoose = require('mongoose');
require('dotenv').config();

const checkReviews = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourtohell');
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Получаем список всех коллекций
    const collections = await db.listCollections().toArray();
    console.log('\n📚 Collections in database:');
    collections.forEach(c => console.log(`   - ${c.name}`));
    
    // Проверяем коллекцию reviews
    if (collections.find(c => c.name === 'reviews')) {
      const reviews = await db.collection('reviews').find().toArray();
      console.log(`\n📊 Total reviews: ${reviews.length}`);
      
      if (reviews.length > 0) {
        console.log('\n📝 Reviews:');
        reviews.forEach((review, index) => {
          console.log(`\n--- Review ${index + 1} ---`);
          console.log(`ID: ${review._id}`);
          console.log(`User: ${review.user}`);
          console.log(`Tour: ${review.tour}`);
          console.log(`Rating: ${review.rating}`);
          console.log(`Comment: ${review.comment?.substring(0, 100)}...`);
        });
      } else {
        console.log('\n❌ No reviews found in collection');
      }
    } else {
      console.log('\n❌ Collection "reviews" does not exist');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkReviews();