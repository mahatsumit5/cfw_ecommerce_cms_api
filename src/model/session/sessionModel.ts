import sessionSchema from "./sessionSchema";

export const insertNewSession = (obj) => {
  return sessionSchema(obj).save();
};

export const findOneByFilterAndDelete = (filter) => {
  return sessionSchema.findOneAndDelete(filter);
};
export const findOneAndDelete = (token) => {
  return sessionSchema.findOneAndDelete(token);
};
