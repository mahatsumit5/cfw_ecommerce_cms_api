import orderSchema from "../orders/orderSchema.js";
import Product from "../product/productSchema.js";

export const countProductsByCategory = async () => {
  const agg = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]);

  return agg;
};

export const getorderSalesByDate = async () => {
  const orderbyDate = await orderSchema.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
  ]);
  return orderbyDate;
};
export const getorderStatus = async () => {
  const orderstatus = await orderSchema.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  return orderstatus;
};

export const countActiveAndInactiveProducts = async () => {
  const count = await Product.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  return count;
};
export const findFrequentlyBoughtItems = async () => {
  try {
    const frequentlyBoughtItems = await orderSchema.aggregate([
      { $unwind: "$orderItems" }, // Unwind the orderItems array
      {
        $group: {
          _id: "$orderItems._id",
          title: { $first: "$orderItems.title" },
          thumbnail: { $first: "$orderItems.thumbnail" },
          price: { $last: "$orderItems.price" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } }, // Sort by count in descending order
      { $limit: 5 }, // Optionally limit to top 5 frequently bought items
    ]);

    return frequentlyBoughtItems;
  } catch (error) {
    console.error("Error finding frequently bought items:", error);
  }
};
export const findBuyerWithMostItems = async () => {
  try {
    const buyerWithMostItems = await orderSchema.aggregate([
      { $unwind: "$orderItems" }, // Unwind the orderItems array
      {
        $group: {
          _id: "$buyer",
          totalItemsBought: { $sum: { $toInt: "$orderItems.orderQty" } },
        },
      },
      { $sort: { totalItemsBought: -1 } }, // Sort by totalItemsBought in descending order
      { $limit: 1 }, // Limit to the top buyer
    ]);
  } catch (error) {
    console.error("Error finding buyer with most items:", error);
  }
};

export const findTotalSalesByDate = async () => {
  try {
    const totalSalesByDate = await orderSchema.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          title: { $first: "$orderItems.title" },
          thumbnail: { $first: "$orderItems.thumbnail" },
          totalSales: { $sum: "$total_details.amount_total" },
        },
      },
      { $sort: { _id: -1 } }, // Sort by date in ascending order
    ]);

    return totalSalesByDate;
  } catch (error) {
    console.error("Error finding total sales by date:", error);
  }
};
