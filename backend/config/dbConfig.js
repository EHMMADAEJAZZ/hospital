import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
const URL = process.env.MONGO_URL.replace(
  '<db_password>',
  process.env.MONGO_PASSWORD
);
// console.log(URL);

const dbConnect = async () => {
  try {
    const dbconnection = await mongoose.connect(URL, {
      dbName: 'hospital',
    });
    console.log(
      `MongoDB Connection Success HOST!! ${dbconnection.connection.host}`
    );
  } catch (error) {
    console.log(`MONGODB CONNECTION FAILED ${error.message}`);
    process.exit(1);
  }
};

export default dbConnect;
