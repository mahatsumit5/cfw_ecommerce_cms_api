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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    uniqueId: {
        type: String,
        required: true,
        unique: true,
    },
    stripeId: {
        type: String,
        required: true,
        unique: true,
        index: 1,
    },
    orderItems: [
        {
            _id: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
                ref: "products",
            },
            title: {
                type: String,
                required: true,
            },
            orderQty: {
                type: String,
                required: true,
            },
            size: {
                type: String,
                required: false,
            },
            color: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            thumbnail: {
                type: String,
                required: true,
            },
        },
    ],
    status: {
        type: String,
        default: "pending",
    },
    total_details: {
        amount_discount: Number,
        amount_shipping: Number,
        amount_tax: Number,
        amount_subtotal: Number,
        amount_total: Number,
    },
    buyer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Customer",
    },
    address: {
        city: { type: String },
        country: { type: String },
        line1: { type: String },
        line2: { type: String, default: null },
        postal_code: { type: String },
        state: { type: String },
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Order", orderSchema);
