import express from "express";
import {
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrder,
} from "../model/orders/orderModel";
const router = express.Router();

router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;

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

router.patch("/", async (req, res, next) => {
  try {
    const result = await updateOrder(req.body);
    result?._id
      ? res.json({
          status: "success",
          message: "Your order status has been updated",
        })
      : res.json({
          status: "error",
          message: "Unable to update order.Please try again later",
        });
  } catch (error) {
    next(error);
  }
});

router.delete("/:_id", async (req, res, next) => {
  try {
    const deletedOrder = await deleteOrder(req.params);
    deletedOrder?._id
      ? res.json({
          status: "success",
          message: "Your order has been deleted.",
        })
      : res.json({
          status: "error",
          message: "Error deleting this  order.",
        });
  } catch (error) {
    next(error);
  }
});
export default router;
