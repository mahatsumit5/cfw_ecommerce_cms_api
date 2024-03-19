"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const imageFolderPath = "public/img/products/";
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imageFolderPath);
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + "-" + file.originalname;
        cb(null, fileName);
    },
});
exports.upload = (0, multer_1.default)({ storage });
