import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    associate: {
      type: String,
      required: true,
      default: "",
    },
  },
  { timestamps: true }
);
export default mongoose.model("session", sessionSchema); ///sessions
