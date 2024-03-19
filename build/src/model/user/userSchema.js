"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const customerSchema = new mongoose_1.Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: false, unique: true, default: "" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    photo: { type: String, required: true },
    favouriteItem: [
        {
            _id: { type: mongoose_1.Schema.Types.ObjectId, required: false, unique: true },
            title: { type: String, required: true },
            slug: { type: String, required: true },
            price: { type: Number, required: true },
            sku: { type: String, required: true },
            thumbnail: { type: String, required: true },
        },
    ],
}, { timestamps: true });
const Customer = (0, mongoose_1.model)("Customer", customerSchema);
exports.default = Customer;
