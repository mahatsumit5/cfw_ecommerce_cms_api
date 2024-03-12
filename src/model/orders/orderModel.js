import Customer from "../user/userSchema.js";
import orderSchema from "./orderSchema.js";

export const getOrders = () => {
  return orderSchema.find().populate({
    path: "buyer",
    model: Customer,
  });
};
export const getOrderById = (_id) => {
  return orderSchema.findById(_id);
};
export const updateOrder = ({ _id, ...rest }) => {
  const newData = orderSchema.findByIdAndUpdate(_id, rest, { new: true });
  return newData;
};

export const deleteOrder = ({ _id }) => {
  return orderSchema.findByIdAndDelete(_id);
};
