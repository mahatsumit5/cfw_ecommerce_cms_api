import Product from "./productSchema";

export const addProduct = (obj: object) => {
  return new Product(obj).save();
};

export const getProducts = async () => {
  return await Product.find().populate("category");
};

export const getProductById = (_id: string) => {
  return Product.findById(_id);
};
export const deleteProductById = (_id: string) => {
  return Product.findByIdAndDelete(_id);
};

export const findOneProductByFilter = ({ filter }: { filter: object }) => {
  return Product.findOne(filter);
};
export const updateProductById = ({ _id, ...rest }: { _id: string }) => {
  return Product.findByIdAndUpdate(_id, rest, { new: true });
};
