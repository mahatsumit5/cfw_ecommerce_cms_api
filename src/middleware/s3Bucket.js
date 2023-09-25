import S3 from "aws-sdk/clients/s3.js";
import AWS from "aws-sdk";
import fs from "fs";

//upload file to s3
const uploadFile = (file) => {
  const bucketName = process.env.AWS_BUCKET_NAME;
  const region = process.env.AWS_REGION;
  const accessKey = process.env.AWS_ACCESS_kEY;
  const secretKey = process.env.AWS_SECRET_KEY;

  const s3 = new S3({
    region,
    accessKey,
    secretKey,
  });
  try {
    console.log(file, "coming from bucket ");
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: file.filename,
    };
    return s3.upload(uploadParams).promise();
  } catch (error) {
    console.log(error);
  }
};
export default uploadFile;
// download a file from s3
