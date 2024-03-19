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
exports.findTotalSalesByDate = exports.findBuyerWithMostItems = exports.findFrequentlyBoughtItems = exports.countActiveAndInactiveProducts = exports.getorderStatus = exports.getorderSalesByDate = exports.countProductsByCategory = void 0;
const orderSchema_1 = __importDefault(require("../orders/orderSchema"));
const productSchema_1 = __importDefault(require("../product/productSchema"));
const countProductsByCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    const agg = yield productSchema_1.default.aggregate([
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 },
            },
        },
    ]);
    return agg;
});
exports.countProductsByCategory = countProductsByCategory;
const getorderSalesByDate = () => __awaiter(void 0, void 0, void 0, function* () {
    const orderbyDate = yield orderSchema_1.default.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 },
            },
        },
    ]);
    return orderbyDate;
});
exports.getorderSalesByDate = getorderSalesByDate;
const getorderStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    const orderstatus = yield orderSchema_1.default.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    return orderstatus;
});
exports.getorderStatus = getorderStatus;
const countActiveAndInactiveProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield productSchema_1.default.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    return count;
});
exports.countActiveAndInactiveProducts = countActiveAndInactiveProducts;
const findFrequentlyBoughtItems = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const frequentlyBoughtItems = yield orderSchema_1.default.aggregate([
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$orderItems._id",
                    title: { $first: "$orderItems.title" },
                    thumbnail: { $first: "$orderItems.thumbnail" },
                    price: { $last: "$orderItems.price" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);
        return frequentlyBoughtItems;
    }
    catch (error) {
        console.error("Error finding frequently bought items:", error);
    }
});
exports.findFrequentlyBoughtItems = findFrequentlyBoughtItems;
const findBuyerWithMostItems = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const buyerWithMostItems = yield orderSchema_1.default.aggregate([
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$buyer",
                    totalItemsBought: { $sum: { $toInt: "$orderItems.orderQty" } },
                },
            },
            { $sort: { totalItemsBought: -1 } },
            { $limit: 1 },
        ]);
    }
    catch (error) {
        console.error("Error finding buyer with most items:", error);
    }
});
exports.findBuyerWithMostItems = findBuyerWithMostItems;
const findTotalSalesByDate = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalSalesByDate = yield orderSchema_1.default.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    title: { $first: "$orderItems.title" },
                    thumbnail: { $first: "$orderItems.thumbnail" },
                    totalSales: { $sum: "$total_details.amount_total" },
                },
            },
            { $sort: { _id: -1 } },
        ]);
        return totalSalesByDate;
    }
    catch (error) {
        console.error("Error finding total sales by date:", error);
    }
});
exports.findTotalSalesByDate = findTotalSalesByDate;
