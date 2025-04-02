import mongoose from "mongoose";
import logger from "../utils/logger";

const connectDB = async (url: string) => {
  try {
    const conn = await mongoose.connect(url);

    logger.info("MongoDB Connected... to " + conn.connection.name);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

export default connectDB;
