import ParentCategory from "./parentCatSchema";

export const addMainCat = (obj: object) => {
  return new ParentCategory(obj).save();
};

export const getMainCat = () => {
  return ParentCategory.find();
};
export const getMainCatById = (_id: string) => {
  return ParentCategory.findById(_id);
};
export const deleteMainCat = (_id: string) => {
  return ParentCategory.findByIdAndDelete(_id);
};

export const updateMainCat = (_id: string, obj: object) => {
  return ParentCategory.findByIdAndUpdate(_id, obj, { new: true });
};
