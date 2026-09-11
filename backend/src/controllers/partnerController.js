
import prisma from "../utils/prisma.js";
import createActivityLog from "../utils/activityLogger.js";

// ==========================================
// CREATE PARTNER
// ADMIN
// ==========================================

export const createPartner = async (req, res) => {
  try {
    const {
      name,
      description,
      logo,
      website,
      isActive,
    } = req.body;

    // Validate required field
    if (!name) {
      return res.status(400).json({
        message: "Partner name is required",
      });
    }

    // Create partner
    const partner = await prisma.partner.create({
      data: {
        name,
        description: description || null,
        logo: logo || null,
        website: website || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });
    await createActivityLog({
  req,
  action: "CREATE",
  entity: "Partner",
  entityId: partner.id,
  details: `Created partner "${partner.name}"`,
});

    res.status(201).json({
      message: "Partner created successfully",
      partner,
    });

  } catch (error) {
    console.error("CREATE PARTNER ERROR:", error);

    res.status(500).json({
      message: "Failed to create partner",
      error: error.message,
    });
  }
};


// ==========================================
// GET ALL PARTNERS
// ADMIN
// ==========================================

export const getPartners = async (req, res) => {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      count: partners.length,
      partners,
    });

  } catch (error) {
    console.error("GET PARTNERS ERROR:", error);

    res.status(500).json({
      message: "Failed to get partners",
      error: error.message,
    });
  }
};


// ==========================================
// GET ACTIVE PARTNERS
// PUBLIC WEBSITE
// ==========================================

export const getActivePartners = async (req, res) => {
  try {
    const partners = await prisma.partner.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      count: partners.length,
      partners,
    });

  } catch (error) {
    console.error("GET ACTIVE PARTNERS ERROR:", error);

    res.status(500).json({
      message: "Failed to get active partners",
      error: error.message,
    });
  }
};


// ==========================================
// GET SINGLE PARTNER
// PUBLIC
// ==========================================

export const getPartnerById = async (req, res) => {
  try {
    const { id } = req.params;

    const partner = await prisma.partner.findUnique({
      where: {
        id,
      },
    });

    if (!partner) {
      return res.status(404).json({
        message: "Partner not found",
      });
    }

    res.status(200).json({
      partner,
    });

  } catch (error) {
    console.error("GET PARTNER ERROR:", error);

    res.status(500).json({
      message: "Failed to get partner",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE PARTNER
// ADMIN
// ==========================================

export const updatePartner = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      logo,
      website,
      isActive,
    } = req.body;

    // Check if partner exists
    const existingPartner = await prisma.partner.findUnique({
      where: {
        id,
      },
    });

    if (!existingPartner) {
      return res.status(404).json({
        message: "Partner not found",
      });
    }

    // Update partner
    const partner = await prisma.partner.update({
      where: {
        id,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(logo !== undefined && { logo }),
        ...(website !== undefined && { website }),
        ...(isActive !== undefined && { isActive }),
      },
    });
    await createActivityLog({
  req,
  action: "UPDATE",
  entity: "Partner",
  entityId: partner.id,
  details: `Updated partner "${partner.name}"`,
});

    res.status(200).json({
      message: "Partner updated successfully",
      partner,
    });

  } catch (error) {
    console.error("UPDATE PARTNER ERROR:", error);

    res.status(500).json({
      message: "Failed to update partner",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE PARTNER
// ADMIN
// ==========================================

export const deletePartner = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if partner exists
    const existingPartner = await prisma.partner.findUnique({
      where: {
        id,
      },
    });

    if (!existingPartner) {
      return res.status(404).json({
        message: "Partner not found",
      });
    }

    // Delete partner
    await prisma.partner.delete({
      where: {
        id,
      },
    });
    await createActivityLog({
  req,
  action: "DELETE",
  entity: "Partner",
  entityId: existingPartner.id,
  details: `Deleted partner "${existingPartner.name}"`,
});

    res.status(200).json({
      message: "Partner deleted successfully",
    });

  } catch (error) {
    console.error("DELETE PARTNER ERROR:", error);

    res.status(500).json({
      message: "Failed to delete partner",
      error: error.message,
    });
  }
};
