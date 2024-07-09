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
const paymentModel_1 = require("../model/payment/paymentModel");
const joiValidation_1 = require("../middleware/joiValidation");
const router = express_1.default.Router();
router.post("/", joiValidation_1.newPaymentvalidation, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, paymentModel_1.addPayment)(req.body);
        (result === null || result === void 0 ? void 0 : result._id)
            ? res.json({ status: "success", message: "Payment Method added" })
            : res.json({ status: "error", message: "Adding not successfull" });
    }
    catch (error) {
        next(error);
    }
}));
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, paymentModel_1.getPaymentOptions)();
        data
            ? res.json({
                status: "success",
                message: "Here are your information",
                result: data,
            })
            : res.json({
                status: "error",
                message: "Not successfull",
            });
    }
    catch (error) {
        next(error);
    }
}));
router.put("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { _id } = _a, rest = __rest(_a, ["_id"]);
        const result = yield (0, paymentModel_1.updatePayment)(_id, rest);
        console.log(result);
        (result === null || result === void 0 ? void 0 : result._id)
            ? res.json({
                status: "success",
                message: "Update successfull",
            })
            : res.json({
                status: "error",
                message: "Unable to update",
            });
    }
    catch (error) {
        next(error);
    }
}));
router.delete("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.body;
        console.log(req.body);
        const data = yield (0, paymentModel_1.deletePayment)(_id);
        (data === null || data === void 0 ? void 0 : data._id)
            ? res.json({
                status: "success",
                message: "payment  Method Deleted",
            })
            : res.json({
                status: "error",
                message: "Not successfull",
            });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
