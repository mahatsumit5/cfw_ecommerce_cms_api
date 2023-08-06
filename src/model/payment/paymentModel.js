import paymentSchema from "./paymentSchema.js";

export const addPayment = (obj) => {
  return paymentSchema(obj).save();
};

export const getPaymentOptions = () => {
  return paymentSchema.find();
};

export const updatePayment = (_id, obj) => {
  console.log(_id, obj);
  return paymentSchema.findByIdAndUpdate(_id, obj);
};
export const deletePayment = (_id) => {
  return paymentSchema.findByIdAndDelete(_id);
};
