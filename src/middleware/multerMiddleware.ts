import multer from "multer";
// setup multer
const imageFolderPath = "public/img/products/";
const storage = multer.diskStorage({
  //where do you want to store the file

  destination: (req, file, cb) => {
    cb(null, imageFolderPath);
  },
  //what name do you wnat to give
  filename: (req, file, cb) => {
    //rename fileName
    const fileName = Date.now() + "-" + file.originalname;
    cb(null, fileName);
  },
});
export const upload = multer({ storage });
