import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URL}/${process.env.DB_NAME}`
    );
    console.log(
      `Database connected to the host || ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`mongoDb connection error || ${error}`);
    process.exit(1);
  }
};

export { connectDB };
