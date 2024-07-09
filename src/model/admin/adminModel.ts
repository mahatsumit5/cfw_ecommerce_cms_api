import adminSchema, { IUser } from "./adminSchema";

// to do remove object with proper tyoes
export const addAdmin = (userObj: object) => {
  return new adminSchema(userObj).save();
};

export const test = () => {
  console.log("object");
};
test();
export const deleteAdmin = (_id: string) => {
  return adminSchema.findByIdAndDelete({ _id });
};
export const getAdmin = () => {
  return adminSchema.find();
};
export const updateById = (_id: string, userObj: object) => {
  return adminSchema.findByIdAndUpdate(_id, userObj, { new: true });
};
export const updateUser = ({
  _id,
  ...rest
}: {
  _id: string;
  profile?: string;
}) => {
  return adminSchema.findByIdAndUpdate(_id, rest, { new: true });
};
export const updateUserByJWT = ({
  refreshJwt,
  updateData,
}: {
  refreshJwt: string;
  updateData: any;
}) => {
  return adminSchema.findOneAndUpdate(
    { refreshJWT: refreshJwt },
    { ...updateData }
  );
};

export const getOneAdmin = (filter: object) => {
  return adminSchema.findOne(filter);
};
export const getAdminByEmail = (email: string) => {
  return adminSchema.findOne({ email });
};
export const getAdminByEmailandUpdate = (
  email: { email: string },
  obj: object
) => {
  return adminSchema.findOneAndUpdate(email, obj, { new: true });
};
