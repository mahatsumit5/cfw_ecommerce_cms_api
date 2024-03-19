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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderModel_1 = require("../model/orders/orderModel");
const router = express_1.default.Router();
router.get("/:_id?", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const result = !_id ? yield (0, orderModel_1.getOrders)() : yield (0, orderModel_1.getOrderById)(_id);
        result
            ? res.json({
                status: "success",
                message: "Here is your order list",
                result,
            })
            : res.json({
                status: "error",
                message: "Unable to fetch data from the server",
            });
    }
    catch (error) {
        next(error);
    }
}));
router.patch("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, orderModel_1.updateOrder)(req.body);
        (result === null || result === void 0 ? void 0 : result._id)
            ? res.json({
                status: "success",
                message: "Your order status has been updated",
            })
            : res.json({
                status: "error",
                message: "Unable to update order.Please try again later",
            });
    }
    catch (error) {
        next(error);
    }
}));
router.delete("/:_id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedOrder = yield (0, orderModel_1.deleteOrder)(req.params);
        (deletedOrder === null || deletedOrder === void 0 ? void 0 : deletedOrder._id)
            ? res.json({
                status: "success",
                message: "Your order has been deleted.",
            })
            : res.json({
                status: "error",
                message: "Error deleting this  order.",
            });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
