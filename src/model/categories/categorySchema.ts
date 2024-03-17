import mongoose, { Document, Schema } from "mongoose";

export interface InterfaceCategory extends Document {
  _id: string;
  status: "inactive" | "active";
  title: string;
  slug: string;
  image: string;
  parentCategory: Schema.Types.ObjectId;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
}
const categorySchema = new mongoose.Schema<InterfaceCategory>(
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
