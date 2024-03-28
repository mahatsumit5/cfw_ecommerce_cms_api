import { AWSError } from "aws-sdk";
import S3 from "aws-sdk/clients/s3.js";
import { NextFunction, Request, Response } from "express";
import fs from "fs";

//upload file to s3
const uploadFile = (file: Express.Multer.File) => {
  const bucketName = process.env.AWS_BUCKET_NAME as string;
  const region = process.env.AWS_REGION;
  const accessKey = process.env.AWS_ACCESS_KEY;
  const secretKey = process.env.AWS_SECRET_KEY;

  const s3 = new S3({
    region,
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  });
  try {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: file.filename,
    };

    return s3.upload(uploadParams).promise();
  } catch (error: Error | any) {
    throw new Error(error.message);
  }
};
export default uploadFile;

export const deleteS3BucketImage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bucketName = process.env.AWS_BUCKET_NAME as string;
  const region = process.env.AWS_REGION;
  const accessKey = process.env.AWS_ACCESS_KEY;
  const secretKey = process.env.AWS_SECRET_KEY;

  const s3 = new S3({
    region,
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  });
  try {
    const deleteParams = {
      Bucket: bucketName,
      Key: req.body.key,
    };
    s3.deleteObject(deleteParams, (err: AWSError, data) => {
      if (err) throw new Error(err.message);
      else {
        return res.json({
          status: "success",
          message: "Image deleted",
          data: JSON.stringify(data),
        });
      }
    });
  } catch (error: Error | any) {
    next(error);
  }
};

// download a file from s3
export const getAllUploadedImages = (maxKeys: number) => {
  const bucketName = (process.env.AWS_BUCKET_NAME as string) || "";
  const region = process.env.AWS_REGION;
  const accessKey = process.env.AWS_ACCESS_KEY;
  const secretKey = process.env.AWS_SECRET_KEY;
  const s3 = new S3({
    region,
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  });

  return s3
    .listObjectsV2({
      MaxKeys: maxKeys,
      Bucket: bucketName,
    })
    .promise();
};
