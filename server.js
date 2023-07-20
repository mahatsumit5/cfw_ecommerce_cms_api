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

import userRouter from "./src/routers/userRouter.js";
app.use("/api/v1/user", userRouter);
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Server is live",
  });
});

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`Server running on port http://localhost:${PORT}`);
});
