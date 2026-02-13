import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongodb connected successfully`);
  } catch (error) {
    console.error("Mongodb connection error:", error.message);
  }
};
export default connectDB;
