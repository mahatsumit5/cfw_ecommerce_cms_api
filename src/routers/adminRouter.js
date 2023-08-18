import express from "express";
import {
  addAdmin,
  getAdminByEmail,
  updateById,
  updateByJWT,
  updateUser,
} from "../model/admin/adminModel.js";
import { checkPassword, hashPassword } from "../utils/bcrypt.js";
import {
  loginValidation,
  newAdminValidation,
  newAdminVerificationValidation,
} from "../middleware/joiValidation.js";
import {
  accountVerificationEmail,
  accountVerifiedEmail,
  sendOTPNotification,
  sendPassWordChangedAlert,
} from "../utils/nodeMailer.js";
import { v4 as uuidv4 } from "uuid";
import { createAccessJWT, createRefreshJWT } from "../utils/jwt.js";
import { auth, refreshAuth } from "../middleware/authMiddleware.js";
import {
  findOneAndDelete,
  findOneByFilterAndDelete,
  insertNewSession,
} from "../model/session/sessionModel.js";
import { generateOTP } from "../middleware/otpGenerator.js";
import { upload } from "../middleware/multerMiddleware.js";
const router = express.Router();

router.get("/", auth, (req, res, next) => {
  try {
    res.json({
      status: "success",
      message: "userInfo",
      user: req.userInfo, //comes from auth middleware
    });
  } catch (error) {
    next(error);
  }
});
router.post("/", auth, newAdminValidation, async (req, res, next) => {
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
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      error.statusCode = 400;
      error.message =
        "An account already exist with this email.Please try another.";
    }
    next(error);
  }
});
// update user
router.put("/", upload.single("profile"), async (req, res, next) => {
  try {
    const { value } = req.body;
    if (req.file?.path) {
      req.body.profile = req.file.path;
    }
    const obj = {
      _id: value,
      profile:
        "public/img/products/1692020245570-ben-sweet-2LowviVHZ-E-unsplash (1).jpg",
    };
    const result = value ? await updateUser(obj) : await updateUser(req.body);
    result?._id
      ? res.json({
          status: "success",
          message: "User updated",
        })
      : res.json({
          status: "error",
          message: "error coming from model",
        });
  } catch (error) {
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
      const passwordMatched = checkPassword(password, user.password);
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
      message: "Invalid Email or Password!",
    });
  } catch (error) {
    next(error);
  }
});
router.put(
  "/verify",
  newAdminVerificationValidation,
  async (req, res, next) => {
    try {
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
            : next(error);
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
    } catch (error) {
      next(error);
    }
  }
);

router.get("/get-accessjwt", refreshAuth);
router.post("/logout", async (req, res, next) => {
  try {
    const { accessJWT, refreshJWT, _id } = req.body;
    await findOneAndDelete(accessJWT);

    if (refreshJWT && _id) {
      const data = await updateById(_id, { refreshJWT: "" });
      data?._id &&
        res.json({
          status: "success",
        });
    }
  } catch (error) {
    next(error);
  }
});
router.post("/logoutUser", async (req, res, next) => {
  try {
    const { accessJWT, refreshJWT } = req.body;
    await findOneAndDelete(accessJWT);

    if (refreshJWT) {
      const data = await updateByJWT({ refreshJWT }, { refreshJWT: "" });
      data?._id &&
        res.json({
          status: "success",
        });
    }
  } catch (error) {
    next(error);
  }
});
router.post("/request-otp", async (req, res, next) => {
  try {
    const user = await getAdminByEmail(req.body.email);
    if (user) {
      if (user?._id) {
        const otp = generateOTP();
        if (otp) {
          const obj = {
            token: otp,
            associate: req.body.email,
          };
          const result = await insertNewSession(obj);

          if (result._id) {
            console.log("new result inserted");
            await sendOTPNotification(user, otp);
          }
        }
      }
    }
    res.json({
      status: "success",
      message: "Check your email for verfication code",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/change-password", async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    const user = await getAdminByEmail(email);
    const newPassword = hashPassword(password);
    if (user?._id) {
      console.log(user);
      const result = await findOneByFilterAndDelete({
        associate: email,
        token: otp,
      });
      if (result?._id) {
        console.log(result);

        const isUpdated = await updateById(user._id, { password: newPassword });
        if (isUpdated) {
          await sendPassWordChangedAlert(user);
          return res.json({
            status: "success",
            message: "password has been updated",
          });
        }

        res.json({
          status: "error",
          message: "error while updating password",
        });
        return;
      }
    }
    res.json({
      status: "error",
      message: "not successfull",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
