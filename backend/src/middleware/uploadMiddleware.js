import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// ==========================================
// CLOUDINARY CONFIG
// ==========================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==========================================
// CLOUDINARY STORAGES (Different Folders)
// ==========================================

// 1. Product Storage
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products", // Creates a 'products' folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
  },
});

// 2. Partner Storage
const partnerStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "partners", // Creates a 'partners' folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
  },
});

// 3. Blog Storage
const blogStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blogs", // Creates a 'blogs' folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
  },
});

// ==========================================
// UPLOAD MIDDLEWARES
// ==========================================
const limits = { fileSize: 5 * 1024 * 1024 }; // 5MB limit

export const uploadProduct = multer({ storage: productStorage, limits });
export const uploadPartner = multer({ storage: partnerStorage, limits });
export const uploadBlog = multer({ storage: blogStorage, limits });