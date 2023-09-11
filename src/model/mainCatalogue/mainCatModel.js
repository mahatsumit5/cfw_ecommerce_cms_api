import mainCatSchema from "./mainCatSchema.js";

export const addMainCat = (obj) => {
  return mainCatSchema(obj).save();
};

export const getMainCat = () => {
  return mainCatSchema.find();
};
export const getMainCatById = (_id) => {
  return mainCatSchema.findById(_id);
};
export const deleteMainCat = (_id) => {
  return mainCatSchema.findByIdAndDelete(_id);
};

export const updateMainCat = (_id, obj) => {
  return mainCatSchema.findByIdAndUpdate(_id, obj, { new: true });
};
