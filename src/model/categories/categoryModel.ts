import Category from "./categorySchema";

export const addCategory = (obj: object) => {
  return new Category(obj).save();
};

export const getCategory = () => {
  return Category.find();
};
export const getCategorybyId = (_id: string) => {
  return Category.findById(_id);
};
export const deleteCategory = (_id: string) => {
  return Category.findByIdAndDelete(_id);
};

export const updateCatagory = (_id: string, obj: object) => {
  return Category.findByIdAndUpdate(_id, obj, { new: true });
};
