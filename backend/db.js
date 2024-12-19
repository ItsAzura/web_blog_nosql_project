import mongoose from 'mongoose';

// Hàm này sẽ kết nối tới MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    if (!conn) {
      console.error('Failed to connect to MongoDB');
      process.exit(1);
    }

    console.log(`MongoDB Connected At ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
