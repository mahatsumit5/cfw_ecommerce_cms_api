"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminModel_1 = require("../model/admin/adminModel");
const bcrypt_1 = require("../utils/bcrypt");
const joiValidation_1 = require("../middleware/joiValidation");
const nodeMailer_1 = require("../utils/nodeMailer");
const uuid_1 = require("uuid");
const jwt_1 = require("../utils/jwt");
const authMiddleware_1 = require("../middleware/authMiddleware");
const express_openid_connect_1 = require("express-openid-connect");
const sessionModel_1 = require("../model/session/sessionModel");
const otpGenerator_1 = require("../middleware/otpGenerator");
const S3multerMiddleware_1 = require("../middleware/S3multerMiddleware");
const router = express_1.default.Router();
router.get("/", (0, express_openid_connect_1.requiresAuth)(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.oidc.user;
        res.json({
            status: "success",
            message: "userInfo",
            user: req.oidc.user,
        });
    }
    catch (error) {
        next(error);
    }
}));
router.get("/get-admins", (0, express_openid_connect_1.requiresAuth)(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield (0, adminModel_1.getAdmin)();
        console.log(admins);
        res.json({
            status: "success",
            message: "userInfo",
            admins,
        });
    }
    catch (error) {
        next(error);
    }
}));
router.post("/", joiValidation_1.newAdminValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.password = (0, bcrypt_1.hashPassword)(req.body.password);
        req.body.verificationCode = (0, uuid_1.v4)();
        const user = yield (0, adminModel_1.addAdmin)(req.body);
        if (user === null || user === void 0 ? void 0 : user._id) {
            const link = `${process.env.WEB_DOMAIN}/admin-verification?c=${user.verificationCode}&e=${user.email}`;
            yield (0, nodeMailer_1.accountVerificationEmail)(user, link);
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
    }
    catch (error) {
        if (error.message.includes("E11000 duplicate key error")) {
            error.statusCode = 400;
            error.message =
                "An account already exist with this email.Please try another.";
        }
        next(error);
    }
}));
router.put("/update-profile", (0, express_openid_connect_1.requiresAuth)(), S3multerMiddleware_1.upload.single("profile"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { password, email } = _a, rest = __rest(_a, ["password", "email"]);
        if (!email || !password) {
            throw new Error("Email or password is required");
        }
        const user = yield (0, adminModel_1.getAdminByEmail)(email);
        if (!user) {
            throw new Error("No admin with this email found!");
        }
        const passwordMatch = (0, bcrypt_1.checkPassword)(password, user.password);
        if (passwordMatch) {
            if (req.file) {
                const file = req.file;
                rest.profile = file.location;
            }
            const result = yield (0, adminModel_1.updateUser)(rest);
            (result === null || result === void 0 ? void 0 : result._id)
                ? res.json({
                    status: "success",
                    message: "User updated",
                })
                : res.json({
                    status: "error",
                    message: "error coming from model",
                });
        }
        else {
            throw new Error("Incorrect password");
        }
    }
    catch (error) {
        next(error);
    }
}));
router.put("/change-password", (0, express_openid_connect_1.requiresAuth)(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newPassword, oldPassword } = req.body;
        const user = req.userInfo;
        const isMatched = (0, bcrypt_1.checkPassword)(oldPassword, (user === null || user === void 0 ? void 0 : user.password) || "");
        if (isMatched) {
            const result = yield (0, adminModel_1.updateById)((user === null || user === void 0 ? void 0 : user._id) || "", {
                password: (0, bcrypt_1.hashPassword)(newPassword),
            });
            yield (0, nodeMailer_1.sendUserUpdateAlert)(user);
            (result === null || result === void 0 ? void 0 : result._id)
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
    }
    catch (error) {
        next(error);
    }
}));
router.post("/login", joiValidation_1.loginValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const user = yield (0, adminModel_1.getAdminByEmail)(email);
        if (user === null || user === void 0 ? void 0 : user._id) {
            const passwordMatched = (0, bcrypt_1.checkPassword)(password, user.password);
            if (passwordMatched) {
                const accessJWT = yield (0, jwt_1.createAccessJWT)(email);
                const refreshJWT = yield (0, jwt_1.createRefreshJWT)(email);
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
    }
    catch (error) {
        next(error);
    }
}));
router.put("/verify", joiValidation_1.newAdminVerificationValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { email, code } = req.body;
        const user = yield (0, adminModel_1.getAdminByEmail)(email);
        if (user) {
            if (user === null || user === void 0 ? void 0 : user.isVerified) {
                throw new Error("Already verified");
                return;
            }
            if (code === (user === null || user === void 0 ? void 0 : user.verificationCode)) {
                const result = yield (0, adminModel_1.updateById)(user === null || user === void 0 ? void 0 : user._id, {
                    isVerified: true,
                    verificationCode: "",
                });
                yield (0, nodeMailer_1.accountVerifiedEmail)(user);
                (result === null || result === void 0 ? void 0 : result._id)
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
    }
    catch (error) {
        next: error;
    }
}));
router.get("/get-accessjwt", authMiddleware_1.refreshAuth);
router.post("/logout", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accessJWT, refreshJWT } = req.body;
        if (!accessJWT || !refreshJWT) {
            return res.status(400).json({
                status: "error",
                message: "Token is required!",
            });
        }
        yield (0, sessionModel_1.findOneAndDelete)(accessJWT);
        const user = yield (0, adminModel_1.updateUserByJWT)({
            refreshJwt: refreshJWT,
            updateData: { refreshJWT: "" },
        });
        (user === null || user === void 0 ? void 0 : user._id)
            ? res.json({
                status: "success",
                message: "Logged out successfully!",
            })
            : res.status(401).json({
                status: "error",
                message: "Something went wrong while logging out",
            });
    }
    catch (error) {
        next(error);
    }
}));
router.post("/request-otp", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, adminModel_1.getAdminByEmail)(req.body.email);
        if (user === null || user === void 0 ? void 0 : user._id) {
            const otp = (0, otpGenerator_1.generateOTP)();
            if (otp) {
                const obj = {
                    token: otp,
                    associate: req.body.email,
                };
                const result = yield (0, sessionModel_1.insertNewSession)(obj);
                if (result._id) {
                    yield (0, nodeMailer_1.sendOTPNotification)(user, otp);
                }
            }
        }
        res.json({
            status: "success",
            message: "Check your email for verfication code",
        });
    }
    catch (error) {
        next(error);
    }
}));
router.post("/verify-otp", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { email, otp } = req.body;
    const tokenMatch = yield (0, sessionModel_1.findOneByFilterAndDelete)({
        associate: email,
        token: otp,
    });
    if (tokenMatch === null || tokenMatch === void 0 ? void 0 : tokenMatch._id) {
        return res.status(201).json({
            status: "success",
            message: `Your token is verified`,
            token: { accessJWT: yield (0, jwt_1.createAccessJWT)(email) },
        });
    }
    else {
        res.status(401).json({
            status: "failure",
            message: "wrong otp provided",
        });
    }
}));
router.post("/change-password", (0, express_openid_connect_1.requiresAuth)(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield (0, adminModel_1.getAdminByEmail)(email);
        const newPassword = (0, bcrypt_1.hashPassword)(password);
        if (user === null || user === void 0 ? void 0 : user._id) {
            const isUpdated = yield (0, adminModel_1.updateById)(user._id, { password: newPassword });
            if (isUpdated === null || isUpdated === void 0 ? void 0 : isUpdated._id) {
                yield (0, nodeMailer_1.sendPassWordChangedAlert)(user);
                return res.json({
                    status: "success",
                    message: "password has been updated",
                });
            }
            else {
                res.json({
                    status: "error",
                    message: "error while updating password",
                });
            }
        }
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
