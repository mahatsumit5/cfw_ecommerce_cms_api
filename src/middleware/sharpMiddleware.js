import sharp from "sharp";
export const imageResize = (filePath) => {
  try {
    console.log("inside sharrp");
    sharp(
      "public\\img\\products\\1695474713218-http___static.theiconic.com.au_p_missoni-0157-8817291-1.jpg"
    )
      .resize(200, 200, {
        fit: sharp.fit.outside,
        withoutReduction: true,
      })
      .toFile("new image.jpg")
      .toFormat("jpeg")
      .toBuffer()
      .then(() => {
        console.log("image has been resized");
      });
  } catch (error) {}
};
