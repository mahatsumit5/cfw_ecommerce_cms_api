import { Schema, model } from "mongoose";

const mainCatSchema = new Schema(
  {
    status: {
      type: String,

      required: true,
      default: "active",
    },
    title: {
      type: String,
      required: true,
      unique: true,
      index: 1,
    },
    slug: {
      type: String,
      unique: true,
      index: 1,
      required: true,
    },
  },
  { timestamps: true }
);
const ParentCategory = model("ParentCategory", mainCatSchema);
export default ParentCategory;
