import express from "express";
const router = express.Router();
import {
  addAdmin,
  getAdminByEmail,
  updateById,
} from "../model/user/adminModel.js";
import { checkPassword, hashPassword } from "../utils/bcrypt.js";
import { newAdminValidation } from "../middleware/joiValidation.js";
import {
  accountVerificationEmail,
  accountVerifiedEmail,
} from "../utils/nodeMailer.js";
import { v4 as uuidv4 } from "uuid";
// create new admin
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

// login Admin
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await getAdminByEmail(email);
  if (user?._id) {
    const passwordMatched = checkPassword(password, user.password);
    if (passwordMatched) {
      user.password = undefined;
      return res.json({
        status: "success",
        message: `Welcome Back ${user.fName} ${user.lName}`,
        user,
      });
    }
    return res.json({
      status: "warning",
      message: "Password Do Not Match",
    });
  }
  res.json({
    status: "error",
    message: "Invalid Email or Password!",
  });
});
router.put("/verify", async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const user = await getAdminByEmail(email);
    if (user) {
      if (user?.isVerified) {
        await accountVerifiedEmail(user);
        throw new Error("Already verified");
        return;
      }

      if (code === user?.verificationCode) {
        const result = await updateById(user?._id, {
          isVerified: true,
          verificationCode: "",
        });
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
});

export default router;
