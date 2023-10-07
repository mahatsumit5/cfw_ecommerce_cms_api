import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
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
