import mongoose, { Document } from "mongoose";

export interface InterfaceSession extends Document {
  _id: string;
  token: string;
  associate: string;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
}
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
