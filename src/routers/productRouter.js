import express from "express";
import multer from "multer";
import slugify from "slugify";
import {
  addProduct,
  deleteProductById,
  getProducts,
} from "../model/product/productModel.js";
import { newProductValidation } from "../middleware/joiValidation.js";

const router = express.Router();
const imageFolderPath = "public/img/products/";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageFolderPath);
  },
  filename: (req, file, cb) => {
    //rename fileName
    const fileName = Date.now() + "-" + file.originalname;
    cb(null, fileName);
  },
});
// setup multer
const upload = multer({ storage });
//where do you want to store the file
//what name do you wnat to give

router.post(
  "/",
  upload.array("images", 5),
  newProductValidation,
  async (req, res, next) => {
    try {
      console.log(req.files.length);
      if (req.files.length) {
        return (req.body.images = files.map((item) => item.path));
      }
      req.body.slug = slugify(req.body.name, { lower: true, trim: true });
      console.log(req.body);

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
        error.message = "This title is already avilable in the database.";
      }
      next(error);
    }
  }
);
router.get("/", async (req, res, next) => {
  try {
    const result = await getProducts();
    res.json({
      status: "success",
      message: "Results received",
      result,
    });
  } catch (error) {
    next(error);
  }
});
// router.put("/", async (req, res, next) => {
//   try {
//     const { value, ...rest } = req.body;
//     const result = await updateCatagory(value, rest);
//     const { title, status } = result;
//     result?._id
//       ? res.json({
//           status: "success",
//           message: `${title} is ${status}`,
//         })
//       : res.json({
//           status: "error",
//           message: "Unable to add new category",
//         });
//   } catch (error) {
//     next(error);
//   }
// });
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
