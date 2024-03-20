import mongoose from "mongoose";

export const mongoConnect = async () => {
  const URI = process.env.MONGO_URI as string;
  console.log("the uri is ", URI);
  try {
    const conn = await mongoose.connect(URI);
  } catch (error) {
    console.log(error);
  }
};
