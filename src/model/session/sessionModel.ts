import { createSessionParams } from "../../types";
import sessionSchema from "./sessionSchema";

export const insertNewSession = (obj: createSessionParams) => {
  return new sessionSchema(obj).save();
};

export const findOneByFilterAndDelete = (filter: {
  associate: string;
  token: string;
}) => {
  return sessionSchema.findOneAndDelete(filter);
};

export const CheckToken = (filter: { associate: string; token: string }) => {
  console.log(filter);
  return sessionSchema.findOne(filter);
};
export const findOneAndDelete = (token: { token: string }) => {
  return sessionSchema.findOneAndDelete(token);
};
