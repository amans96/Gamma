
import prisma from "../utils/prisma.js";
import createActivityLog from "../utils/activityLogger.js";

// ==========================================
// CREATE SERVICE
// ==========================================

export const createService = async (req, res) => {
  try {
    const { name, slug, description, image, status } = req.body;

    // Validate required fields
    if (!name || !slug) {
      return res.status(400).json({
        message: "Service name and slug are required",
      });
    }

    // Check if slug already exists
    const existingService = await prisma.service.findUnique({
      where: {
        slug,
      },
    });

    if (existingService) {
      return res.status(409).json({
        message: "A service with this slug already exists",
      });
    }

    // Create service
    const service = await prisma.service.create({
      data: {
        name,
        slug,
        description: description || null,
        image: image || null,
        status: status || "ACTIVE",
      },
    });
    await createActivityLog({
  req,
  action: "CREATE",
  entity: "Service",
  entityId: service.id,
  details: `Created service "${service.name}"`,
});

    res.status(201).json({
      message: "Service created successfully",
      service,
    });

  } catch (error) {
    console.error("CREATE SERVICE ERROR:", error);

    res.status(500).json({
      message: "Failed to create service",
      error: error.message,
    });
  }
};


// ==========================================
// GET ALL SERVICES
// ADMIN
// ==========================================

export const getServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      count: services.length,
      services,
    });

  } catch (error) {
    console.error("GET SERVICES ERROR:", error);

    res.status(500).json({
      message: "Failed to get services",
      error: error.message,
    });
  }
};


// ==========================================
// GET ACTIVE SERVICES
// PUBLIC WEBSITE
// ==========================================

export const getActiveServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: {
        status: "ACTIVE",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      count: services.length,
      services,
    });

  } catch (error) {
    console.error("GET ACTIVE SERVICES ERROR:", error);

    res.status(500).json({
      message: "Failed to get active services",
      error: error.message,
    });
  }
};


// ==========================================
// GET SINGLE SERVICE
// PUBLIC
// ==========================================

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: {
        id,
      },
    });

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.status(200).json({
      service,
    });

  } catch (error) {
    console.error("GET SERVICE ERROR:", error);

    res.status(500).json({
      message: "Failed to get service",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE SERVICE
// ADMIN
// ==========================================

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      slug,
      description,
      image,
      status,
    } = req.body;

    // Check service exists
    const existingService = await prisma.service.findUnique({
      where: {
        id,
      },
    });

    if (!existingService) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Check slug if it is being changed
    if (slug && slug !== existingService.slug) {
      const slugExists = await prisma.service.findUnique({
        where: {
          slug,
        },
      });

      if (slugExists) {
        return res.status(409).json({
          message: "Another service already uses this slug",
        });
      }
    }

    // Update service
    const service = await prisma.service.update({
      where: {
        id,
      },
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
  entity: "Service",
  entityId: service.id,
  details: `Updated service "${service.name}"`,
});

    res.status(200).json({
      message: "Service updated successfully",
      service,
    });

  } catch (error) {
    console.error("UPDATE SERVICE ERROR:", error);

    res.status(500).json({
      message: "Failed to update service",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE SERVICE
// ADMIN
// ==========================================

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    // Check service exists
    const existingService = await prisma.service.findUnique({
      where: {
        id,
      },
    });

    if (!existingService) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Delete service
    await prisma.service.delete({
      where: {
        id,
      },
    });
    await createActivityLog({
  req,
  action: "DELETE",
  entity: "Service",
  entityId: existingService.id,
  details: `Deleted service "${existingService.name}"`,
});

    res.status(200).json({
      message: "Service deleted successfully",
    });

  } catch (error) {
    console.error("DELETE SERVICE ERROR:", error);

    res.status(500).json({
      message: "Failed to delete service",
      error: error.message,
    });
  }
};

