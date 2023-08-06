import sessionSchema from "./sessionSchema.js";

export const insertNewSession = (obj) => {
  return sessionSchema(obj).save();
};
export const findOneAndDelete = (token) => {
  return sessionSchema.findOneAndDelete(token);
};
