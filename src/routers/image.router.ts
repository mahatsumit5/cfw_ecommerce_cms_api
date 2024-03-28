import { Router } from "express";
import { upload } from "../middleware/S3multerMiddleware";
const router = Router();

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    if (req?.file) {
      res.json({
        status: "success",
        message: "Upload Successfull",
        location: req.file.location,
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
