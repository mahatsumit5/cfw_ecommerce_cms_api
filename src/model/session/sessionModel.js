import sessionSchema from "./sessionSchema.js";

export const insertNewSession = (obj) => {
  return sessionSchema(obj).save();
};
export const deleteSession = (obj) => {
  return sessionSchema.findOneAndDelete({ obj });
};
