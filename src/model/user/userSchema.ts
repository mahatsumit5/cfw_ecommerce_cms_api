import { Schema, model } from "mongoose";

const customerSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: false, unique: true, default: "" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    photo: { type: String, required: true },
    favouriteItem: [
      {
        _id: { type: Schema.Types.ObjectId, required: false, unique: true },
        title: { type: String, required: true },
        slug: { type: String, required: true },
        price: { type: Number, required: true },
        sku: { type: String, required: true },
        thumbnail: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Customer = model("Customer", customerSchema); //get model from mongoose or create a new one if does not exist
export default Customer;
