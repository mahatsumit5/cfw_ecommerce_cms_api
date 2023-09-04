// import
import jwt from "jsonwebtoken";
import { insertNewSession } from "../model/session/sessionModel.js";
import { getAdminByEmailandUpdate } from "../model/admin/adminModel.js";

//// create accessJWT and store in session table: short live 15m
export const createAccessJWT = async (email) => {
  //expires every 5minutes
  const token = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "1m",
  });
  await insertNewSession({ token, associate: email });
  return token;
};

export const verifyAccessJWT = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};
//// create refreshJWT and store with user data in user table: long live 30d

export const createRefreshJWT = async (email) => {
  ///expires every 30days
  const refreshJWT = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });

  const upadatedUSer = await getAdminByEmailandUpdate(
    { email },
    { refreshJWT }
  );
  return refreshJWT;
};

export const verifyRefreshJWT = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};
