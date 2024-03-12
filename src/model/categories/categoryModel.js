import Category from "./categorySchema.js";

export const addCategory = (obj) => {
  return Category(obj).save();
};

export const getCategory = () => {
  return Category.find();
};
export const getCategorybyId = (_id) => {
  return Category.findById(_id);
};
export const deleteCategory = (_id) => {
  return Category.findByIdAndDelete(_id);
};

export const updateCatagory = (_id, obj) => {
  console.log(_id, obj);
  return Category.findByIdAndUpdate(_id, obj, { new: true });
};
