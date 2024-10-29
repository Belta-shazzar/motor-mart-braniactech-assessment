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
    folder: config.cloudinary.folder,
    allowed_formats: ["jpg", "png", "jpeg"],
    resource_type: "auto",
    quality: "auto", // Automatic quality optimization
    fetch_format: "auto", // Automatically choose best format
    flags: "progressive", // Enable progressive loading
    transformation: [
      { width: 1920, crop: "limit" }, // Limit maximum width while maintaining aspect ratio
      { quality: "auto:good" } // Balanced quality optimization
    ],
    eager: [ // Generate different sizes on upload
      { width: 800, crop: "scale" },
      { width: 400, crop: "scale" }
    ],
    eager_async: true, // Async transformations
  } as Record<string, any>,
});

export default multer({ storage: storage });
