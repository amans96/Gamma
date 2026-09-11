import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";
const BACKEND_URL = "http://localhost:5000";

export default function PartnerForm({
  isOpen,
  onClose,
  onSuccess,
  partner = null,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    website: "",
    isActive: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(partner);

  useEffect(() => {
    if (partner) {
      setFormData({
        name: partner.name || "",
        description: partner.description || "",
        logo: partner.logo || "",
        website: partner.website || "",
        isActive: partner.isActive ?? true,
      });

      if (partner.logo) {
        setImagePreview(
          partner.logo.startsWith("http")
            ? partner.logo
            : `${BACKEND_URL}${partner.logo}`
        );
      } else {
        setImagePreview("");
      }
    } else {
      setFormData({
        name: "",
        description: "",
        logo: "",
        website: "",
        isActive: true,
      });

      setImagePreview("");
    }

    setImageFile(null);
    setError("");
  }, [partner, isOpen]);

  if (!isOpen) return null;

  const getToken = () => localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.logo;

    const token = getToken();

    if (!token) {
      throw new Error("You are not authenticated.");
    }

    const uploadData = new FormData();
    uploadData.append("image", imageFile);

    const response = await fetch(`${API_URL}/images/partner`, {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Partner name is required.");
      return;
    }

    try {
      setLoading(true);

      let logo = formData.logo;

      if (imageFile) {
        setUploading(true);
        logo = await uploadImage();
        setUploading(false);
      }

      const token = getToken();

      if (!token) {
        throw new Error("You are not authenticated.");
      }

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        logo: logo || null,
        website: formData.website.trim() || null,
        isActive: formData.isActive,
      };

      const url = isEditing
        ? `${API_URL}/partners/${partner.id}`
        : `${API_URL}/partners`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save partner");
      }

      onSuccess(data.partner);
      onClose();
    } catch (error) {
      console.error("SAVE PARTNER ERROR:", error);
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-500/75"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? "Edit Partner" : "Add Partner"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {isEditing
                  ? "Update this partner's information."
                  : "Add a new partner to your website."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <svg
                className="h-6 w-6"
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
              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Partner Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter partner name"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter partner description"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Website */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Website
                </label>

                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Logo */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Logo
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
                />

                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Partner logo preview"
                      className="h-24 w-24 rounded-lg border border-gray-200 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Active */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />

                <label
                  htmlFor="isActive"
                  className="ml-2 text-sm text-gray-700"
                >
                  Display this partner on the public website
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading
                  ? "Uploading..."
                  : loading
                  ? "Saving..."
                  : isEditing
                  ? "Update Partner"
                  : "Add Partner"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}