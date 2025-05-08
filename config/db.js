const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    
    await mongoose.connect("mongodb+srv://anamaria:1xoclQQzQE1NaEFD@cluster0.jgpdxpp.mongodb.net/biblioteca?retryWrites=true&w=majority&appName=Cluster0");

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;