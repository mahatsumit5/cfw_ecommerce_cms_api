import productSchema from "./productSchema.js";

export const addProduct = (obj) => {
  return productSchema(obj).save();
};

export const getProducts = () => {
  return productSchema.find();
};
export const getProductById = (_id) => {
  return productSchema.findById(_id);
};
export const deleteProductById = (_id) => {
  return productSchema.findByIdAndDelete(_id);
};

export const findOneProductByFilter = ({ filter }) => {
  return productSchema.findOne(filter);
};
export const updateProductById = ({ _id, ...rest }) => {
  return productSchema.findByIdAndUpdate(_id, rest, { new: true });
};
