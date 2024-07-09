"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminByEmailandUpdate = exports.getAdminByEmail = exports.getOneAdmin = exports.updateUserByJWT = exports.updateUser = exports.updateById = exports.getAdmin = exports.deleteAdmin = exports.test = exports.addAdmin = void 0;
const adminSchema_1 = __importDefault(require("./adminSchema"));
const addAdmin = (userObj) => {
    return new adminSchema_1.default(userObj).save();
};
exports.addAdmin = addAdmin;
const test = () => {
    console.log("object");
};
exports.test = test;
(0, exports.test)();
const deleteAdmin = (_id) => {
    return adminSchema_1.default.findByIdAndDelete({ _id });
};
exports.deleteAdmin = deleteAdmin;
const getAdmin = () => {
    return adminSchema_1.default.find();
};
exports.getAdmin = getAdmin;
const updateById = (_id, userObj) => {
    return adminSchema_1.default.findByIdAndUpdate(_id, userObj, { new: true });
};
exports.updateById = updateById;
const updateUser = (_a) => {
    var { _id } = _a, rest = __rest(_a, ["_id"]);
    return adminSchema_1.default.findByIdAndUpdate(_id, rest, { new: true });
};
exports.updateUser = updateUser;
const updateUserByJWT = ({ refreshJwt, updateData, }) => {
    return adminSchema_1.default.findOneAndUpdate({ refreshJWT: refreshJwt }, Object.assign({}, updateData));
};
exports.updateUserByJWT = updateUserByJWT;
const getOneAdmin = (filter) => {
    return adminSchema_1.default.findOne(filter);
};
exports.getOneAdmin = getOneAdmin;
const getAdminByEmail = (email) => {
    return adminSchema_1.default.findOne({ email });
};
exports.getAdminByEmail = getAdminByEmail;
const getAdminByEmailandUpdate = (email, obj) => {
    return adminSchema_1.default.findOneAndUpdate(email, obj, { new: true });
};
exports.getAdminByEmailandUpdate = getAdminByEmailandUpdate;
