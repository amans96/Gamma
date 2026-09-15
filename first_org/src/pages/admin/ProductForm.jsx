import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  Type,
  Link as LinkIcon,
  FileText,
  Activity,
} from "lucide-react";

// Dynamically use the hosted API URL if it exists, otherwise use localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Framer Motion variants
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", duration: 0.4, bounce: 0 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

export default function ProductModal({ isOpen, product, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    status: "ACTIVE",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // FILL FORM WHEN EDITING
  // ==========================================

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        slug: product.slug || "",
        description: product.description || "",
        image: product.image || "", // This will now be a Cloudinary URL
        status: product.status || "ACTIVE",
      });

      // Since Cloudinary returns full http(s) URLs, we can just use the image directly
      setPreview(product.image || "");
    } else {
      setFormData({
        name: "",
        slug: "",
        description: "",
        image: "",
        status: "ACTIVE",
      });
      setPreview("");
    }

    setSelectedImage(null);
    setError("");
  }, [product, isOpen]);

  // ==========================================
  // NORMAL INPUT CHANGES
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // IMAGE SELECT
  // ==========================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, WEBP or GIF image.");
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setError("");
    setSelectedImage(file);

    // Local preview while they fill out the rest of the form
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  // ==========================================
  // UPLOAD IMAGE TO CLOUDINARY VIA BACKEND
  // ==========================================

  const uploadImage = async () => {
    if (!selectedImage) return formData.image;

    const token = localStorage.getItem("token");
    const uploadData = new FormData();
    uploadData.append("image", selectedImage); // Must match 'upload.single("image")' in your backend

    setUploading(true);

    try {
      // Changed endpoint from '/images/product' to '/images/upload' to match your backend
      const response = await fetch(`${API_URL}/images/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT set Content-Type here, the browser handles the boundary for FormData automatically
        },
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload image to Cloudinary");
      }

      // Backend should now return the Cloudinary URL (e.g., res.json({ success: true, imageUrl: req.file.path }))
      return data.imageUrl || data.image; 
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");
      const isEditing = Boolean(product);
      const url = isEditing
        ? `${API_URL}/products/${product.id}`
        : `${API_URL}/products`;

      // 1. If there's a new image, upload it first to get the Cloudinary URL
      let finalImageUrl = formData.image;
      if (selectedImage) {
        finalImageUrl = await uploadImage();
      }

      // 2. Send the rest of the product data + the final URL to your database
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          image: finalImageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to ${isEditing ? "update" : "create"} product`
        );
      }

      onSuccess();
    } catch (err) {
      console.error("PRODUCT SAVE ERROR:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
            onMouseDown={() => {
              if (!saving && !uploading) onClose();
            }}
          />

          {/* Modal Content */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {product ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {product
                    ? "Update the details and information of your product."
                    : "Fill in the details below to add a new product to your inventory."}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={saving || uploading}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="custom-scrollbar overflow-y-auto px-6 py-6">
              {/* Error Banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
                  >
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Product Name
                    </label>
                    <div className="group relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Type className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-indigo-500" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Wireless Headphones"
                        required
                        className="block w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                  </div>

                  {/* Slug */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      URL Slug
                    </label>
                    <div className="group relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <LinkIcon className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-indigo-500" />
                      </div>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="wireless-headphones"
                        required
                        className="block w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Description
                  </label>
                  <div className="group relative">
                    <div className="pointer-events-none absolute left-3 top-3">
                      <FileText className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-indigo-500" />
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Write a detailed description of your product..."
                      rows={4}
                      className="block w-full resize-none rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                {/* Image Dropzone */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Product Image
                  </label>

                  <div className="mt-2">
                    {preview ? (
                      <div className="group relative h-48 w-full overflow-hidden rounded-2xl border-2 border-gray-200 bg-gray-50">
                        <img
                          src={preview}
                          alt="Preview"
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <label className="cursor-pointer rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-50">
                            Change Image
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="group flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 transition-colors hover:border-indigo-400 hover:bg-indigo-50">
                        <div className="flex flex-col items-center justify-center pb-6 pt-5">
                          <div className="mb-3 rounded-full bg-white p-3 shadow-sm transition-transform group-hover:scale-110">
                            <UploadCloud className="h-6 w-6 text-indigo-500" />
                          </div>
                          <p className="mb-1 text-sm text-gray-600">
                            <span className="font-semibold text-indigo-600">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            JPG, PNG, WEBP, or GIF (max 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2 pb-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Status
                  </label>
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Activity className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-indigo-500" />
                    </div>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="block w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                    {/* Custom Dropdown Arrow */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 rounded-b-2xl border-t border-gray-100 bg-gray-50/50 px-6 py-5">
              <button
                type="button"
                onClick={onClose}
                disabled={saving || uploading}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="product-form"
                disabled={saving || uploading}
                className="min-w-[140px] inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95 disabled:pointer-events-none disabled:opacity-70"
              >
                {saving || uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {uploading ? "Uploading..." : "Saving..."}
                  </>
                ) : product ? (
                  "Save Changes"
                ) : (
                  "Create Product"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}