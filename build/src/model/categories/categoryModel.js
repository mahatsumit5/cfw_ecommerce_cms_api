"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCatagory = exports.deleteCategory = exports.getCategorybyId = exports.getCategory = exports.addCategory = void 0;
const categorySchema_1 = __importDefault(require("./categorySchema"));
const addCategory = (obj) => {
    return new categorySchema_1.default(obj).save();
};
exports.addCategory = addCategory;
const getCategory = () => {
    return categorySchema_1.default.find();
};
exports.getCategory = getCategory;
const getCategorybyId = (_id) => {
    return categorySchema_1.default.findById(_id);
};
exports.getCategorybyId = getCategorybyId;
const deleteCategory = (_id) => {
    return categorySchema_1.default.findByIdAndDelete(_id);
};
exports.deleteCategory = deleteCategory;
const updateCatagory = (_id, obj) => {
    return categorySchema_1.default.findByIdAndUpdate(_id, obj, { new: true });
};
exports.updateCatagory = updateCatagory;
