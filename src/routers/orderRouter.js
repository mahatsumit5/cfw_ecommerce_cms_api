import express from "express";
import {
  getOrderById,
  getOrders,
  updateOrder,
} from "../model/orders/orderModel.js";
const router = express.Router();

router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    console.log(req.params);
    const result = !_id ? await getOrders() : await getOrderById(_id);
    result
      ? res.json({
          status: "success",
          message: "Here is your order list",
          result,
        })
      : res.json({
          status: "error",
          message: "Unable to fetch data from the server",
        });
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const result = await updateOrder(req.body);
    result._id
      ? res.json({
          status: "success",
          message: "Update successfull",
        })
      : res.json({
          status: "error",
          message: "Unable to update order.Please try again later",
        });
  } catch (error) {
    next(error);
  }
});
export default router;
