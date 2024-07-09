"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUploadedImages = exports.deleteS3BucketImage = void 0;
const s3_js_1 = __importDefault(require("aws-sdk/clients/s3.js"));
const fs_1 = __importDefault(require("fs"));
const uploadFile = (file) => {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const region = process.env.AWS_REGION;
    const accessKey = process.env.AWS_ACCESS_KEY;
    const secretKey = process.env.AWS_SECRET_KEY;
    const s3 = new s3_js_1.default({
        region,
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
    });
    try {
        const fileStream = fs_1.default.createReadStream(file.path);
        const uploadParams = {
            Bucket: bucketName,
            Body: fileStream,
            Key: file.filename,
        };
        return s3.upload(uploadParams).promise();
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.default = uploadFile;
const deleteS3BucketImage = (req, res, next) => {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const region = process.env.AWS_REGION;
    const accessKey = process.env.AWS_ACCESS_KEY;
    const secretKey = process.env.AWS_SECRET_KEY;
    const s3 = new s3_js_1.default({
        region,
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
    });
    try {
        const deleteParams = {
            Bucket: bucketName,
            Key: req.body.key,
        };
        s3.deleteObject(deleteParams, (err, data) => {
            if (err)
                throw new Error(err.message);
            else {
                return res.json({
                    status: "success",
                    message: "Image deleted",
                    data: JSON.stringify(data),
                });
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteS3BucketImage = deleteS3BucketImage;
const getAllUploadedImages = (maxKeys) => {
    const bucketName = process.env.AWS_BUCKET_NAME || "";
    const region = process.env.AWS_REGION;
    const accessKey = process.env.AWS_ACCESS_KEY;
    const secretKey = process.env.AWS_SECRET_KEY;
    const s3 = new s3_js_1.default({
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
exports.getAllUploadedImages = getAllUploadedImages;
