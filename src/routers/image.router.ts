import { Router } from "express";
import { upload } from "../middleware/S3multerMiddleware";
const router = Router();

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    if (req?.file) {
      const file = req.file as Express.MulterS3.File;
      res.json({
        status: "success",
        message: "Upload Successfull",
        location: file.location,
      });
    } else {
      return res.json({
        status: "error",
        message: "File must be provided",
      });
    }
  } catch (error) {
    next(error);
  }
});
export default router;
