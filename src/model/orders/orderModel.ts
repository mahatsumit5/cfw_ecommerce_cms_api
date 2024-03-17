import Customer from "../user/userSchema";
import orderSchema from "./orderSchema";

export const getOrders = () => {
  return orderSchema.find().populate({
    path: "buyer",
    model: Customer,
  });
};
export const getOrderById = (_id: string) => {
  return orderSchema.findById(_id);
};
export const updateOrder = ({ _id, ...rest }: { _id: string }) => {
  const newData = orderSchema.findByIdAndUpdate(_id, rest, { new: true });
  return newData;
};

export const deleteOrder = ({ _id }: { _id: string }) => {
  return orderSchema.findByIdAndDelete(_id);
};
