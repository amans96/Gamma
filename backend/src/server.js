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

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
   "http://localhost:5175",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman / requests without an origin
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
  })
);

app.use(express.json());

// Debug every request
app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/blog-posts", blogPostRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);

// Images/uploads
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.use("/api/images", imageUploadRoutes);

// API health check
app.get("/api", (req, res) => {
  res.json({
    message: "Company website API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("========== GLOBAL SERVER ERROR ==========");
  console.error(err);
  console.error("=========================================");

  res.status(500).json({
    message: err.message || "Internal server error",
  });
});

