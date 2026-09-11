
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";


// ==========================================
// PROTECT ROUTES
// ==========================================

export const protect = async (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided. Authorization required.",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in database
    const user = await prisma.user.findUnique({
   where: {
  id: decoded.userId,
},
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }

    // Attach user to request
    req.user = user;

    next();

  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired.",
      });
    }

    return res.status(500).json({
      message: "Authentication failed.",
    });
  }
};


// ==========================================
// ADMIN ONLY
// ==========================================

export const adminOnly = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Access denied. Admin only.",
    });
  }

  next();
};
