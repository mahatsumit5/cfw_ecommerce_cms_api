// import
import jwt from "jsonwebtoken";
import { insertNewSession } from "../model/session/sessionModel.js";
import {
  getAdminByEmailandUpdate,
  updateById,
} from "../model/admin/adminModel.js";
export const createWebToken = async (email) => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1m",
  });

  await insertNewSession({ token, associate: email });
  return token;
};
export const createRefreshToken = async (email) => {
  const refreshToken = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "1m",
  });

  const upadatedUSer = await getAdminByEmailandUpdate(
    { email },
    { refreshJWT: refreshToken }
  );
  return refreshToken;
};
