import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
const app = express();
const PORT = 8000 || process.env.PORT;

dotenv.config(); //using dotenv to process dotenv key

// Middleware
app.use(cors()); //cross origin resources sharing for connection between client and server
app.use(morgan("dev")); // for development purpose to see
app.use(express.json()); //send data in json format to frontEnd

import { mongoConnect } from "./src/config/mongoConfig.js";
mongoConnect(); //connecting to mongoDB

// api
import adminRouter from "./src/routers/adminRouter.js";
app.use("/api/v1/admin", adminRouter);

import categoryRouter from "./src/routers/categoryRouter.js";
import { auth } from "./src/middleware/authMiddleware.js";
app.use("/api/v1/category", auth, categoryRouter);
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Server is live",
  });
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
