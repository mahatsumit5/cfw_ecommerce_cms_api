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
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string;
      SMTP_HOST: string;
      SMTP_PORT: string;
      SMTP_USER: string;
      SMTP_PASS: string;
      WEB_DOMAIN: string;
      JWT_ACCESS_SECRET: string;
      JWT_REFRESH_SECRET: string;
      AWS_BUCKET_NAME: string;
      AWS_REGION: string;
      AWS_ACCESS_KEY: string;
      AWS_SECRET_KEY: string;
      BASE_URL: string;
      CLIENT_ID: string;
      ISSUER_BASE_URL: string;
      SECRET: string;
      NODE_ENV: "development" | "production";
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
