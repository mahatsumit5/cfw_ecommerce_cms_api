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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const query_model_1 = require("../model/query/query.model");
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemsByCategory = yield (0, query_model_1.countProductsByCategory)();
        const orderSalesByDate = yield (0, query_model_1.getorderSalesByDate)();
        const activeAndInactiveProducts = yield (0, query_model_1.countActiveAndInactiveProducts)();
        const orderStatusCount = yield (0, query_model_1.getorderStatus)();
        const frequentyBought = yield (0, query_model_1.findFrequentlyBoughtItems)();
        const totalSalesByDate = yield (0, query_model_1.findTotalSalesByDate)();
        (itemsByCategory === null || itemsByCategory === void 0 ? void 0 : itemsByCategory.length)
            ? res.json({
                status: "success",
                message: "Products by category fetched successfully!",
                chartData: {
                    itemsByCategory,
                    orderSalesByDate,
                    activeAndInactiveProducts,
                    orderStatusCount,
                    frequentyBought,
                    totalSalesByDate,
                },
            })
            : res.status(404).json({
                status: "error",
                message: "No products found!",
            });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
