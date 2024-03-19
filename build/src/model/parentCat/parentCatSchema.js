"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mainCatSchema = new mongoose_1.Schema({
    status: {
        type: String,
        required: true,
        default: "active",
    },
    title: {
        type: String,
        required: true,
        unique: true,
        index: 1,
    },
    slug: {
        type: String,
        unique: true,
        index: 1,
        required: true,
    },
}, { timestamps: true });
const ParentCategory = (0, mongoose_1.model)("ParentCategory", mainCatSchema);
exports.default = ParentCategory;
