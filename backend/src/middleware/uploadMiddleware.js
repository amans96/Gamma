import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Backend root
const backendRoot = path.resolve(__dirname, "../..");

// Upload folders
const productUploadDir = path.join(
  backendRoot,
  "uploads",
  "products"
);

const partnerUploadDir = path.join(
  backendRoot,
  "uploads",
  "partners"
);

const blogUploadDir = path.join(
  backendRoot,
  "uploads",
  "blogs"
);

// Make sure folders exist
if (!fs.existsSync(productUploadDir)) {
  fs.mkdirSync(productUploadDir, { recursive: true });
}

if (!fs.existsSync(partnerUploadDir)) {
  fs.mkdirSync(partnerUploadDir, { recursive: true });
}

if (!fs.existsSync(blogUploadDir)) {
  fs.mkdirSync(blogUploadDir, { recursive: true });
}


// ==========================================
// PRODUCT STORAGE
// ==========================================

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productUploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});


// ==========================================
// PARTNER STORAGE
// ==========================================

const partnerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, partnerUploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});


// ==========================================
// BLOG STORAGE
// ==========================================

const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, blogUploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});


// ==========================================
// IMAGE FILTER
// ==========================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP and GIF images are allowed"
      ),
      false
    );
  }
};


// ==========================================
// PRODUCT UPLOAD
// ==========================================

export const uploadProduct = multer({
  storage: productStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});


// ==========================================
// PARTNER UPLOAD
// ==========================================

export const uploadPartner = multer({
  storage: partnerStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});


// ==========================================
// BLOG UPLOAD
// ==========================================

export const uploadBlog = multer({
  storage: blogStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});