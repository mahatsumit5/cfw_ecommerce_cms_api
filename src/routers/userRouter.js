import express from "express";
const router = express.Router();
import { findUserByEmail, insertUser } from "../model/user/userModel.js";
import { checkPassword, hashPassword } from "../utils/bcrypt.js";
router.post("/", async (req, res) => {
  try {
    req.body.password = hashPassword(req.body.password);
    const user = await insertUser(req.body);
    user?._id
      ? res.json({
          status: "success",
          message: "Account Created Successfully",
        })
      : res.json({
          status: "error",
          message: "Try again",
        });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      return res.json({
        status: "error",
        message: "An account already exist with this email.Please try another.",
      });
    }
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
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
