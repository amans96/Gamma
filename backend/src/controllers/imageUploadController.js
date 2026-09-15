// ==========================================
// UPLOAD PRODUCT IMAGE
// ==========================================
export const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image file was uploaded",
      });
    }

    // Cloudinary puts the full secure URL right into req.file.path!
    const imageUrl = req.file.path;

    console.log("PRODUCT IMAGE SAVED TO CLOUDINARY:");
    console.log("URL:", imageUrl);

    return res.status(200).json({
      message: "Product image uploaded successfully",
      image: imageUrl,
    });
  } catch (error) {
    console.error("PRODUCT IMAGE UPLOAD ERROR:", error);
    return res.status(500).json({
      message: "Failed to upload product image",
      error: error.message,
    });
  }
};

// ==========================================
// UPLOAD PARTNER IMAGE
// ==========================================
export const uploadPartnerImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image file was uploaded",
      });
    }

    const imageUrl = req.file.path;

    console.log("PARTNER IMAGE SAVED TO CLOUDINARY:");
    console.log("URL:", imageUrl);

    return res.status(200).json({
      message: "Partner image uploaded successfully",
      image: imageUrl,
    });
  } catch (error) {
    console.error("PARTNER IMAGE UPLOAD ERROR:", error);
    return res.status(500).json({
      message: "Failed to upload partner image",
      error: error.message,
    });
  }
};

// ==========================================
// UPLOAD BLOG IMAGE
// ==========================================
export const uploadBlogImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image file was uploaded",
      });
    }

    const imageUrl = req.file.path;

    console.log("BLOG IMAGE SAVED TO CLOUDINARY:");
    console.log("URL:", imageUrl);

    return res.status(200).json({
      message: "Blog image uploaded successfully",
      image: imageUrl,
    });
  } catch (error) {
    console.error("BLOG IMAGE UPLOAD ERROR:", error);
    return res.status(500).json({
      message: "Failed to upload blog image",
      error: error.message,
    });
  }
};