"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMainCat = exports.deleteMainCat = exports.getMainCatById = exports.getMainCat = exports.addMainCat = void 0;
const parentCatSchema_1 = __importDefault(require("./parentCatSchema"));
const addMainCat = (obj) => {
    return new parentCatSchema_1.default(obj).save();
};
exports.addMainCat = addMainCat;
const getMainCat = () => {
    return parentCatSchema_1.default.find();
};
exports.getMainCat = getMainCat;
const getMainCatById = (_id) => {
    return parentCatSchema_1.default.findById(_id);
};
exports.getMainCatById = getMainCatById;
const deleteMainCat = (_id) => {
    return parentCatSchema_1.default.findByIdAndDelete(_id);
};
exports.deleteMainCat = deleteMainCat;
const updateMainCat = (_id, obj) => {
    return parentCatSchema_1.default.findByIdAndUpdate(_id, obj, { new: true });
};
exports.updateMainCat = updateMainCat;
