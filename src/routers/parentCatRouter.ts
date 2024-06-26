import express from "express";

import slugify from "slugify";
import {
  addMainCat,
  deleteMainCat,
  getMainCat,
  getMainCatById,
  updateMainCat,
} from "../model/parentCat/parentCatModel";

const router = express.Router();

router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const result = !_id ? await getMainCat() : await getMainCatById(_id);

    res.json({
      status: "success",
      message: "Results receivedss",
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
    const result = await addMainCat(obj);
    result?._id
      ? res.json({
          status: "success",
          message: "New Category Sucessfully added",
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
    const { value, ...rest } = req.body;
    const result = await updateMainCat(value, rest);

    result?._id
      ? res.json({
          status: "success",
          message: `${result.title} is ${result.status}`,
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
    const result = await deleteMainCat(_id);
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
