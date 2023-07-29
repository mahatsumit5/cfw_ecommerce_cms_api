import AdminSchema from "./adminSchema.js";

export const addAdmin = (userObj) => {
  return AdminSchema(userObj).save();
};
export const deleteAdmin = (_id) => {
  return AdminSchema.findByIdAndDelete({ _id });
};
export const getAdmin = () => {
  return AdminSchema.find();
};
export const updateById = (_id, userObj) => {
  return AdminSchema.findByIdAndUpdate(_id, userObj, { new: true });
};

export const getAdminByEmail = (email) => {
  return AdminSchema.findOne({ email });
};
export const getAdminByEmailandUpdate = (email, obj) => {
  return AdminSchema.findOneAndUpdate(email, obj, { new: true });
};
