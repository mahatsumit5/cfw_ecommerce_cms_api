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
const s3Bucket_1 = require("../utils/s3Bucket");
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = Number(req.query.limit) || 10;
        const data = yield (0, s3Bucket_1.getAllUploadedImages)(limit);
        return res.json({
            status: "success",
            images: data,
        });
    }
    catch (error) {
        next(error);
    }
}));
router.delete("/", s3Bucket_1.deleteS3BucketImage);
exports.default = router;
