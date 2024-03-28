import express from "express";
import {
  addAdmin,
  getAdmin,
  getAdminByEmail,
  updateById,
  updateUser,
  updateUserByJWT,
} from "../model/admin/adminModel";
import { checkPassword, hashPassword } from "../utils/bcrypt";
import {
  loginValidation,
  newAdminValidation,
  newAdminVerificationValidation,
} from "../middleware/joiValidation";
import {
  accountVerificationEmail,
  accountVerifiedEmail,
  sendOTPNotification,
  sendPassWordChangedAlert,
  sendUserUpdateAlert,
} from "../utils/nodeMailer";
import { v4 as uuidv4 } from "uuid";
import { createAccessJWT, createRefreshJWT } from "../utils/jwt";
import { auth, refreshAuth } from "../middleware/authMiddleware";
import {
  findOneAndDelete,
  findOneByFilterAndDelete,
  insertNewSession,
} from "../model/session/sessionModel";
import { generateOTP } from "../middleware/otpGenerator";
import { upload } from "../middleware/S3multerMiddleware";
import { IUser } from "../model/admin/adminSchema";
const router = express.Router();

router.get("/", auth, async (req, res, next) => {
  try {
    res.json({
      status: "success",
      message: "userInfo",
      user: req.userInfo, //comes from auth middleware
    });
  } catch (error: Error | any) {
    next(error);
  }
});
router.get("/get-admins", auth, async (req, res, next) => {
  try {
    const admins = await getAdmin();
    console.log(admins);
    res.json({
      status: "success",
      message: "userInfo",
      admins,
    });
  } catch (error: Error | any) {
    next(error);
  }
});
router.post("/", newAdminValidation, async (req, res, next) => {
  try {
    req.body.password = hashPassword(req.body.password);
    req.body.verificationCode = uuidv4();
    const user = await addAdmin(req.body);
    if (user?._id) {
      const link = `${process.env.WEB_DOMAIN}/admin-verification?c=${user.verificationCode}&e=${user.email}`;
      await accountVerificationEmail(user, link);
      console.log(link);
      return res.json({
        status: "success",
        message: "Account Created.Verify your Email.",
      });
    }
    res.json({
      status: "error",
      message: "Account Creating not Successfull",
    });
  } catch (error: Error | any) {
    if (error.message.includes("E11000 duplicate key error")) {
      error.statusCode = 400;
      error.message =
        "An account already exist with this email.Please try another.";
    }
    next(error);
  }
});
// update user
router.put(
  "/update-profile",
  auth,
  upload.single("profile"),
  async (req, res, next) => {
    try {
      const { password, email, ...rest } = req.body;
      if (!email || !password) {
        throw new Error("Email or password is required");
      }
      const user = await getAdminByEmail(email);
      if (!user) {
        throw new Error("No admin with this email found!");
      }
      const passwordMatch = checkPassword(password, user.password as string);
      if (passwordMatch) {
        if (req.file) {
          const location = req.file.location;
          rest.profile = location;
        }
        const result = await updateUser(rest);

        result?._id
          ? res.json({
              status: "success",
              message: "User updated",
            })
          : res.json({
              status: "error",
              message: "error coming from model",
            });
      } else {
        throw new Error("Incorrect password");
      }
    } catch (error: Error | any) {
      next(error);
    }
  }
);
router.put("/change-password", auth, async (req, res, next) => {
  try {
    const { newPassword, oldPassword } = req.body;
    const user = req.userInfo;

    const isMatched = checkPassword(oldPassword, user?.password || "");

    if (isMatched) {
      const result = await updateById(user?._id || "", {
        password: hashPassword(newPassword),
      });
      await sendUserUpdateAlert(user as IUser);

      result?._id
        ? res.json({
            status: "success",
            message: "Password changed successfully",
          })
        : res.json({
            status: "error",
            message: "Error occured while changing the password",
          });
      return;
    }
    res.json({
      status: "error",
      message: "Incorrect password",
    });
  } catch (error: Error | any) {
    next(error);
  }
});

// login Admin
router.post("/login", loginValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //find the user by email
    const user = await getAdminByEmail(email);
    if (user?._id) {
      //check the passwords
      const passwordMatched = checkPassword(password, user.password as string);
      //create 2 jwts:
      //access token for protected routes and refresh token to generate new access tokens after expiration of current one
      if (passwordMatched) {
        const accessJWT = await createAccessJWT(email);
        const refreshJWT = await createRefreshJWT(email);
        return res.json({
          status: "success",
          message: `Welcome Back ${user.fName} ${user.lName}`,
          token: { accessJWT, refreshJWT },
        });
      }
      return res.json({
        status: "warning",
        message: "Password Do Not Match",
      });
    }
    res.status(401).json({
      status: "error",
      message: "USER NOT FOUND",
    });
  } catch (error: Error | any) {
    next(error);
  }
});
router.put(
  "/verify",

  newAdminVerificationValidation,
  async (req, res, next) => {
    try {
      console.log(req.body);
      const { email, code } = req.body;
      const user = await getAdminByEmail(email);
      if (user) {
        if (user?.isVerified) {
          throw new Error("Already verified");
          return;
        }

        if (code === user?.verificationCode) {
          const result = await updateById(user?._id, {
            isVerified: true,
            verificationCode: "",
          });
          await accountVerifiedEmail(user);

          result?._id
            ? res.json({
                status: "success",
                message: "Account Verified",
              })
            : next(Error);
          return;
        }
        res.json({
          status: "info",
          message: "Invalid Code",
        });
        return;
      }
      res.json({
        status: "error",
        message: "Email not found",
      });
    } catch (error: Error | any) {
      next: error;
    }
  }
);

router.get("/get-accessjwt", refreshAuth);

router.post("/logout", async (req, res, next) => {
  try {
    const { accessJWT, refreshJWT } = req.body;
    if (!accessJWT || !refreshJWT) {
      return res.status(400).json({
        status: "error",
        message: "Token is required!",
      });
    }
    await findOneAndDelete(accessJWT);

    const user = await updateUserByJWT({
      refreshJwt: refreshJWT,
      updateData: { refreshJWT: "" },
    });

    user?._id
      ? res.json({
          status: "success",
          message: "Logged out successfully!",
        })
      : res.status(401).json({
          status: "error",
          message: "Something went wrong while logging out",
        });
  } catch (error: Error | any) {
    next(error);
  }
});

router.post("/request-otp", async (req, res, next) => {
  try {
    const user = await getAdminByEmail(req.body.email);

    if (user?._id) {
      const otp = generateOTP();
      if (otp) {
        const obj = {
          token: otp,
          associate: req.body.email,
        };
        const result = await insertNewSession(obj);

        if (result._id) {
          await sendOTPNotification(user, otp);
        }
      }
    }

    res.json({
      status: "success",
      message: "Check your email for verfication code",
    });
  } catch (error: Error | any) {
    next(error);
  }
});
router.post("/verify-otp", async (req, res, next) => {
  console.log(req.body);
  const { email, otp } = req.body;
  // const temporaryToken = await createAccessJWT(email);
  const tokenMatch = await findOneByFilterAndDelete({
    associate: email,
    token: otp,
  });
  if (tokenMatch?._id) {
    return res.status(201).json({
      status: "success",
      message: `Your token is verified`,
      token: { accessJWT: await createAccessJWT(email) },
    });
  } else {
    res.status(401).json({
      status: "failure",
      message: "wrong otp provided",
    });
  }
});

router.post("/change-password", auth, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await getAdminByEmail(email);
    const newPassword = hashPassword(password);
    if (user?._id) {
      const isUpdated = await updateById(user._id, { password: newPassword });
      if (isUpdated?._id) {
        await sendPassWordChangedAlert(user);
        return res.json({
          status: "success",
          message: "password has been updated",
        });
      } else {
        res.json({
          status: "error",
          message: "error while updating password",
        });
      }
    }
  } catch (err: Error | any) {
    next(err);
  }
});

export default router;
