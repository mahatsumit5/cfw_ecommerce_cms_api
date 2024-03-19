import mongoose, { Schema } from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      required: true,
      unique: true,
    },
    stripeId: {
      type: String,
      required: true,
      unique: true,
      index: 1,
    },
    orderItems: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "products",
        },
        title: {
          type: String,
          required: true,
        },

        orderQty: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          required: false,
        },

        color: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        thumbnail: {
          type: String,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      default: "pending",
    },
    total_details: {
      amount_discount: Number,
      amount_shipping: Number,
      amount_tax: Number,
      amount_subtotal: Number,
      amount_total: Number,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    address: {
      city: { type: String },
      country: { type: String },
      line1: { type: String },
      line2: { type: String, default: null },
      postal_code: { type: String },
      state: { type: String },
    },
  },
  { timestamps: true }
);
export default mongoose.model("Order", orderSchema); //Users
