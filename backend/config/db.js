const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const host = process.env.MONGO_HOST;
    const port = process.env.MONGO_PORT;
    const dbName = process.env.MONGO_DB_NAME;
    const user = process.env.MONGO_USER;
    const pass = process.env.MONGO_PASS;

    if (!host || !port || !dbName || !user || !pass) {
      throw new Error('Database connection environment variables are not defined.');
    }

    const mongoURI = `mongodb://${user}:${pass}@${host}:${port}/${dbName}?authSource=admin`;
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;