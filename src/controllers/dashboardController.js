import prisma from "../utils/prisma.js";

// ==========================================
// GET ADMIN DASHBOARD
// ADMIN
// ==========================================

export const getDashboard = async (req, res) => {
  try {
    const [
      products,
      services,
      blogPosts,
      partners,
      recentActivity,
    ] = await Promise.all([
      prisma.product.count(),

      prisma.service.count(),

      prisma.blogPost.count(),

      prisma.partner.count(),

      prisma.activityLog.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,

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
      }),
    ]);

    res.status(200).json({
      stats: {
        products,
        services,
        blogPosts,
        partners,
      },

      recentActivity,
    });

  } catch (error) {
    console.error("GET DASHBOARD ERROR:", error);

    res.status(500).json({
      message: "Failed to get dashboard data",
      error: error.message,
    });
  }
};