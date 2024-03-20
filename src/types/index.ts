import { IUser } from "../model/admin/adminSchema";

export type createSessionParams = {
  token: string;
  associate: string;
};
export type nodemailerParams = {
  email: string;
  fName: string;
  lName: string;
};
export type jwtReturnType =
  | { email: string; iat: number; exp: number }
  | undefined;

declare global {
  namespace Express {
    interface Request {
      userInfo?: IUser;
    }
  }
}
export interface CustomError extends Error {
  statusCode: number;
}
