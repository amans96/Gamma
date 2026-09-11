import prisma from "../utils/prisma.js";
import createActivityLog from "../utils/activityLogger.js";
// ==========================================
// CREATE PRODUCT
// ==========================================
export const createProduct = async (req, res) => {
  try {
    const { name, slug, description, image, status } = req.body;

    // Validation
    if (!name || !slug) {
      return res.status(400).json({
        message: "Product name and slug are required",
      });
    }

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return res.status(409).json({
        message: "A product with this slug already exists",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        image,
        status: status || "ACTIVE",
      },
    });
    await createActivityLog({
  req,
  action: "CREATE",
  entity: "Product",
  entityId: product.id,
  details: `Created product "${product.name}"`,
});

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};


// ==========================================
// GET ALL PRODUCTS
// ==========================================
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    res.status(500).json({
      message: "Failed to get products",
      error: error.message,
    });
  }
};


// ==========================================
// GET ACTIVE PRODUCTS
// PUBLIC WEBSITE
// ==========================================
export const getActiveProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("GET ACTIVE PRODUCTS ERROR:", error);

    res.status(500).json({
      message: "Failed to get active products",
      error: error.message,
    });
  }
};


// ==========================================
// GET SINGLE PRODUCT
// ==========================================
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      product,
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Failed to get product",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE PRODUCT
// ==========================================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image, status } = req.body;

    // Check product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // If slug is being changed, check if another product uses it
    if (slug && slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return res.status(409).json({
          message: "Another product already uses this slug",
        });
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(status !== undefined && { status }),
      },
    });
await createActivityLog({
  req,
  action: "UPDATE",
  entity: "Product",
  entityId: product.id,
  details: `Updated product "${product.name}"`,
});
    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE PRODUCT
// ==========================================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await prisma.product.delete({
      where: { id },
    });
    await createActivityLog({
  req,
  action: "DELETE",
  entity: "Product",
  entityId: existingProduct.id,
  details: `Deleted product "${existingProduct.name}"`,
});

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};