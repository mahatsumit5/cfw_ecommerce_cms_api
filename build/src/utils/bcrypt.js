"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const salt = 10;
const hashPassword = (plainPassword) => {
    return bcryptjs_1.default.hashSync(plainPassword, salt);
};
exports.hashPassword = hashPassword;
const checkPassword = (plainPassword, userPassword) => {
    return bcryptjs_1.default.compareSync(plainPassword, userPassword);
};
exports.checkPassword = checkPassword;
