import mongoose from "mongoose";

export const mongoConnect = async () => {
  const URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/CFW_store";
  try {
    const conn = await mongoose.connect(URI);
    // const conn = await mongoose.connect(process.env.MONGO_URI);
    conn && console.log("Mongo Db is Connected");
  } catch (error) {
    console.log(error);
  }
};
