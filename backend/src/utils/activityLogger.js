import prisma from "./prisma.js";

const createActivityLog = async ({
  req,
  action,
  entity,
  entityId = null,
  details = null,
}) => {
  try {
    await prisma.activityLog.create({
      data: {
        action,
        entity,
        entityId,
        details,
        userId: req.user?.id || null,
      },
    });
  } catch (error) {
    // Activity logging should not break the main operation
    console.error("CREATE ACTIVITY LOG ERROR:", error);
  }
};

export default createActivityLog;