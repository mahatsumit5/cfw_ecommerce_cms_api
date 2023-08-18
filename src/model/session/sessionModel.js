import sessionSchema from "./sessionSchema.js";

export const insertNewSession = (obj) => {
  return sessionSchema(obj).save();
};

export const findOneByFilterAndDelete = (filter) => {
  console.log(filter);
  return sessionSchema.findOneAndDelete(filter);
};
export const findOneAndDelete = (token) => {
  return sessionSchema.findOneAndDelete(token);
};
