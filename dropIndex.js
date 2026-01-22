import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

const dropIndex = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    await db.collection('tours').dropIndex('email_1');
    console.log('Index email_1 dropped from tours collection');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error dropping index:', error);
  }
};

dropIndex();