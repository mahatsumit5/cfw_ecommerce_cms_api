import mongoose from "mongoose";

export const mongoConnect = async () => {
  const URI = process.env.MONGO_URI as string;
  try {
    const conn = await mongoose.connect(URI);
    conn && console.log("Mongo Db is Connected");
  } catch (error) {
    console.log(error);
  }
};
