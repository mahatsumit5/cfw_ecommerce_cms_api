import express from "express";
import {
  addCategory,
  deleteCategory,
  getCategory,
  getCategorybyId,
  updateCatagory,
} from "../model/categories/categoryModel.js";
import slugify from "slugify";
import { upload } from "../middleware/multerMiddleware.js";
import uploadFile, { deleteFile } from "../utils/s3Bucket.js";
const router = express.Router();

router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const result = !_id ? await getCategory() : await getCategorybyId(_id);

    res.json({
      status: "success",
      message: "Results received",
      result,
    });
  } catch (error) {
    next(error);
  }
});
router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    const { title } = req.body;
    !title &&
      res.json({
        status: "error",
        message: "Cannot Post Empty title",
      });
    if (req.file?.path) {
      const { Location } = await uploadFile(req.file);
      req.body.image = Location;
    }
    const obj = {
      image: req.body.image,
      title,
      slug: slugify(title, { lower: true, trim: true }),
    };
    const result = await addCategory(obj);
    result?._id
      ? res.json({
          status: "success",
          message: "New Category Sucessfully added",
          imageToDelete: req.file.filename,
        })
      : res.json({
          status: "error",
          message: "Unable to add new category",
        });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      error.statusCode = 400;
      error.message = "This title is already avilable in the database.";
    }
    next(error);
  }
});
router.put("/", upload.single("image"), async (req, res, next) => {
  try {
    const { value, ...rest } = req.body;
    if (req.file?.path) {
      const { Location } = await uploadFile(req.file);
      rest.image = Location;
    }
    const result = await updateCatagory(value, rest);
    const { title, status } = result;
    result?._id
      ? res.json({
          status: "success",
          message: `${title} is ${status}`,
          imageToDelete: req.file.filename,
        })
      : res.json({
          status: "error",
          message: "Unable to add new category",
        });
  } catch (error) {
    next(error);
  }
});
router.delete("/", async (req, res, next) => {
  try {
    const { _id } = req.body;
    const { image } = await getCategorybyId(_id);
    deleteFile(image.slice(57));
    const result = await deleteCategory(_id);
    result?._id
      ? res.json({
          status: "success",
          message: result.title + " deleted.",
        })
      : res.json({
          status: "error",
          message: "Unable to delete",
        });
  } catch (error) {
    next(error);
  }
});
export default router;
