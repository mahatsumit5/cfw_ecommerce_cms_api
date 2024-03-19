"use strict";
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
exports.deleteOrder = exports.updateOrder = exports.getOrderById = exports.getOrders = void 0;
const userSchema_1 = __importDefault(require("../user/userSchema"));
const orderSchema_1 = __importDefault(require("./orderSchema"));
const getOrders = () => {
    return orderSchema_1.default.find().populate({
        path: "buyer",
        model: userSchema_1.default,
    });
};
exports.getOrders = getOrders;
const getOrderById = (_id) => {
    return orderSchema_1.default.findById(_id);
};
exports.getOrderById = getOrderById;
const updateOrder = (_a) => {
    var { _id } = _a, rest = __rest(_a, ["_id"]);
    const newData = orderSchema_1.default.findByIdAndUpdate(_id, rest, { new: true });
    return newData;
};
exports.updateOrder = updateOrder;
const deleteOrder = ({ _id }) => {
    return orderSchema_1.default.findByIdAndDelete(_id);
};
exports.deleteOrder = deleteOrder;
