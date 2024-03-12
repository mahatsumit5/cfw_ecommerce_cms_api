import ParentCategory from "./parentCatSchema.js";

export const addMainCat = (obj) => {
  return ParentCategory(obj).save();
};

export const getMainCat = () => {
  return ParentCategory.find();
};
export const getMainCatById = (_id) => {
  return ParentCategory.findById(_id);
};
export const deleteMainCat = (_id) => {
  return ParentCategory.findByIdAndDelete(_id);
};

export const updateMainCat = (_id, obj) => {
  return ParentCategory.findByIdAndUpdate(_id, obj, { new: true });
};
