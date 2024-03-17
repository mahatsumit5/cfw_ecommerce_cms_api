import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  status: string;
  fName: string;
  lName: string;
  phone?: string;
  email: string;
  password: string | undefined;
  isVerified: boolean;
  verificationCode: string | null;
  refreshJWT: string | undefined;
  address?: string;
  profile: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
const adminSchema = new mongoose.Schema<IUser>(
  {
    status: {
      type: String,
      default: "inactive",
    },
    fName: {
      type: String,
      required: true,
    },

    lName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: false,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: 1,
    },

    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: "",
    },
    refreshJWT: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },
    profile: {
      type: String,
      default:
        "https://cfw-image-bucket.s3.ap-southeast-2.amazonaws.com/default.jpg",
    },
  },
  { timestamps: true }
);
export default mongoose.model("admin", adminSchema);
