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
const categoryModel_1 = require("../model/categories/categoryModel");
const slugify_1 = __importDefault(require("slugify"));
const multerMiddleware_1 = require("../middleware/multerMiddleware");
const s3Bucket_1 = __importStar(require("../utils/s3Bucket"));
const router = express_1.default.Router();
router.get("/:_id?", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const result = !_id ? yield (0, categoryModel_1.getCategory)() : yield (0, categoryModel_1.getCategorybyId)(_id);
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
router.post("/", multerMiddleware_1.upload.single("image"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { status, title, parentCategory } = req.body;
        const file = req.file;
        if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) {
            const data = yield (0, s3Bucket_1.default)(req.file);
            req.body.image = data === null || data === void 0 ? void 0 : data.Location;
        }
        else {
            throw new Error("Image is required.");
        }
        const obj = {
            status,
            image: req.body.image,
            title,
            slug: (0, slugify_1.default)(title, { lower: true, trim: true }),
            parentCategory,
        };
        const result = yield (0, categoryModel_1.addCategory)(obj);
        (result === null || result === void 0 ? void 0 : result._id)
            ? res.json({
                status: "success",
                message: "New Category Sucessfully added",
                result,
                imagesToDelete: req.file.filename,
            })
            : res.json({
                status: "error",
                message: "Unable to add new category",
            });
    }
    catch (error) {
        if (error.message.includes("E11000 duplicate key error")) {
            error.statusCode = 400;
            error.message = "This title is already avilable in the database.";
        }
        next(error);
    }
}));
router.put("/", multerMiddleware_1.upload.single("image"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        const _d = req.body, { _id } = _d, rest = __rest(_d, ["_id"]);
        if ((_b = req.file) === null || _b === void 0 ? void 0 : _b.path) {
            const data = yield (0, s3Bucket_1.default)(req.file);
            req.body.image = data === null || data === void 0 ? void 0 : data.Location;
        }
        const result = yield (0, categoryModel_1.updateCatagory)(_id, Object.assign(Object.assign({}, rest), { image: req.body.image }));
        (result === null || result === void 0 ? void 0 : result._id)
            ? res.json({
                status: "success",
                message: `Update successfull`,
                imagesToDelete: (_c = req === null || req === void 0 ? void 0 : req.file) === null || _c === void 0 ? void 0 : _c.filename,
            })
            : res.json({
                status: "error",
                message: "Unable to update new category",
            });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
router.delete("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.body;
        const category = yield (0, categoryModel_1.getCategorybyId)(_id);
        if (!(category === null || category === void 0 ? void 0 : category.image)) {
            throw new Error("category image not found");
        }
        (0, s3Bucket_1.deleteFile)(category.image.slice(57));
        const result = yield (0, categoryModel_1.deleteCategory)(_id);
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
exports.default = router;
