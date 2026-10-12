import { PrismaClient } from "@prisma/client";
import sharp from "sharp";

const prisma = new PrismaClient();

const MAX_OUTPUT_SIZE = 2 * 1024 * 1024; // 2 MB

const saveImage = async (req, res, category, label) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({
        message: "No image file was uploaded",
      });
    }

    // Decode the image, correct its orientation, and resize it.
    const compressedBuffer = await sharp(req.file.buffer, {
      failOn: "error",
    })
      .rotate()
      .resize({
        width: 1600,
        height: 1600,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 80,
        effort: 4,
      })
      .toBuffer();

    if (compressedBuffer.length > MAX_OUTPUT_SIZE) {
      return res.status(400).json({
        message:
          "The compressed image is still too large. Please upload a smaller image.",
      });
    }

    const storedImage = await prisma.storedImage.create({
      data: {
        category,
        mimeType: "image/webp",
        data: compressedBuffer,
        fileSize: compressedBuffer.length,
        originalName: req.file.originalname,
      },
      select: {
        id: true,
        fileSize: true,
      },
    });

    const configuredBaseUrl = process.env.PUBLIC_API_URL?.replace(/\/+$/, "");

    const forwardedProtocol = req.get("x-forwarded-proto")?.split(",")[0];
    const protocol = forwardedProtocol || req.protocol;
    const baseUrl = configuredBaseUrl || `${protocol}://${req.get("host")}`;

    const imageUrl = `${baseUrl}/api/images/${storedImage.id}`;

    console.log(`${label} image saved to PostgreSQL`);
    console.log("Image ID:", storedImage.id);
    console.log("Compressed size:", storedImage.fileSize, "bytes");

    return res.status(201).json({
      message: `${label} image uploaded successfully`,
      image: imageUrl,
    });
  } catch (error) {
    console.error(`${label.toUpperCase()} IMAGE UPLOAD ERROR:`, error);

    if (
      error.message?.includes("Input buffer") ||
      error.message?.includes("unsupported image format") ||
      error.message?.includes("Corrupt JPEG")
    ) {
      return res.status(400).json({
        message: "The uploaded file is not a valid supported image.",
      });
    }

    return res.status(500).json({
      message: `Failed to upload ${label.toLowerCase()} image`,
    });
  }
};

// ==========================================
// UPLOAD PRODUCT IMAGE
// ==========================================
export const uploadProductImage = (req, res) =>
  saveImage(req, res, "PRODUCT", "Product");

// ==========================================
// UPLOAD PARTNER IMAGE
// ==========================================
export const uploadPartnerImage = (req, res) =>
  saveImage(req, res, "PARTNER", "Partner");

// ==========================================
// UPLOAD BLOG IMAGE
// ==========================================
export const uploadBlogImage = (req, res) =>
  saveImage(req, res, "BLOG", "Blog");

// ==========================================
// SERVE AN IMAGE FROM POSTGRESQL
// ==========================================
export const getStoredImage = async (req, res) => {
  try {
    const image = await prisma.storedImage.findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        mimeType: true,
        data: true,
        fileSize: true,
      },
    });

    if (!image) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    res.set({
      "Content-Type": image.mimeType,
      "Content-Length": String(image.fileSize),
      "Cache-Control": "public, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    });

    return res.send(image.data);
  } catch (error) {
    console.error("IMAGE RETRIEVAL ERROR:", error);

    return res.status(500).json({
      message: "Failed to retrieve image",
    });
  }
};