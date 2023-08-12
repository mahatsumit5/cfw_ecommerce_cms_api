import categorySchema from "./categorySchema.js";

export const addCategory = (obj) => {
  return categorySchema(obj).save();
};

export const getCategory = () => {
  return categorySchema.find();
};
export const getCategorybyId = (_id) => {
  return categorySchema.findById(_id);
};
export const deleteCategory = (_id) => {
  return categorySchema.findByIdAndDelete(_id);
};

export const updateCatagory = (_id, obj) => {
  return categorySchema.findByIdAndUpdate(_id, obj, { new: true });
};
