"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoConfig_1 = require("./src/config/mongoConfig");
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 8080;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("tiny"));
app.use(express_1.default.json());
(0, mongoConfig_1.mongoConnect)();
const path_1 = __importDefault(require("path"));
const directory = path_1.default.resolve();
app.use(express_1.default.static(path_1.default.join(directory + "/public")));
app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "Server is up and running",
    });
});
const errorHandle = (error, req, res) => {
    const code = error.statusCode || 500;
    res.status(code).json({
        status: "error",
        message: error.message,
    });
};
app.use(errorHandle);
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
