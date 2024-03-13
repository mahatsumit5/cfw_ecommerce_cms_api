import Product from "./productSchema.js";

export const addProduct = (obj) => {
  console.log(obj);
  return Product(obj).save();
};

export const getProducts = async () => {
  const products = await Product.find().populate("category");
  console.log(products);
  return products;
};

export const getProductById = (_id) => {
  return Product.findById(_id);
};
export const deleteProductById = (_id) => {
  return Product.findByIdAndDelete(_id);
};

export const findOneProductByFilter = ({ filter }) => {
  return Product.findOne(filter);
};
export const updateProductById = ({ _id, ...rest }) => {
  return Product.findByIdAndUpdate(_id, rest, { new: true });
};
