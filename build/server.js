"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoConfig_1 = require("./src/config/mongoConfig");
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 8000;
<<<<<<< HEAD
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
=======
console.log(PORT);
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
console.log(process.env.TZ);
>>>>>>> typescript
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("tiny"));
app.use(express_1.default.json());
(0, mongoConfig_1.mongoConnect)();
const path_1 = __importDefault(require("path"));
const directory = path_1.default.resolve();
app.use(express_1.default.static(path_1.default.join(directory + "/public")));
const adminRouter_1 = __importDefault(require("./src/routers/adminRouter"));
const categoryRouter_1 = __importDefault(require("./src/routers/categoryRouter"));
const paymentRouter_1 = __importDefault(require("./src/routers/paymentRouter"));
const authMiddleware_1 = require("./src/middleware/authMiddleware");
const productRouter_1 = __importDefault(require("./src/routers/productRouter"));
const orderRouter_1 = __importDefault(require("./src/routers/orderRouter"));
const parentCatRouter_1 = __importDefault(require("./src/routers/parentCatRouter"));
const query_router_1 = __importDefault(require("./src/routers/query.router"));
app.use("/api/v1/admin", adminRouter_1.default);
app.use("/api/v1/category", authMiddleware_1.auth, categoryRouter_1.default);
app.use("/api/v1/payment", authMiddleware_1.auth, paymentRouter_1.default);
app.use("/api/v1/product", authMiddleware_1.auth, productRouter_1.default);
app.use("/api/v1/parentCat", authMiddleware_1.auth, parentCatRouter_1.default);
app.use("/api/v1/order", authMiddleware_1.auth, orderRouter_1.default);
app.use("/api/v1/query", authMiddleware_1.auth, query_router_1.default);
app.get("/*", (req, res) => {
    res.json({
        status: "success",
        message: "Welcome to Content Management System API",
    });
});
const errorHandle = (error, req, res) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode).json({
        status: "error",
        message: error.message || "Internal Server error",
    });
};
app.use(errorHandle);
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
