import mongoose from "mongoose";

export const mongoConnect = async () => {
  const URI = process.env.MONGO_URI as string;
  try {
    const conn = await mongoose.connect(URI);
  } catch (error) {
    console.log(error);
  }
};
