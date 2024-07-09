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
exports.updateProductById = exports.findOneProductByFilter = exports.deleteProductById = exports.getProductById = exports.getProducts = exports.addProduct = void 0;
const productSchema_1 = __importDefault(require("./productSchema"));
const addProduct = (obj) => {
    return new productSchema_1.default(obj).save();
};
exports.addProduct = addProduct;
const getProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield productSchema_1.default.find().populate("category");
});
exports.getProducts = getProducts;
const getProductById = (_id) => {
    return productSchema_1.default.findById(_id);
};
exports.getProductById = getProductById;
const deleteProductById = (_id) => {
    return productSchema_1.default.findByIdAndDelete(_id);
};
exports.deleteProductById = deleteProductById;
const findOneProductByFilter = ({ filter }) => {
    return productSchema_1.default.findOne(filter);
};
exports.findOneProductByFilter = findOneProductByFilter;
const updateProductById = (_a) => {
    var { _id } = _a, rest = __rest(_a, ["_id"]);
    return productSchema_1.default.findByIdAndUpdate(_id, rest, { new: true });
};
exports.updateProductById = updateProductById;
