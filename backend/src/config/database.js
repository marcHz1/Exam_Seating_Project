const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/exam_seating_system';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    logger.error(`Tried MongoDB URI: ${mongoUri}`);
    process.exit(1);
  }
};

module.exports = connectDB;
