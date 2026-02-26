import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = (file, resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    if (!file) return reject("No file provided");

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder: "e-learning",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export default uploadOnCloudinary;