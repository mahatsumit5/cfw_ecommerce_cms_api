import express, { Application, Request, Response, NextFunction } from "express";
import { config } from "dotenv";
config();
import auth0 from "express-openid-connect";

import { mongoConnect } from "./src/config/mongoConfig";
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

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 8000;

import cors from "cors";
import path from "path";
const options = {
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  secret: process.env.SECRET,
};
const index_path =
  process.env.NODE_ENV === "development"
    ? path.join(__dirname, "dist")
    : path.join(__dirname, "../dist");

app.use(auth0.auth(options));
app.use(cors());
app.use(auth0.requiresAuth());

app.use(express.json());

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/parentCat", parentCatRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/query", queryrouter);
app.use("/api/v1/image", imageRouter);
app.use("/api/v1/aws", awsRouter);
app.use("/", express.static(index_path));

app.get("/*", (req, res, next) => {
  try {
    res.sendFile(path.join(index_path, "index.html"), (err) => {
      err && res.send(`<h1>Unexpected Error Occured</h1>`);
    });
  } catch (error) {
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
