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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshJWT = exports.createRefreshJWT = exports.verifyAccessJWT = exports.createAccessJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sessionModel_1 = require("../model/session/sessionModel");
const adminModel_1 = require("../model/admin/adminModel");
const createAccessJWT = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_ACCESS_SECRET, {
            expiresIn: "1d",
        });
        yield (0, sessionModel_1.insertNewSession)({ token, associate: email });
        return token;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.createAccessJWT = createAccessJWT;
const verifyAccessJWT = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
};
exports.verifyAccessJWT = verifyAccessJWT;
const createRefreshJWT = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshJWT = jsonwebtoken_1.default.sign({ email }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "10d",
    });
    yield (0, adminModel_1.getAdminByEmailandUpdate)({ email }, { refreshJWT });
    return refreshJWT;
});
exports.createRefreshJWT = createRefreshJWT;
const verifyRefreshJWT = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
};
exports.verifyRefreshJWT = verifyRefreshJWT;
