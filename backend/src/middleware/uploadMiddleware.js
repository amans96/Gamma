import multer from "multer";

const storage = multer.memoryStorage();

const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB maximum original upload
  files: 1,
};

const fileFilter = (req, file, callback) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return callback(
      new Error("Only JPEG, PNG, WebP, and GIF images are allowed.")
    );
  }

  callback(null, true);
};

const createUploader = () =>
  multer({
    storage,
    limits,
    fileFilter,
  });

export const uploadProduct = createUploader();
export const uploadPartner = createUploader();
export const uploadBlog = createUploader();