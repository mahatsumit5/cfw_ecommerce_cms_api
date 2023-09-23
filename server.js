import express from "express";
const app = express();
const PORT = 8000;

import dotenv from "dotenv";
dotenv.config(); //using dotenv to process dotenv key

// Middleware
import morgan from "morgan";
import cors from "cors";
import { mongoConnect } from "./src/config/mongoConfig.js";
app.use(cors()); //cross origin resources sharing for connection between client and server
app.use(morgan("dev")); // for development purpose to see
app.use(express.json()); //send data in json format to frontEnd
mongoConnect(); //connecting to mongoDB

import path from "path";

const __dirname = path.resolve();
console.log(__dirname);
// convert public to static
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.static(__dirname + "/build"));
// api
import adminRouter from "./src/routers/adminRouter.js";
import categoryRouter from "./src/routers/categoryRouter.js";
import paymentRouter from "./src/routers/paymentRouter.js";
import { auth } from "./src/middleware/authMiddleware.js";
import productRouter from "./src/routers/productRouter.js";
import mainCatRouter from "./src/routers/mainCatRouter.js";
import orderRouter from "./src/routers/orderRouter.js";
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/category", auth, categoryRouter);
app.use("/api/v1/payment", auth, paymentRouter);
app.use("/api/v1/product", auth, productRouter);
app.use("/api/v1/mainCat", auth, mainCatRouter);
app.use("/api/v1/order", auth, orderRouter);

app.use("/", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});
app.use((error, req, res, next) => {
  console.log(error);
  const code = error.statusCode || 500;
  res.status(code).json({
    status: "error",
    message: error.message,
  });
});

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`Server running on port http://localhost:${PORT}`);
});
