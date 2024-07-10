"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const express_openid_connect_1 = __importDefault(require("express-openid-connect"));
const mongoConfig_1 = require("./src/config/mongoConfig");
(0, mongoConfig_1.mongoConnect)();
const adminRouter_1 = __importDefault(require("./src/routers/adminRouter"));
const categoryRouter_1 = __importDefault(require("./src/routers/categoryRouter"));
const paymentRouter_1 = __importDefault(require("./src/routers/paymentRouter"));
const productRouter_1 = __importDefault(require("./src/routers/productRouter"));
const orderRouter_1 = __importDefault(require("./src/routers/orderRouter"));
const parentCatRouter_1 = __importDefault(require("./src/routers/parentCatRouter"));
const query_router_1 = __importDefault(require("./src/routers/query.router"));
const s3_router_1 = __importDefault(require("./src/routers/s3.router"));
const image_router_1 = __importDefault(require("./src/routers/image.router"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 8000;
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const options = {
    authRequired: false,
    auth0Logout: true,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    secret: process.env.SECRET,
};
const index_path = process.env.NODE_ENV === "development"
    ? path_1.default.join(__dirname, "dist")
    : path_1.default.join(__dirname, "../dist");
app.use(express_openid_connect_1.default.auth(options));
app.use((0, cors_1.default)());
app.use(express_openid_connect_1.default.requiresAuth());
app.use(express_1.default.json());
app.use("/api/v1/admin", adminRouter_1.default);
app.use("/api/v1/category", categoryRouter_1.default);
app.use("/api/v1/payment", paymentRouter_1.default);
app.use("/api/v1/product", productRouter_1.default);
app.use("/api/v1/parentCat", parentCatRouter_1.default);
app.use("/api/v1/order", orderRouter_1.default);
app.use("/api/v1/query", query_router_1.default);
app.use("/api/v1/image", image_router_1.default);
app.use("/api/v1/aws", s3_router_1.default);
app.use("/", express_1.default.static(index_path));
app.get("/*", (req, res, next) => {
    try {
        res.sendFile(path_1.default.join(index_path, "index.html"), (err) => {
            err && res.send(`<h1>Unexpected Error Occured</h1>`);
        });
    }
    catch (error) {
        next(error);
    }
});
process.env.NODE_ENV === "development"
    ? app.listen(PORT, () => {
        console.log(`Your Server is running on http://localhost:${PORT}`);
    })
    : app.listen(PORT, () => {
        console.log(`Your Server is running on ${PORT} `);
    });
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const statusMessage = error.message || "Internal Server Error";
    console.log(`${statusCode}: ${statusMessage}`);
    return res.status(statusCode).json({
        status: "error",
        message: statusMessage,
    });
});
