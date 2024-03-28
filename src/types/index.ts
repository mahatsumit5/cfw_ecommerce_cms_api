import { IUser } from "../model/admin/adminSchema";

export type createSessionParams = {
  token: string;
  associate: string;
};
export type nodemailerParams = {
  email: string;
  fName: string;
  lName: string;
};
export type jwtReturnType =
  | { email: string; iat: number; exp: number }
  | undefined;

declare global {
  namespace Express {
    interface Request {
      userInfo?: IUser;
    }
  }
}

export interface CustomError extends Error {
  statusCode: number;
}

import { Request } from "express";

// Define an interface for the file object returned by Multer
interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  bucket: string;
  key: string;
  acl: string;
  contentType: string;
  contentDisposition: string | null;
  contentEncoding: string | null;
  storageClass: string;
  serverSideEncryption: string | null;
  metadata: Record<string, any>; // This is an example, you can define a specific type for metadata if needed
  location: string;
  etag: string;
  versionId: string;
  // Add other properties as needed
}

// Augment the Request type to include the file property with the custom type
