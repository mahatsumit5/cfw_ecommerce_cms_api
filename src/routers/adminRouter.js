import express from "express";
const router = express.Router();
import { addAdmin, getAdminByEmail } from "../model/user/adminModel.js";
import { checkPassword, hashPassword } from "../utils/bcrypt.js";
import { newAdminValidation } from "../middleware/joiValidation.js";
import { accountVerificationEmail } from "../utils/nodeMailer.js";
import { v4 as uuidv4 } from "uuid";
// create new admin
router.post("/", newAdminValidation, async (req, res, next) => {
  try {
    req.body.password = hashPassword(req.body.password);
    req.body.verificationCode = uuidv4();
    const user = await addAdmin(req.body);
    if (user?._id) {
      res.json({
        status: "success",
        message: "Account Created.Verify your Email.",
      });
      const link = `${process.env.WEB_DOMAIN}/admin-verification?c=${user.verificationCode}&&e=${user.email}`;
      await accountVerificationEmail({ user, link });
      return;
    }

    // res.json({
    //   status: "error",
    //   message: "Account Creating not Successfull",
    // });
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

export default router;
