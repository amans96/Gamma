
import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import blogPostRoutes from "./routes/blogPostRoutes.js";
import partnerRoutes from "./routes/partnerRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import imageUploadRoutes from "./routes/imageUploadRoutes.js";

dotenv.config();

const app = express();

// ==========================================
// CORS CONFIGURATION
// ==========================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://firstorg.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("CORS blocked origin:", origin);

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// ==========================================
// GLOBAL MIDDLEWARE
// ==========================================

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);

  res.on("finish", () => {
    console.log(
      `⬅️ ${req.method} ${req.originalUrl} - ${res.statusCode}`
    );
  });

  next();
});

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/blog-posts", blogPostRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);

// Log every request that reaches the image router mount.
app.use("/api/images", (req, res, next) => {
  console.log("🖼️ IMAGE ROUTER REACHED:", req.method, req.path);
  next();
}, imageUploadRoutes);

console.log("✅ Image routes registered at /api/images");

// ==========================================
// STATIC UPLOADS
// ==========================================

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Company website API is running",
  });
});

// ==========================================
// API NOT FOUND
// ==========================================

app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("========== GLOBAL SERVER ERROR ==========");
  console.error(err);
  console.error("=========================================");

  if (res.headersSent) {
    return next(err);
  }

  if (err.message?.startsWith("Not allowed by CORS:")) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 API health check: http://localhost:${PORT}/api`);
});
