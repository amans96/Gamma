
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";


// ==========================================
// PROTECT ROUTES
// ==========================================

export const protect = async (req, res, next) => {
  try {
    console.log("AUTH: protect middleware reached");

    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER EXISTS:", !!authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided. Authorization required.",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("AUTH: token received:", !!token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("AUTH: token verified");
    console.log("AUTH: decoded userId:", decoded.userId);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    console.log("AUTH: user found:", !!user);

    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }

    req.user = user;

    console.log("AUTH: authentication successful");

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
      error: error.message,
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
