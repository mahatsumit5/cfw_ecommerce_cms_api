import express from "express";
import {
  addAdmin,
  getAdmin,
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
  sendUserUpdateAlert,
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
import uploadFile, { deleteFile } from "../utils/s3Bucket.js";
const router = express.Router();

router.get("/", auth, async (req, res, next) => {
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
router.get("/get-admins", auth, async (req, res, next) => {
  try {
    const admins = await getAdmin();
    console.log(admins);
    res.json({
      status: "success",
      message: "userInfo",
      admins,
    });
  } catch (error) {
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
router.put("/", auth, upload.single("profile"), async (req, res, next) => {
  try {
    let passwordMatched;
    let result;
    const { ID, profile, password, email, ...rest } = req.body;
    if (req.file?.path) {
      const { Location } = await uploadFile(req.file);
      rest.profile = Location;
    }

    const user = await getAdminByEmail(email);
    if (ID) {
      const s3ImageKey = profile.slice(57);
      result = await updateUser({
        _id: ID,
        profile:
          "https://cfw-image-bucket.s3.ap-southeast-2.amazonaws.com/default.jpg",
      });
      s3ImageKey !== "default.jpg" && deleteFile(s3ImageKey);
    } else {
      passwordMatched = checkPassword(password, user.password);
    }

    if (passwordMatched) {
      const result = await updateUser(rest);

      result?._id
        ? res.json({
            status: "success",
            message: "User updated",
            imageToDelete: req.file.filename,
          })
        : res.json({
            status: "error",
            message: "error coming from model",
          });
      return;
    }
    result?._id
      ? res.json({
          status: "success",
          message: "Profile picture deleted",
        })
      : res.json({
          status: "error",
          message: "Incorrect password",
        });
  } catch (error) {
    next(error);
  }
});
router.put("/change-password", auth, async (req, res, next) => {
  try {
    console.log(req.body);
    const { newPassword, oldPassword } = req.body;
    const { email } = req.userInfo;
    const user = await getAdminByEmail(email);
    console.log(user);
    const isMatched = checkPassword(oldPassword, user.password);
    console.log(isMatched);
    if (isMatched) {
      const result = await updateById(user._id, { password: newPassword });
      await sendUserUpdateAlert(user);

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
      message: "Old Password does not matched with current password",
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
      message: "USER NOT FOUND",
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
      console.log(data);
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
      const result = await findOneByFilterAndDelete({
        associate: email,
        token: otp,
      });

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
  } catch (error) {
    next(error);
  }
});

export default router;
