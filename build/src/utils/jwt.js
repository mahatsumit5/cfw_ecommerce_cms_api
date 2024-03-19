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
const createAccessJWT = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "15m",
    });
    yield (0, sessionModel_1.insertNewSession)({ token, associate: email });
    return token;
});
exports.createAccessJWT = createAccessJWT;
const verifyAccessJWT = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
};
exports.verifyAccessJWT = verifyAccessJWT;
const createRefreshJWT = (email) => {
    const refreshJWT = jsonwebtoken_1.default.sign({ email }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "30d",
    });
    return refreshJWT;
};
exports.createRefreshJWT = createRefreshJWT;
const verifyRefreshJWT = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
};
exports.verifyRefreshJWT = verifyRefreshJWT;
