import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("mongodb connection successful");
  } catch (error) {
    console.log("error in connecting to mongodb");
  }
};

export default connectToMongoDB;
