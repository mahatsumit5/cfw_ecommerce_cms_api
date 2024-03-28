import express from "express";
import slugify from "slugify";
import fs from "fs";
import {
  addProduct,
  deleteProductById,
  getProductById,
  getProducts,
  updateProductById,
} from "../model/product/productModel";
import {
  newProductValidation,
  updateProductValidation,
} from "../middleware/joiValidation";
import { upload } from "../middleware/S3multerMiddleware";

const router = express.Router();

router.post(
  "/",
  upload.array("images", 5),
  newProductValidation,
  async (req, res, next) => {
    try {
      if (req?.files?.length) {
        const files = req.files as Express.MulterS3.File[];
        req.body.images = files.map(
          (item: Express.MulterS3.File) => item.location
        );
        req.body.thumbnail = req.body.images[0];
        req.body.slug = slugify(req.body.title, { lower: true, trim: true });
        const result = await addProduct(req.body);
        result?._id
          ? res.json({
              status: "success",
              message: "New product Sucessfully added",
              data: result,
            })
          : res.json({
              status: "error",
              message: "Unable to add new category",
            });
      }
    } catch (error: Error | any) {
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
  } catch (error: Error | any) {
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
        const files = req.files as Express.MulterS3.File[];
        const newImages = files.map(
          (file: Express.MulterS3.File) => file.location
        );
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
    } catch (error: Error | any) {
      console.log(error);
      next(error);
    }
  }
);
router.delete("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const data = await getProductById(_id);

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
  } catch (error: Error | any) {
    next(error);
  }
});

router.post("/deleteFileFromServer", async (req, res, next) => {
  const { fileName } = req.body;
  console.log(fileName);
  if (!fileName) {
    return res.json({
      status: "error",
      message: "folder name is required",
    });
  }
  const rootFolder = "public/img/products";
  const path = `${rootFolder}/${fileName}`;
  try {
    fs.unlink(path, (err) => {
      if (err) {
        return res.json(err);
      }
      return res.json({
        status: "success",
        message: "File deleted from the server",
      });
    });
  } catch (error: Error | any) {
    next(error);
  }
});
export default router;
