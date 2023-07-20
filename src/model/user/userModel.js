import userSchema from "./userSchema.js";

export const insertUser = (userObj) => {
  return userSchema(userObj).save();
};

export const findUserByEmail = (email) => {
  return userSchema.findOne({ email });
};
