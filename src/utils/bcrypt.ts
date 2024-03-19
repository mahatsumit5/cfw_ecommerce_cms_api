import bcrypt from "bcryptjs";
const salt = 10;
export const hashPassword = (plainPassword: string) => {
  return bcrypt.hashSync(plainPassword, salt);
};
export const checkPassword = (plainPassword: string, userPassword: string) => {
  return bcrypt.compareSync(plainPassword, userPassword);
};
