"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePayment = exports.updatePayment = exports.getPaymentOptions = exports.addPayment = void 0;
const paymentSchema_1 = __importDefault(require("./paymentSchema"));
const addPayment = (obj) => {
    return new paymentSchema_1.default(obj).save();
};
exports.addPayment = addPayment;
const getPaymentOptions = () => {
    return paymentSchema_1.default.find();
};
exports.getPaymentOptions = getPaymentOptions;
const updatePayment = (_id, obj) => {
    return paymentSchema_1.default.findByIdAndUpdate(_id, obj);
};
exports.updatePayment = updatePayment;
const deletePayment = (_id) => {
    return paymentSchema_1.default.findByIdAndDelete(_id);
};
exports.deletePayment = deletePayment;
