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
router.post("/", async (req, res, next) => {
  try {
    const slug = slugify(req.body.title, { lower: true, trim: true });

    const result = await addCategory({ ...req.body, slug });
    result?._id
      ? res.json({
          status: "success",
          message: "New Category Sucessfully added",
          result,
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
router.put("/", async (req, res, next) => {
  try {
    const { _id, ...rest } = req.body;
    const result = await updateCatagory(_id, {
      ...rest,
    });

    result?._id
      ? res.json({
          status: "success",
          message: `Update successfull`,
        })
      : res.json({
          status: "error",
          message: "Unable to update new category",
        });
  } catch (error) {
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
