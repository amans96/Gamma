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
  Activity 
} from "lucide-react";

const API_URL = "http://localhost:5000/api";
const SERVER_URL = "http://localhost:5000";

// Framer Motion variants
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", duration: 0.4, bounce: 0 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
};

export default function ProductModal({
  isOpen,
  product,
  onClose,
  onSuccess,
}) {
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
        image: product.image || "",
        status: product.status || "ACTIVE",
      });

      if (product.image) {
        setPreview(
          product.image.startsWith("http")
            ? product.image
            : `${SERVER_URL}${product.image}`
        );
      } else {
        setPreview("");
      }
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
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
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

    // Local preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  // ==========================================
  // UPLOAD IMAGE
  // ==========================================

  const uploadImage = async () => {
    if (!selectedImage) return formData.image;

    const token = localStorage.getItem("token");
    const uploadData = new FormData();
    uploadData.append("image", selectedImage);

    setUploading(true);

    try {
      const response = await fetch(`${API_URL}/images/product`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload image");
      }

      return data.image;
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

      let imagePath = formData.image;
      if (selectedImage) {
        imagePath = await uploadImage();
      }

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          image: imagePath,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to ${isEditing ? "update" : "create"} product`
        );
      }

      onSuccess();
    } catch (error) {
      console.error("PRODUCT SAVE ERROR:", error);
      setError(error.message || "Something went wrong");
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
            className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 bg-white z-10">
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
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="overflow-y-auto px-6 py-6 custom-scrollbar">
              
              {/* Error Banner */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3"
                  >
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Product Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Type className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Wireless Headphones"
                        required
                        className="block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Slug */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      URL Slug
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="wireless-headphones"
                        required
                        className="block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Description
                  </label>
                  <div className="relative group">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Write a detailed description of your product..."
                      rows={4}
                      className="block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
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
                      <div className="relative w-full h-48 rounded-2xl border-2 border-gray-200 overflow-hidden group bg-gray-50">
                        <img 
                          src={preview} 
                          alt="Preview" 
                          className="w-full h-full object-contain"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors">
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
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50/50 hover:bg-indigo-50 hover:border-indigo-400 transition-colors group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-6 h-6 text-indigo-500" />
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">JPG, PNG, WEBP, or GIF (max 5MB)</p>
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
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Activity className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all appearance-none"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                    {/* Custom Dropdown Arrow */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer Buttons */}
            <div className="border-t border-gray-100 px-6 py-5 bg-gray-50/50 flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={onClose}
                disabled={saving || uploading}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="product-form"
                disabled={saving || uploading}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-70 min-w-[140px]"
              >
                {(saving || uploading) ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {uploading ? "Uploading..." : "Saving..."}
                  </>
                ) : (
                  product ? "Save Changes" : "Create Product"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}