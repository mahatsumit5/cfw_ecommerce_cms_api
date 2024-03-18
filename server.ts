import express, {
  ErrorRequestHandler,
  Application,
  Request,
  Response,
} from "express";
import { mongoConnect } from "./src/config/mongoConfig";
const app: Application = express();
const PORT: Number = Number(process.env.PORT) || 8000;

import { config } from "dotenv";
config(); //using dotenv to process dotenv key

// Middleware
import morgan from "morgan";
import cors from "cors";

app.use(cors()); //cross origin resources sharing for connection between client and server
app.use(morgan("tiny")); // for development purpose to see
app.use(express.json()); //send data in json format to frontEnd
mongoConnect(); //connecting to mongoDB

import path from "path";

const directory: string = path.resolve();
// convert public to static
app.use(express.static(path.join(directory + "/public")));
// api
import adminRouter from "./src/routers/adminRouter";
import categoryRouter from "./src/routers/categoryRouter";
import paymentRouter from "./src/routers/paymentRouter";
import { auth } from "./src/middleware/authMiddleware";
import productRouter from "./src/routers/productRouter";
import orderRouter from "./src/routers/orderRouter";
import parentCatRouter from "./src/routers/parentCatRouter";
import queryrouter from "./src/routers/query.router";
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/category", auth, categoryRouter);
app.use("/api/v1/payment", auth, paymentRouter);
app.use("/api/v1/product", auth, productRouter);
app.use("/api/v1/parentCat", auth, parentCatRouter);
app.use("/api/v1/order", auth, orderRouter);
app.use("/api/v1/query", auth, queryrouter);

app.get("/*", (req, res: Response) => {
  res.json({
    status: "success",
    message: "Welcome to Content Management System API",
  });
});

const errorHandle: ErrorRequestHandler = (error, req, res) => {
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
