import { createSessionParams } from "../../types";
import sessionSchema from "./sessionSchema";

export const insertNewSession = (obj: createSessionParams) => {
  return new sessionSchema(obj).save();
};

export const findOneByFilterAndDelete = (filter: object) => {
  return sessionSchema.findOneAndDelete(filter);
};
export const findOneAndDelete = (token: { token: string }) => {
  return sessionSchema.findOneAndDelete(token);
};
