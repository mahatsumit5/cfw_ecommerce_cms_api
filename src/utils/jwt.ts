// import
import jwt from "jsonwebtoken";
import { insertNewSession } from "../model/session/sessionModel";
import { jwtReturnType } from "../types";

//// create accessJWT and store in session table: short live 15m
export const createAccessJWT = async (email: string) => {
  //expires every 5minutes
  const token = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "1m",
  });
  await insertNewSession({ token, associate: email });
  return token;
};

export const verifyAccessJWT = (token: string): jwtReturnType => {
  return jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET as string
  ) as jwtReturnType;
};
//// create refreshJWT and store with user data in user table: long live 30d

export const createRefreshJWT = (email: string): string => {
  ///expires every 30days
  const refreshJWT = jwt.sign(
    { email },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: "2m",
    }
  );

  // getAdminByEmailandUpdate({ email }, { refreshJWT });
  return refreshJWT;
};

export const verifyRefreshJWT = (token: string): jwtReturnType => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string
  ) as jwtReturnType;
};
