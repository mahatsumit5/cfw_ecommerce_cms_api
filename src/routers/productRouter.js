import express from "express";
import slugify from "slugify";
import fs from "fs";
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
import uploadFile, { deleteFile } from "../utils/s3Bucket.js";
const router = express.Router();
router.post(
  "/",
  upload.array("images", 5),
  newProductValidation,
  async (req, res, next) => {
    try {
      if (req.files.length) {
        const arg = req.files.flatMap(async (element) => {
          const { Location } = await uploadFile(element);
          return Location;
        });
        req.body.images = await Promise.all(arg);
      }
      req.body.thumbnail = req.body.images[0];
      req.body.slug = slugify(req.body.title, { lower: true, trim: true });

      const result = await addProduct(req.body);
      result?._id
        ? res.json({
            status: "success",
            message: "New product Sucessfully added",
            imagesToDelete: req.files.map((item) => item.filename),
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
      const { _id, images } = req.body;

      if (req.files?.length) {
        const product = await getProductById(_id);
        for (let i = 0; i < product.images.length; i++) {
          if (images.indexOf(product.images[i]) === -1) {
            deleteFile(product.images[i].slice(57));
          }
        }
        const newImages = req.files.map(async (item) => {
          const { Location } = await uploadFile(item);
          return Location;
        });
        req.body.images = [
          ...req.body.images,
          ...(await Promise.all(newImages)),
        ];
      }

      const result = await updateProductById(req.body);

      result?._id
        ? res.json({
            status: "success",
            message: "updated Successfull",
            imagesToDelete: req?.files?.map((item) => item),
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
    const { _id } = req.params;
    const { images } = await getProductById(_id);

    images.map((img) => deleteFile(img.slice(57)));

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
  } catch (error) {
    next(error);
  }
});
export default router;
