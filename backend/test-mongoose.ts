import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.DATABASE_URL as string)
  .then(() => {
    console.log('Mongoose connected successfully!');
  })
  .catch((err) => {
    console.error('Mongoose connection failed:', err);
  });
