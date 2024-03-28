import { Router } from "express";
import { deleteS3BucketImage, getAllUploadedImages } from "../utils/s3Bucket";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 10; // default is 10 items per page
    const data = await getAllUploadedImages(limit);

    return res.json({
      status: "success",
      images: data,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/", deleteS3BucketImage);
export default router;
