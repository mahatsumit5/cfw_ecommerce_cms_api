"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = void 0;
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
        console.log(file.path);
        const fileStream = fs_1.default.createReadStream(file.path);
        const uploadParams = {
            Bucket: bucketName,
            Body: fileStream,
            Key: file.filename,
        };
        return s3.upload(uploadParams).promise();
    }
    catch (error) {
        console.log(error);
    }
};
const deleteFile = (file) => {
    console.log(file, "coming from delete function");
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
            Key: file,
        };
        return s3.deleteObject(deleteParams, function (err, data) {
            if (err) {
                console.log(err);
            }
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.deleteFile = deleteFile;
exports.default = uploadFile;
