import orderSchema from "./orderSchema.js";

export const getOrders = () => {
  return orderSchema.find();
};
export const getOrderById = (_id) => {
  return orderSchema.findById(_id);
};
export const updateOrder = (filter) => {
  return orderSchema.findOneAndUpdate(filter);
};
