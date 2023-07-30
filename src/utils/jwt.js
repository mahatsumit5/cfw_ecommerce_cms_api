// import
import jwt from "jsonwebtoken";
import { insertNewSession } from "../model/session/sessionModel.js";
import {
  getAdminByEmailandUpdate,
  updateById,
} from "../model/admin/adminModel.js";
export const createWebToken = async (email) => {
  //expires every 15minutes
  const token = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });

  await insertNewSession({ token, associate: email });
  return token;
};
export const createRefreshToken = async (email) => {
  ///expires every 30days
  const refreshToken = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });

  const upadatedUSer = await getAdminByEmailandUpdate(
    { email },
    { refreshJWT: refreshToken }
  );
  return refreshToken;
};

export const decodeAccessJWT = async (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};
