import { Router } from "express";
import {
  countActiveAndInactiveProducts,
  countProductsByCategory,
  findFrequentlyBoughtItems,
  findTotalSalesByDate,
  getorderSalesByDate,
  getorderStatus,
} from "../model/query/query.model.js";
const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const itemsByCategory = await countProductsByCategory();
    const orderSalesByDate = await getorderSalesByDate();
    const activeAndInactiveProducts = await countActiveAndInactiveProducts();
    const orderStatusCount = await getorderStatus();
    const frequentyBought = await findFrequentlyBoughtItems();
    const totalSalesByDate = await findTotalSalesByDate();
    itemsByCategory?.length
      ? res.json({
          status: "success",
          message: "Products by category fetched successfully!",
          chartData: {
            itemsByCategory,
            orderSalesByDate,
            activeAndInactiveProducts,
            orderStatusCount,
            frequentyBought,
            totalSalesByDate,
          },
        })
      : res.status(404).json({
          status: "error",
          message: "No products found!",
        });
  } catch (error) {
    next(error);
  }
});
export default router;
