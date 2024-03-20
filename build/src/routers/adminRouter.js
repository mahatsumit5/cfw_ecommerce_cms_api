"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const sessionModel_1 = require("../model/session/sessionModel");
const otpGenerator_1 = require("../middleware/otpGenerator");
const multerMiddleware_1 = require("../middleware/multerMiddleware");
const s3Bucket_1 = __importStar(require("../utils/s3Bucket"));
const router = express_1.default.Router();
router.get("/", authMiddleware_1.auth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({
            status: "success",
            message: "userInfo",
            user: req.userInfo,
        });
    }
    catch (error) {
        next(error);
    }
}));
router.get("/get-admins", authMiddleware_1.auth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
router.put("/", authMiddleware_1.auth, multerMiddleware_1.upload.single("profile"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let passwordMatched;
        let result;
        const _b = req.body, { ID, profile, password, email } = _b, rest = __rest(_b, ["ID", "profile", "password", "email"]);
        if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) {
            const data = yield (0, s3Bucket_1.default)(req.file);
            rest.profile = data === null || data === void 0 ? void 0 : data.Location;
        }
        const user = yield (0, adminModel_1.getAdminByEmail)(email);
        if (ID) {
            const s3ImageKey = profile.slice(57);
            result = yield (0, adminModel_1.updateUser)({
                _id: ID,
                profile: "https://cfw-image-bucket.s3.ap-southeast-2.amazonaws.com/default.jpg",
            });
            s3ImageKey !== "default.jpg" && (0, s3Bucket_1.deleteFile)(s3ImageKey);
        }
        else {
            passwordMatched = (0, bcrypt_1.checkPassword)(password, user === null || user === void 0 ? void 0 : user.password);
        }
        if (passwordMatched) {
            const result = yield (0, adminModel_1.updateUser)(rest);
            (result === null || result === void 0 ? void 0 : result._id)
                ? res.json({
                    status: "success",
                    message: "User updated",
                    imageToDelete: (req === null || req === void 0 ? void 0 : req.file) ? req.file.filename : "",
                })
                : res.json({
                    status: "error",
                    message: "error coming from model",
                });
            return;
        }
        (result === null || result === void 0 ? void 0 : result._id)
            ? res.json({
                status: "success",
                message: "Profile picture deleted",
            })
            : res.json({
                status: "error",
                message: "Incorrect password",
            });
    }
    catch (error) {
        next(error);
    }
}));
router.put("/change-password", authMiddleware_1.auth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield (0, adminModel_1.getAdminByEmail)(email);
        if (user === null || user === void 0 ? void 0 : user._id) {
            const passwordMatched = (0, bcrypt_1.checkPassword)(password, user.password);
            if (passwordMatched) {
                const accessJWT = yield (0, jwt_1.createAccessJWT)(email);
                const refreshJWT = (0, jwt_1.createRefreshJWT)(email);
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
        const { accessJWT, refreshJWT, _id } = req.body;
        yield (0, sessionModel_1.findOneAndDelete)(accessJWT);
        if (refreshJWT && _id) {
            const data = yield (0, adminModel_1.updateById)(_id, { refreshJWT: "" });
            console.log(data);
            (data === null || data === void 0 ? void 0 : data._id) &&
                res.json({
                    status: "success",
                });
        }
    }
    catch (error) {
        next(error);
    }
}));
router.post("/logoutUser", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accessJWT, refreshJWT } = req.body;
        yield (0, sessionModel_1.findOneAndDelete)(accessJWT);
        if (refreshJWT) {
            const data = yield (0, adminModel_1.updateByJWT)({ jwt: refreshJWT }, { refreshJWT: "" });
            (data === null || data === void 0 ? void 0 : data._id) &&
                res.json({
                    status: "success",
                });
        }
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
router.post("/change-password", authMiddleware_1.auth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
