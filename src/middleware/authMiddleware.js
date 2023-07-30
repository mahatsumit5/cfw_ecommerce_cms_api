import { getAdminByEmail, getOneAdmin } from "../model/admin/adminModel.js";
import {
  createAccessJWT,
  verifyAccessJWT,
  verifyRefreshJWT,
} from "../utils/jwt.js";

export const auth = async (req, res, next) => {
  try {
    // get access jwt key form the fornt end
    const { authorization } = req.headers;
    // decode the JWT which tell key is valid and expired or not
    const decoded = verifyAccessJWT(authorization);
    //decoded have three properties one of them being user email
    // extrat email and get get user by email
    if (decoded?.email) {
      // check if the user is active
      const user = await getAdminByEmail(decoded.email);
      if (user?._id && user?.status === "active") {
        user.password = undefined;
        user.refreshJWT = undefined;
        req.userInfo = user;
        return next();
      }
    }

    res.status(401).json({
      status: "error",
      message: "Unauthorized access",
    });
  } catch (error) {
    if (error.message.includes("jwt expired")) {
      error.statusCode = 403;
      error.message = error.message;
    }
    if (error.message.includes("invalid signature")) {
      error.statusCode = 401;
      error.message = error.message;
    }
    next(error);
  }
};

export const refreshAuth = async (req, res, next) => {
  try {
    // 1.get  the refreshAuth
    const { authorization } = req.headers;
    // 2.decode the jwt
    const decoded = verifyRefreshJWT(authorization);
    // 3. extract email and get user by email
    if (decoded?.email) {
      // 4. check fif the user is active
      const user = await getOneAdmin({
        email: decoded.email,
        refreshJWT: authorization,
      });
      if (user?._id && user?.status === "active") {
        // create new accessJWT
        const accessJWT = await createAccessJWT(decoded.email);
        return res.json({
          status: "success",
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
