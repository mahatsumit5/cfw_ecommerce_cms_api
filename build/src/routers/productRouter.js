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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const slugify_1 = __importDefault(require("slugify"));
const fs_1 = __importDefault(require("fs"));
const productModel_1 = require("../model/product/productModel");
const joiValidation_1 = require("../middleware/joiValidation");
const multerMiddleware_1 = require("../middleware/multerMiddleware");
const s3Bucket_1 = __importStar(require("../utils/s3Bucket"));
const router = express_1.default.Router();
router.post("/", multerMiddleware_1.upload.array("images", 5), joiValidation_1.newProductValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const files = req.files;
        const img = files === null || files === void 0 ? void 0 : files.map((item) => item.filename);
        if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.length) {
            const arg = files.map((element) => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield (0, s3Bucket_1.default)(element);
                return data === null || data === void 0 ? void 0 : data.Location;
            }));
            req.body.images = yield Promise.all(arg);
        }
        req.body.thumbnail = req.body.images[0];
        req.body.slug = (0, slugify_1.default)(req.body.title, { lower: true, trim: true });
        const result = yield (0, productModel_1.addProduct)(req.body);
        (result === null || result === void 0 ? void 0 : result._id)
            ? res.json({
                status: "success",
                message: "New product Sucessfully added",
                imagesToDelete: img,
            })
            : res.json({
                status: "error",
                message: "Unable to add new category",
            });
    }
    catch (error) {
        if (error.message.includes("E11000 duplicate key error")) {
            error.statusCode = 200;
            error.message = "This slug is already avilable in the database.";
        }
        next(error);
    }
}));
router.get("/:_id?", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const result = _id ? yield (0, productModel_1.getProductById)(_id) : yield (0, productModel_1.getProducts)();
        res.json({
            status: "success",
            message: "Results received",
            result,
        });
    }
    catch (error) {
        next(error);
    }
}));
router.put("/", multerMiddleware_1.upload.array("images", 5), joiValidation_1.updateProductValidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const files = req.files;
        const { _id, images } = req.body;
        if ((_b = req.files) === null || _b === void 0 ? void 0 : _b.length) {
            const product = yield (0, productModel_1.getProductById)(_id);
            if (product === null || product === void 0 ? void 0 : product.images) {
                for (let i = 0; i < product.images.length; i++) {
                    if (images.indexOf(product.images[i]) === -1) {
                        (0, s3Bucket_1.deleteFile)(product.images[i].slice(57));
                    }
                }
            }
            const newImages = files.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield (0, s3Bucket_1.default)(item);
                return data === null || data === void 0 ? void 0 : data.Location;
            }));
            req.body.images = [
                ...req.body.images,
                ...(yield Promise.all(newImages)),
            ];
        }
        const result = yield (0, productModel_1.updateProductById)(req.body);
        (result === null || result === void 0 ? void 0 : result._id)
            ? res.json({
                status: "success",
                message: "updated Successfull",
                imagesToDelete: files.map((item) => item),
            })
            : res.json({
                status: "error",
                message: "Unable to update.",
            });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
router.delete("/:_id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const data = yield (0, productModel_1.getProductById)(_id);
        data === null || data === void 0 ? void 0 : data.images.map((img) => (0, s3Bucket_1.deleteFile)(img.slice(57)));
        const result = yield (0, productModel_1.deleteProductById)(_id);
        (result === null || result === void 0 ? void 0 : result._id)
            ? res.json({
                status: "success",
                message: result.title + " deleted.",
            })
            : res.json({
                status: "error",
                message: "Unable to delete",
            });
    }
    catch (error) {
        next(error);
    }
}));
router.post("/deleteFileFromServer", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileName } = req.body;
    console.log(fileName);
    if (!fileName) {
        return res.json({
            status: "error",
            message: "folder name is required",
        });
    }
    const rootFolder = "public/img/products";
    const path = `${rootFolder}/${fileName}`;
    try {
        fs_1.default.unlink(path, (err) => {
            if (err) {
                return res.json(err);
            }
            return res.json({
                status: "success",
                message: "File deleted from the server",
            });
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
