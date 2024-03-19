"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOneAndDelete = exports.findOneByFilterAndDelete = exports.insertNewSession = void 0;
const sessionSchema_1 = __importDefault(require("./sessionSchema"));
const insertNewSession = (obj) => {
    return new sessionSchema_1.default(obj).save();
};
exports.insertNewSession = insertNewSession;
const findOneByFilterAndDelete = (filter) => {
    return sessionSchema_1.default.findOneAndDelete(filter);
};
exports.findOneByFilterAndDelete = findOneByFilterAndDelete;
const findOneAndDelete = (token) => {
    return sessionSchema_1.default.findOneAndDelete(token);
};
exports.findOneAndDelete = findOneAndDelete;
