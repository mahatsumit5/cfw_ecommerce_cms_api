import mongoose, { Schema } from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("paymentOptions", paymentSchema);
