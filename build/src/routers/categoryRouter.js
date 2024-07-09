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
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slug = (0, slugify_1.default)(req.body.title, { lower: true, trim: true });
        const result = yield (0, categoryModel_1.addCategory)(Object.assign(Object.assign({}, req.body), { slug }));
        (result === null || result === void 0 ? void 0 : result._id)
            ? res.json({
                status: "success",
                message: "New Category Sucessfully added",
                result,
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
router.put("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { _id } = _a, rest = __rest(_a, ["_id"]);
        const result = yield (0, categoryModel_1.updateCatagory)(_id, Object.assign({}, rest));
        (result === null || result === void 0 ? void 0 : result._id)
            ? res.json({
                status: "success",
                message: `Update successfull`,
            })
            : res.json({
                status: "error",
                message: "Unable to update new category",
            });
    }
    catch (error) {
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
