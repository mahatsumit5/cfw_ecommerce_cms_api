import express from "express";
import {
  addPayment,
  deletePayment,
  getPaymentOptions,
  updatePayment,
} from "../model/payment/paymentModel.js";
import { newPaymentvalidation } from "../middleware/joiValidation.js";
const router = express.Router();

router.post("/", newPaymentvalidation, async (req, res, next) => {
  try {
    const result = await addPayment(req.body);
    result?._id
      ? res.json({ status: "success", message: "Payment Method added" })
      : res.json({ status: "error", message: "Adding not successfull" });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await getPaymentOptions();
    data
      ? res.json({
          status: "success",
          message: "Here are your information",
          data,
        })
      : res.json({
          status: "error",
          message: "Not successfull",
        });
  } catch (error) {
    next(error);
  }
});
router.put("/", async (req, res, next) => {
  try {
    const { _id, ...rest } = req.body;
    const result = await updatePayment(_id, rest);
    console.log(result);
    result?._id
      ? res.json({
          status: "success",
          message: "Update successfull",
        })
      : res.json({
          status: "error",
          message: "Unable to update",
        });
  } catch (error) {
    next(error);
  }
});
router.delete("/", async (req, res, next) => {
  try {
    const { _id } = req.body;
    console.log(req.body);
    const data = await deletePayment(_id);
    data?._id
      ? res.json({
          status: "success",
          message: "payment  Method Deleted",
        })
      : res.json({
          status: "error",
          message: "Not successfull",
        });
  } catch (error) {
    next(error);
  }
});
export default router;
