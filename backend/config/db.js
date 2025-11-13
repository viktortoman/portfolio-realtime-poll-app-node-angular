// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const host = process.env.MONGO_HOST;
    const port = process.env.MONGO_PORT;
    const dbName = process.env.MONGO_DB_NAME;

    if (!host || !port || !dbName) {
      throw new Error('Database connection environment variables are not defined.');
    }

    const mongoURI = `mongodb://${host}:${port}/${dbName}`;

    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;