import S3 from "aws-sdk/clients/s3.js";
import { error } from "console";
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

export const deleteFile = (file: string) => {
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
      Key: file,
    };
    return s3.deleteObject(deleteParams, function (err, data) {
      if (err) {
        console.log(err);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
export default uploadFile;
// download a file from s3
export const getObject = async () => {
  const bucketName = (process.env.AWS_BUCKET_NAME as string) || "";
  const region = process.env.AWS_REGION;
  const accessKey = process.env.AWS_ACCESS_KEY;
  const secretKey = process.env.AWS_SECRET_KEY;

  const s3 = new S3({
    region,
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  });
  s3.getObject({ Bucket: bucketName, Key: "sdfdsf" }, (error, data) => {
    if (error) console.log(error);
    else console.log(data);
  });
};

getObject();
