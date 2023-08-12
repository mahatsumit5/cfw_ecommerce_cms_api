import express from "express";
import slugify from "slugify";
import {
  addProduct,
  deleteProductById,
  getProductById,
  getProducts,
  updateProductById,
} from "../model/product/productModel.js";
import { newProductValidation } from "../middleware/joiValidation.js";
import { upload } from "../middleware/multerMiddleware.js";
const router = express.Router();
router.post(
  "/",
  upload.array("images", 5),
  newProductValidation,
  async (req, res, next) => {
    try {
      if (req.files.length) {
        req.body.images = req.files.map((item) => item.path);
        req.body.thumbnail = req.body.images[0];
      }
      req.body.slug = slugify(req.body.title, { lower: true, trim: true });
      const result = await addProduct(req.body);
      result?._id
        ? res.json({
            status: "success",
            message: "New product Sucessfully added",
          })
        : res.json({
            status: "error",
            message: "Unable to add new category",
          });
    } catch (error) {
      if (error.message.includes("E11000 duplicate key error")) {
        error.statusCode = 400;
        error.message = "This slug is already avilable in the database.";
      }
      next(error);
    }
  }
);
router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const result = _id ? await getProductById() : await getProducts();
    res.json({
      status: "success",
      message: "Results received",
      result,
    });
  } catch (error) {
    next(error);
  }
});
router.put("/", upload.array("images", 5), async (req, res, next) => {
  try {
    const { value, ...rest } = req.body;
    console.log(req.body);
    if (req.files?.length) {
      req.body.images = req.files.map((item) => item.path);
    }
    const result = value
      ? await updateProductById(value, rest)
      : await updateProductById(rest._id, rest);

    result?._id
      ? res.json({
          status: "success",
          message: "updated",
        })
      : res.json({
          status: "error",
          message: "Unable to add new category",
        });
  } catch (error) {
    next(error);
  }
});
router.delete("/:_id", async (req, res, next) => {
  try {
    console.log(req.params);
    const { _id } = req.params;
    console.log(_id);
    const result = await deleteProductById(_id);
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
