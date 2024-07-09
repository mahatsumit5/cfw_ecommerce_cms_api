import express, { Application, Request, Response, NextFunction } from "express";
import { mongoConnect } from "./src/config/mongoConfig";
const app: Application = express();
const PORT: number = Number(process.env.PORT) || 8080;
const ip = "192.168.20.13";
import { config } from "dotenv";
config();

import morgan from "morgan";
import cors from "cors";

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
mongoConnect();

import adminRouter from "./src/routers/adminRouter";
import categoryRouter from "./src/routers/categoryRouter";
import paymentRouter from "./src/routers/paymentRouter";
import { auth } from "./src/middleware/authMiddleware";
import productRouter from "./src/routers/productRouter";
import orderRouter from "./src/routers/orderRouter";
import parentCatRouter from "./src/routers/parentCatRouter";
import queryrouter from "./src/routers/query.router";
import awsRouter from "./src/routers/s3.router";
import imageRouter from "./src/routers/image.router";
import { CustomError } from "./src/types";
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/category", auth, categoryRouter);
app.use("/api/v1/payment", auth, paymentRouter);
app.use("/api/v1/product", auth, productRouter);
app.use("/api/v1/parentCat", auth, parentCatRouter);
app.use("/api/v1/order", auth, orderRouter);
app.use("/api/v1/query", auth, queryrouter);
app.use("/api/v1/image", auth, imageRouter);
app.use("/api/v1/aws", auth, awsRouter);

app.get("/*", (req, res: Response) => {
  res.json({
    status: "success",
    message: "Welcome to Content Management System API",
  });
});
process.env.NODE_ENV === "development"
  ? app.listen(PORT, ip, () => {
      console.log(`Your Server is running on http://${ip}:${PORT}`);
    })
  : app.listen(PORT, () => {
      console.log(`Your Server is running `);
    });
app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.statusCode || 500;
    const statusMessage = error.message || "Internal Server Error";
    console.log(`${statusCode}: ${statusMessage}`);
    return res.status(statusCode).json({
      status: "error",
      message: statusMessage,
    });
  }
);
console.log(__dirname);
