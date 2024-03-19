import { NextFunction, Request, Response } from "express";
import { getAdminByEmail, getOneAdmin } from "../model/admin/adminModel";
import {
  createAccessJWT,
  verifyAccessJWT,
  verifyRefreshJWT,
} from "../utils/jwt";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get access jwt key form the fornt end
    const { authorization } = req.headers;
    // decode the JWT which tell key is valid and expired or not
    const decoded = verifyAccessJWT(authorization as string);
    //decoded have three properties one of them being user email expiry data
    // extrat email and get get user by email
    if (decoded?.email) {
      // check if the user is active
      const user = await getAdminByEmail(decoded.email);
      if (user?._id && user?.status === "active") {
        user.refreshJWT = undefined;
        req.userInfo = user;

        return next();
      }
    }

    res.status(401).json({
      status: "error",
      message: "Unauthorized access",
    });
  } catch (error: Error | any) {
    if (error.message.includes("jwt expired")) {
      error.statusCode = 403;
      error.message = "Your token has expired. Please login Again";
    }
    if (error.message.includes("invalid signature")) {
      error.statusCode = 401;
      error.message = error.message;
    }
    next(error);
  }
};

export const refreshAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1.get  the refreshAuth
    const { authorization } = req.headers;
    console.log("this is authprization from headers", authorization);
    // 2.decode the jwt
    const decoded = verifyRefreshJWT(authorization as string);
    console.log("This si decoded", decoded);
    // 3. extract email and get user by email
    if (decoded?.email) {
      // 4. check fif the user is active
      const user = await getOneAdmin({
        email: decoded.email,
        refreshJWT: authorization,
      });
      console.log("this is user", user);
      if (user?._id && user?.status === "active") {
        // create new accessJWT
        const accessJWT = await createAccessJWT(decoded.email);
        return res.json({
          status: "success",
          message: "Session expired!!.Please login Again.",
          accessJWT,
        });
      }
    }
    res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  } catch (error) {
    next(error);
  }
};
