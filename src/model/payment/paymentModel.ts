import paymentSchema from "./paymentSchema";

export const addPayment = (obj: object) => {
  return new paymentSchema(obj).save();
};

export const getPaymentOptions = () => {
  return paymentSchema.find();
};

export const updatePayment = (_id: string, obj: object) => {
  return paymentSchema.findByIdAndUpdate(_id, obj);
};
export const deletePayment = (_id: string) => {
  return paymentSchema.findByIdAndDelete(_id);
};
