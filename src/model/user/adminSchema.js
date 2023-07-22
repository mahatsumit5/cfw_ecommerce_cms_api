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
    isVerfied: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },
    profile: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
export default mongoose.model("admin", adminSchema);
