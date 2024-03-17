import express from "express";
import {
  addCategory,
  deleteCategory,
  getCategory,
  getCategorybyId,
  updateCatagory,
} from "../model/categories/categoryModel";
import slugify from "slugify";
import { upload } from "../middleware/multerMiddleware";
import uploadFile, { deleteFile } from "../utils/s3Bucket";
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
    const { title, parentCategory } = req.body;
    const file = req.file;
    if (req.file?.path) {
      const data = await uploadFile(req.file);

      req.body.image = data?.Location;
    } else {
      throw new Error("Image is required.");
    }
    const obj = {
      image: req.body.image,
      title,
      slug: slugify(title, { lower: true, trim: true }),
      parentCategory,
    };
    const result = await addCategory(obj);
    result?._id
      ? res.json({
          status: "success",
          message: "New Category Sucessfully added",
          result,
          imagesToDelete: req.file.filename,
        })
      : res.json({
          status: "error",
          message: "Unable to add new category",
        });
  } catch (error: Error | any) {
    if (error.message.includes("E11000 duplicate key error")) {
      error.statusCode = 400;
      error.message = "This title is already avilable in the database.";
    }
    next(error);
  }
});
router.put("/", upload.single("image"), async (req, res, next) => {
  try {
    const { _id, ...rest } = req.body;

    if (req.file?.path) {
      const data = await uploadFile(req.file);
      req.body.image = data?.Location;
    }
    const result = await updateCatagory(_id, {
      ...rest,
      image: req.body.image,
    });

    result?._id
      ? res.json({
          status: "success",
          message: `Update successfull`,
          imagesToDelete: req?.file?.filename,
        })
      : res.json({
          status: "error",
          message: "Unable to update new category",
        });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.delete("/", async (req, res, next) => {
  try {
    const { _id } = req.body;
    const category = await getCategorybyId(_id);
    if (!category?.image) {
      throw new Error("category image not found");
    }
    deleteFile(category.image.slice(57));
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
