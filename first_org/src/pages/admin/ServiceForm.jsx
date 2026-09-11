import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";
const SERVER_URL = "http://localhost:5000";

export default function ServiceForm({
  isOpen,
  onClose,
  onSuccess,
  service = null,
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

  const isEditing = Boolean(service);

  // ==========================================
  // LOAD SERVICE WHEN EDITING
  // ==========================================

  useEffect(() => {
    if (!isOpen) return;

    setError("");
    setSelectedImage(null);

    if (service) {
      setFormData({
        name: service.name || "",
        slug: service.slug || "",
        description: service.description || "",
        image: service.image || "",
        status: service.status || "ACTIVE",
      });

      if (service.image) {
        setPreview(
          service.image.startsWith("http://") ||
            service.image.startsWith("https://")
            ? service.image
            : `${SERVER_URL}${
                service.image.startsWith("/")
                  ? service.image
                  : `/${service.image}`
              }`
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
  }, [isOpen, service]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // AUTO GENERATE SLUG
  // ==========================================

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleNameChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      name: value,
      slug:
        !isEditing || !prev.slug
          ? generateSlug(value)
          : prev.slug,
    }));
  };

  // ==========================================
  // IMAGE SELECTION
  // ==========================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, JPEG, PNG, WEBP and GIF images are allowed."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");
    setSelectedImage(file);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  // ==========================================
  // UPLOAD IMAGE
  // ==========================================

  const uploadImage = async () => {
    if (!selectedImage) {
      return formData.image;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("You are not authenticated.");
    }

    setUploading(true);

    try {
      const uploadData = new FormData();

      uploadData.append("image", selectedImage);

      const response = await fetch(
        `${API_URL}/images/product`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to upload image"
        );
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

    setError("");

    if (!formData.name.trim()) {
      setError("Service name is required.");
      return;
    }

    if (!formData.slug.trim()) {
      setError("Service slug is required.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not authenticated.");
      return;
    }

    setSaving(true);

    try {
      // Upload new image first if selected
      const imagePath = await uploadImage();

      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        image: imagePath || null,
        status: formData.status,
      };

      const url = isEditing
        ? `${API_URL}/services/${service.id}`
        : `${API_URL}/services`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to ${
              isEditing ? "update" : "create"
            } service`
        );
      }

      onSuccess(data.service);
      onClose();
    } catch (err) {
      console.error("SERVICE FORM ERROR:", err);

      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // CLOSE
  // ==========================================

  const handleClose = () => {
    if (saving || uploading) return;

    setError("");
    setSelectedImage(null);
    setPreview("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? "Edit Service" : "Add Service"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {isEditing
                  ? "Update the service information."
                  : "Add a new service to your website."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={saving || uploading}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-5 px-6 py-6">
              {/* Error */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label
                  htmlFor="service-name"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Service Name
                </label>

                <input
                  id="service-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Web Design & Development"
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  disabled={saving || uploading}
                />
              </div>

              {/* Slug */}
              <div>
                <label
                  htmlFor="service-slug"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Slug
                </label>

                <input
                  id="service-slug"
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="web-design-development"
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  disabled={saving || uploading}
                />

                <p className="mt-1 text-xs text-gray-400">
                  Used as the unique identifier for the service.
                </p>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="service-description"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="service-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe what this service offers..."
                  className="block w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  disabled={saving || uploading}
                />
              </div>

              {/* Image */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Service Image
                </label>

                <div className="flex items-start gap-5">
                  {/* Preview */}
                  <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Service preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg
                        className="h-8 w-8 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-10h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Upload */}
                  <div className="flex-1">
                    <input
                      type="file"
                      id="service-image"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
                      disabled={saving || uploading}
                    />

                    <p className="mt-2 text-xs text-gray-400">
                      JPG, JPEG, PNG, WEBP or GIF. Maximum 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="service-status"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Status
                </label>

                <select
                  id="service-status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  disabled={saving || uploading}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={saving || uploading}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving || uploading}
                className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {(saving || uploading) && (
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                )}

                {uploading
                  ? "Uploading..."
                  : saving
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                  ? "Update Service"
                  : "Create Service"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}