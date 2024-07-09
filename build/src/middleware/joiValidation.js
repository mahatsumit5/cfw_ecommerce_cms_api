"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPaymentvalidation = exports.updateProductValidation = exports.newProductValidation = exports.newAdminVerificationValidation = exports.loginValidation = exports.newAdminValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const SHORTSTE = joi_1.default.string().min(2).max(100);
const SHORTSTEREQ = joi_1.default.string().min(3).max(100).required();
const LONGTSTR = joi_1.default.string().min(3).max(10000);
const NUM = joi_1.default.number();
const NUMREQ = joi_1.default.number().required();
const newAdminValidation = (req, res, next) => {
    try {
        const schema = joi_1.default.object({
            fName: SHORTSTE.required(),
            lName: SHORTSTE.required(),
            phone: SHORTSTEREQ,
            email: joi_1.default.string()
                .email({
                minDomainSegments: 2,
                tlds: { allow: ["com"] },
            })
                .required(),
            password: SHORTSTEREQ.min(8),
            address: joi_1.default.string().min(5),
        });
        const { error } = schema.validate(req.body);
        error
            ? res.json({
                status: "error",
                message: error.message,
            })
            : next();
    }
    catch (error) {
        next(error);
    }
};
exports.newAdminValidation = newAdminValidation;
const loginValidation = (req, res, next) => {
    try {
        const schema = joi_1.default.object({
            email: joi_1.default.string()
                .email({
                minDomainSegments: 2,
                tlds: { allow: ["com"] },
            })
                .required(),
            password: SHORTSTEREQ.min(8).max(20),
        });
        const { error } = schema.validate(req.body);
        error
            ? res.json({
                status: "error",
                message: error.message,
            })
            : next();
    }
    catch (error) {
        next(error);
    }
};
exports.loginValidation = loginValidation;
const newAdminVerificationValidation = (req, res, next) => {
    try {
        const schema = joi_1.default.object({
            e: SHORTSTEREQ.email({ minDomainSegments: 2 }),
            c: SHORTSTEREQ,
        });
        const { error } = schema.validate(req.body);
        error
            ? res.json({
                status: "error",
                message: error.message,
            })
            : next();
    }
    catch (error) {
        next(error);
    }
};
exports.newAdminVerificationValidation = newAdminVerificationValidation;
const newProductValidation = (req, res, next) => {
    try {
        req.body.salesPrice = req.body.salesPrice || 0;
        const schema = joi_1.default.object({
            title: SHORTSTEREQ,
            color: joi_1.default.array(),
            size: joi_1.default.array(),
            category: SHORTSTEREQ,
            sku: SHORTSTEREQ,
            status: SHORTSTEREQ,
            qty: NUMREQ,
            price: NUMREQ,
            salesPrice: NUM,
            description: LONGTSTR,
            salesStartDate: joi_1.default.date().allow("", null).iso(),
            salesEndDate: joi_1.default.date().iso().allow(""),
        });
        const { error } = schema.validate(req.body);
        error
            ? res.json({
                status: "error",
                message: error.message,
            })
            : next();
    }
    catch (error) {
        next(error);
    }
};
exports.newProductValidation = newProductValidation;
const updateProductValidation = (req, res, next) => {
    try {
        const { _id, status, title, size, color } = req.body;
        req.body.size = [...size];
        req.body.color = [...color];
        if (!title) {
            next();
            return;
        }
        if (typeof req.body.images === "string") {
            req.body.images = [req.body.images];
        }
        req.body.salesPrice = req.body.salesPrice || 0;
        req.body.salesStartDate =
            req.body.salesStartDate === "null" || !req.body.salesStartDate
                ? null
                : req.body.salesStartDate;
        req.body.salesEndDate =
            req.body.salesEndDate === "null" || !req.body.salesEndDate
                ? null
                : req.body.salesEndDate;
        const schema = joi_1.default.object({
            _id: SHORTSTEREQ,
            title: SHORTSTEREQ,
            category: SHORTSTEREQ,
            color: joi_1.default.array(),
            size: joi_1.default.array(),
            status: SHORTSTEREQ,
            qty: NUM.min(2),
            price: NUM,
            salesPrice: NUM,
            description: joi_1.default.string().min(1).max(100000).required(),
            salesStartDate: SHORTSTE.allow("", null),
            salesEndDate: SHORTSTE.allow("", null),
            images: joi_1.default.array(),
            thumbnail: LONGTSTR.allow(""),
            reviews: LONGTSTR.allow(""),
        });
        const { error } = schema.validate(req.body);
        error
            ? res.json({
                status: "error",
                message: error.message,
            })
            : next();
    }
    catch (error) {
        next(error);
    }
};
exports.updateProductValidation = updateProductValidation;
const newPaymentvalidation = (req, res, next) => {
    try {
        const schema = joi_1.default.object({
            status: SHORTSTEREQ,
            title: joi_1.default.string().min(2).max(50).required(),
            description: joi_1.default.string().min(1).max(100).required(),
        });
        const { error } = schema.validate(req.body);
        error
            ? res.json({
                status: "error",
                message: error.message,
            })
            : next();
    }
    catch (error) {
        next(error);
    }
};
exports.newPaymentvalidation = newPaymentvalidation;
