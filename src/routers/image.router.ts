import { Router } from "express";
import { upload } from "../middleware/multerMiddleware";
import uploadFile from "../utils/s3Bucket";
const router = Router();

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    if (req.file) {
      const { Location } = await uploadFile(req.file);
      Location
        ? res.json({
            status: "success",
            message: "Upload Successfull",
            Location,
          })
        : res.json({
            status: "error",
            message: "Something went wrong! Please Try Again.",
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
