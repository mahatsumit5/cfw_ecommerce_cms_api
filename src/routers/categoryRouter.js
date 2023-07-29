import express from "express";
import {
  addCategory,
  deleteCategory,
  getCategory,
  updateCatagory,
} from "../model/categories/categoryModel.js";
import slugify from "slugify";
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await getCategory();

    res.json({
      status: "success",
      message: "Results received      ",
      result,
    });
  } catch (error) {
    next(error);
  }
});
router.post("/", async (req, res, next) => {
  try {
    const { title } = req.body;
    !title &&
      res.json({
        status: "error",
        message: "Cannot Post Empty title",
      });
    const obj = {
      title,
      slug: slugify(title, { lower: true, trim: true }),
    };
    const result = await addCategory(obj);
    result?._id
      ? res.json({
          status: "success",
          message: "New Category Sucessfully added",
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
router.put("/", async (req, res, next) => {
  try {
    const { value, ...rest } = req.body;
    console.log(req.body);
    const result = await updateCatagory(value, rest);
    const { title, status } = result;
    result?._id
      ? res.json({
          status: "success",
          message: `${title} is ${status}`,
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
    console.log(_id);
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
