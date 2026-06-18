const mongoose = require('mongoose');

async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🟢 MongoDB connected:', process.env.MONGO_URI);
  } catch (err) {
    console.error('🔴 MongoDB connection failed:', err.message);
    console.error('   Make sure MongoDB is running: mongod');
    process.exit(1);
  }
}

module.exports = connectMongo;

