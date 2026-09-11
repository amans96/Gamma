
import prisma from "../utils/prisma.js";


// ==========================================
// GET ALL ACTIVITY LOGS
// ADMIN
// ==========================================

export const getActivityLogs = async (req, res) => {
  try {
    const logs = await prisma.activityLog.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.status(200).json({
      count: logs.length,
      logs,
    });

  } catch (error) {
    console.error("GET ACTIVITY LOGS ERROR:", error);

    res.status(500).json({
      message: "Failed to get activity logs",
      error: error.message,
    });
  }
};


// ==========================================
// GET CURRENT ADMIN'S ACTIVITY
// ADMIN
// ==========================================

export const getMyActivityLogs = async (req, res) => {
  try {
    const logs = await prisma.activityLog.findMany({
      where: {
        userId: req.user.id,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      count: logs.length,
      logs,
    });

  } catch (error) {
    console.error("GET MY ACTIVITY LOGS ERROR:", error);

    res.status(500).json({
      message: "Failed to get your activity logs",
      error: error.message,
    });
  }
};


// ==========================================
// GET ACTIVITY LOG BY ID
// ADMIN
// ==========================================

export const getActivityLogById = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await prisma.activityLog.findUnique({
      where: {
        id,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!log) {
      return res.status(404).json({
        message: "Activity log not found",
      });
    }

    res.status(200).json({
      log,
    });

  } catch (error) {
    console.error("GET ACTIVITY LOG ERROR:", error);

    res.status(500).json({
      message: "Failed to get activity log",
      error: error.message,
    });
  }
};


// ==========================================
// GET ACTIVITY LOGS BY ENTITY
// ADMIN
// ==========================================

export const getActivityLogsByEntity = async (req, res) => {
  try {
    const { entity } = req.params;

    const logs = await prisma.activityLog.findMany({
      where: {
        entity,
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.status(200).json({
      count: logs.length,
      logs,
    });

  } catch (error) {
    console.error("GET ACTIVITY LOGS BY ENTITY ERROR:", error);

    res.status(500).json({
      message: "Failed to get activity logs",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE ACTIVITY LOG
// ADMIN
// ==========================================

export const deleteActivityLog = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await prisma.activityLog.findUnique({
      where: {
        id,
      },
    });

    if (!log) {
      return res.status(404).json({
        message: "Activity log not found",
      });
    }

    await prisma.activityLog.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Activity log deleted successfully",
    });

  } catch (error) {
    console.error("DELETE ACTIVITY LOG ERROR:", error);

    res.status(500).json({
      message: "Failed to delete activity log",
      error: error.message,
    });
  }
};

