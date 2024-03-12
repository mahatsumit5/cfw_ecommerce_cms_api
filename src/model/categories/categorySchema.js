import mongoose, { Schema } from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
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
    image: {
      type: String,
      required: true,
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "ParentCategory",
      required: true,
    },
  },
  { timestamps: true }
);
const Category = mongoose.model("Category", categorySchema);
export default Category;
