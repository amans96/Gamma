import React, { useEffect, useState } from "react";
import { X, UploadCloud, Loader2, AlertCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const BACKEND_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

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
          service.image.startsWith("http://") || service.image.startsWith("https://")
            ? service.image
            : `${BACKEND_URL}${service.image.startsWith("/") ? "" : "/"}${service.image}`
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

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name" && !service
        ? {
            slug: value
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, ""),
          }
        : {}),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not authenticated.");

      let imageUrl = formData.image;

      if (selectedImage) {
        setUploading(true);
        const uploadData = new FormData();
        uploadData.append("image", selectedImage);

        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: uploadData,
        });

        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadJson.message || "Failed to upload image.");
        }

        imageUrl = uploadJson.imageUrl || uploadJson.url || uploadJson.path;
        setUploading(false);
      }

      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        image: imageUrl,
        status: formData.status,
      };

      const url = isEditing
        ? `${API_URL}/services/${service.id}`
        : `${API_URL}/services`;

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.message || "Failed to save service.");
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("SERVICE SAVE ERROR:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px]">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="text-base font-medium text-foreground tracking-tight">
            {isEditing ? "Edit service" : "Add new engineering service"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50/80 p-3 flex items-start gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground block">
              Service name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Substation Maintenance & Testing"
              className="w-full rounded-lg border border-border bg-muted/30 py-2 px-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-foreground focus:bg-card"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground block">
              URL slug
            </label>
            <input
              type="text"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              placeholder="substation-maintenance"
              className="w-full rounded-lg border border-border bg-muted/30 py-2 px-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-foreground focus:bg-card font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground block">
              Scope description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed capabilities, testing tools, and standards applied..."
              className="w-full rounded-lg border border-border bg-muted/30 py-2 px-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-foreground focus:bg-card resize-none"
            />
          </div>

          {/* Image */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground block">
              Service illustration image
            </label>
            <div className="flex items-center gap-4">
              {preview && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-border bg-muted shrink-0">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="flex-1 cursor-pointer rounded-lg border border-dashed border-border bg-muted/20 p-3 text-center hover:bg-muted/40 transition-colors">
                <UploadCloud className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <span className="text-xs text-muted-foreground block">
                  {selectedImage ? selectedImage.name : "Select image file"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground block">
              Service status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-muted/30 py-2 px-3 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground focus:bg-card"
            >
              <option value="ACTIVE">Active (Offered publicly)</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {saving || uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? "Save changes" : "Create service"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
