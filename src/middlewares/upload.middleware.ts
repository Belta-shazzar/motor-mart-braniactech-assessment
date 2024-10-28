import config from "@/config/index";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: config.cloudinary.folder, // The folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
  } as Record<string, any>,
});

export default multer({ storage: storage });
