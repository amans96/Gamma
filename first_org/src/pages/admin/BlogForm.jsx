import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";
const SERVER_URL = "http://localhost:5000";

export default function BlogForm({
  isOpen,
  onClose,
  onSuccess,
  blogPost = null,
}) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    status: "DRAFT",
    publishedAt: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(blogPost);

  useEffect(() => {
    if (!isOpen) return;

    setError("");
    setSelectedImage(null);

    if (blogPost) {
      setFormData({
        title: blogPost.title || "",
        slug: blogPost.slug || "",
        excerpt: blogPost.excerpt || "",
        content: blogPost.content || "",
        featuredImage: blogPost.featuredImage || "",
        status: blogPost.status || "DRAFT",
        publishedAt: blogPost.publishedAt
          ? new Date(blogPost.publishedAt)
              .toISOString()
              .slice(0, 16)
          : "",
      });

      if (blogPost.featuredImage) {
        setPreview(
          blogPost.featuredImage.startsWith("http://") ||
            blogPost.featuredImage.startsWith("https://")
            ? blogPost.featuredImage
            : `${SERVER_URL}${
                blogPost.featuredImage.startsWith("/")
                  ? blogPost.featuredImage
                  : `/${blogPost.featuredImage}`
              }`
        );
      } else {
        setPreview("");
      }
    } else {
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        featuredImage: "",
        status: "DRAFT",
        publishedAt: "",
      });

      setPreview("");
    }
  }, [isOpen, blogPost]);

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      title: value,
      slug:
        !isEditing || !prev.slug
          ? generateSlug(value)
          : prev.slug,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;

    setFormData((prev) => ({
      ...prev,
      status,
      publishedAt:
        status === "PUBLISHED" && !prev.publishedAt
          ? new Date().toISOString().slice(0, 16)
          : status === "DRAFT"
          ? ""
          : prev.publishedAt,
    }));
  };

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

  const uploadImage = async () => {
    if (!selectedImage) {
      return formData.featuredImage;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("You are not authenticated.");
    }

    setUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append("image", selectedImage);

      /*
       * We are reusing the image upload endpoint
       * that we already made for products/services.
       */
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.title.trim()) {
      setError("Blog title is required.");
      return;
    }

    if (!formData.slug.trim()) {
      setError("Blog slug is required.");
      return;
    }

    if (!formData.content.trim()) {
      setError("Blog content is required.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not authenticated.");
      return;
    }

    setSaving(true);

    try {
      const imagePath = await uploadImage();

      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        featuredImage: imagePath || null,
        status: formData.status,
        publishedAt:
          formData.status === "PUBLISHED" &&
          formData.publishedAt
            ? formData.publishedAt
            : null,
      };

   const url = isEditing
  ? `${API_URL}/blog-posts/${blogPost.id}`
  : `${API_URL}/blog-posts`;
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
            } blog post`
        );
      }

      onSuccess(data.blogPost);
      onClose();
    } catch (err) {
      console.error("BLOG FORM ERROR:", err);

      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

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
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? "Edit Blog Post" : "Create Blog Post"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {isEditing
                  ? "Update your blog post."
                  : "Create a new article for your website."}
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
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Title */}
              <div>
                <label
                  htmlFor="blog-title"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Title
                </label>

                <input
                  id="blog-title"
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Enter blog title"
                  disabled={saving || uploading}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Slug */}
              <div>
                <label
                  htmlFor="blog-slug"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Slug
                </label>

                <input
                  id="blog-slug"
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="my-blog-post"
                  disabled={saving || uploading}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Used as the unique URL identifier.
                </p>
              </div>

              {/* Excerpt */}
              <div>
                <label
                  htmlFor="blog-excerpt"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Excerpt
                </label>

                <textarea
                  id="blog-excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Short description of the article..."
                  disabled={saving || uploading}
                  className="block w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Optional short summary shown on blog cards.
                </p>
              </div>

              {/* Content */}
              <div>
                <label
                  htmlFor="blog-content"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Content
                </label>

                <textarea
                  id="blog-content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="10"
                  placeholder="Write your blog post content..."
                  disabled={saving || uploading}
                  className="block w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Featured Image */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Featured Image
                </label>

                <div className="flex items-start gap-5">
                  <div className="flex h-28 w-40 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Blog preview"
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
                          stroke="currentColor"
                          strokeWidth="1.5"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-10h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={handleImageChange}
                      disabled={saving || uploading}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
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
                  htmlFor="blog-status"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Status
                </label>

                <select
                  id="blog-status"
                  value={formData.status}
                  onChange={handleStatusChange}
                  disabled={saving || uploading}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>

              {/* Published Date */}
              {formData.status === "PUBLISHED" && (
                <div>
                  <label
                    htmlFor="published-at"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Published Date
                  </label>

                  <input
                    id="published-at"
                    type="datetime-local"
                    name="publishedAt"
                    value={formData.publishedAt}
                    onChange={handleChange}
                    disabled={saving || uploading}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={saving || uploading}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving || uploading}
                className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                  ? "Update Post"
                  : "Create Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}