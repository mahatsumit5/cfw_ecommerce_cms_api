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
const express_1 = require("express");
const S3multerMiddleware_1 = require("../middleware/S3multerMiddleware");
const router = (0, express_1.Router)();
router.post("/", S3multerMiddleware_1.upload.single("image"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req === null || req === void 0 ? void 0 : req.file) {
            const file = req.file;
            res.json({
                status: "success",
                message: "Upload Successfull",
                location: file.location,
            });
        }
        else {
            return res.json({
                status: "error",
                message: "File must be provided",
            });
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
