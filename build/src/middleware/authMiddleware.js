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
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAuth = exports.auth = void 0;
const adminModel_1 = require("../model/admin/adminModel");
const jwt_1 = require("../utils/jwt");
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        const decoded = (0, jwt_1.verifyAccessJWT)(authorization);
        if (decoded === null || decoded === void 0 ? void 0 : decoded.email) {
            const user = yield (0, adminModel_1.getAdminByEmail)(decoded.email);
            if ((user === null || user === void 0 ? void 0 : user._id) && (user === null || user === void 0 ? void 0 : user.status) === "active") {
                user.refreshJWT = undefined;
                req.userInfo = user;
                return next();
            }
        }
        res.status(401).json({
            status: "error",
            message: "Unauthorized access",
        });
    }
    catch (error) {
        if (error.message.includes("jwt expired")) {
            error.statusCode = 403;
            error.message = "Your token has expired. Please login Again";
        }
        if (error.message.includes("invalid signature")) {
            error.statusCode = 401;
            error.message = error.message;
        }
        next(error);
    }
});
exports.auth = auth;
const refreshAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        console.log("this is authprization from headers", authorization);
        const decoded = (0, jwt_1.verifyRefreshJWT)(authorization);
        console.log("This si decoded", decoded);
        if (decoded === null || decoded === void 0 ? void 0 : decoded.email) {
            const user = yield (0, adminModel_1.getOneAdmin)({
                email: decoded.email,
                refreshJWT: authorization,
            });
            console.log("this is user", user);
            if ((user === null || user === void 0 ? void 0 : user._id) && (user === null || user === void 0 ? void 0 : user.status) === "active") {
                const accessJWT = yield (0, jwt_1.createAccessJWT)(decoded.email);
                return res.json({
                    status: "success",
                    message: "Session expired!!.Please login Again.",
                    accessJWT,
                });
            }
        }
        res.status(401).json({
            status: "error",
            message: "Unauthorized",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.refreshAuth = refreshAuth;
