import express from "express";
import slugify from "slugify";
import {
  addProduct,
  deleteProductById,
  getProductById,
  getProducts,
  updateProductById,
} from "../model/product/productModel.js";
import {
  newProductValidation,
  updateProductValidation,
} from "../middleware/joiValidation.js";
import { upload } from "../middleware/multerMiddleware.js";
import { imageResize } from "../middleware/sharpMiddleware.js";
import uploadFile from "../middleware/s3Bucket.js";
const router = express.Router();
router.post(
  "/",
  upload.array("images", 5),
  newProductValidation,
  async (req, res, next) => {
    try {
      const data = await uploadFile(req.files[0]);
      console.log(data);
      if (req.files.length) {
        req.body.images = req.files.map((item) => {
          // uploadFile(item).then((response) => {
          //   console.log(response);
          // });
          return item.path;
        });
        req.body.thumbnail = data.Location;
      }
      req.body.slug = slugify(req.body.title, { lower: true, trim: true });
      // return;
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
        error.statusCode = 200;
        error.message = "This slug is already avilable in the database.";
      }
      next(error);
    }
  }
);
router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const result = _id ? await getProductById(_id) : await getProducts();
    res.json({
      status: "success",
      message: "Results received",
      result,
    });
  } catch (error) {
    next(error);
  }
});
router.put(
  "/",
  upload.array("images", 5),
  updateProductValidation,
  async (req, res, next) => {
    try {
      if (req.files?.length) {
        const newImages = req.files.map((item) => item.path);
        req.body.images = [...req.body.images, ...newImages];
      }
      const result = await updateProductById(req.body);

      result?._id
        ? res.json({
            status: "success",
            message: "updated Successfull",
          })
        : res.json({
            status: "error",
            message: "Unable to update.",
          });
    } catch (error) {
      next(error);
    }
  }
);
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
