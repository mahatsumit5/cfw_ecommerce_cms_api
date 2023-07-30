import { getAdminByEmail } from "../model/admin/adminModel.js";
import { decodeAccessJWT } from "../utils/jwt.js";

export const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    console.log(authorization);
    // get access jwt key form the fornt end
    // decode the JWT which tell key is valid and expired or not
    const decoded = await decodeAccessJWT(authorization);
    console.log(decoded);

    // extrat email andget get user by email
    if (decoded?.email) {
      // check if the user is active
      const user = await getAdminByEmail(decoded?.email);
      console.log(user);

      if (user?._id && user?.status === "active") {
        var { refreshJWT, password, ...rest } = user;
        password = undefined;
        refreshJWT = undefined;

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
      error.message = "jwt expired";
    }
    if (error.message.includes("invalid signature")) {
      error.statusCode = 401;
      error.message;
    }
    next(error);
  }
};
