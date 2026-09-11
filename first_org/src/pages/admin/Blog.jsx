import React, { useEffect, useMemo, useState } from "react";
import BlogForm from "./BlogForm";

const API_URL = "http://localhost:5000/api";
const SERVER_URL = "http://localhost:5000";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${SERVER_URL}${
      image.startsWith("/") ? image : `/${image}`
    }`;
  };

  // ==========================================
  // GET BLOG POSTS
  // ==========================================

  const fetchPosts = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not authenticated.");
      }

      const response = await fetch(`${API_URL}/blog-posts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load blog posts"
        );
      }

      setPosts(data.blogPosts || []);
    } catch (err) {
      console.error("FETCH BLOG POSTS ERROR:", err);

      setError(
        err.message || "Failed to load blog posts."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredPosts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return posts.filter((post) => {
      const matchesSearch =
        !query ||
        post.title?.toLowerCase().includes(query) ||
        post.slug?.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        post.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [posts, searchQuery, statusFilter]);

  // ==========================================
  // ADD
  // ==========================================

  const openAddModal = () => {
    setSelectedPost(null);
    setFormOpen(true);
  };

  // ==========================================
  // EDIT
  // ==========================================

  const openEditModal = (post) => {
    setSelectedPost(post);
    setFormOpen(true);
  };

  // ==========================================
  // AFTER CREATE / UPDATE
  // ==========================================

  const handleFormSuccess = (savedPost) => {
    setPosts((currentPosts) => {
      const exists = currentPosts.some(
        (post) => post.id === savedPost.id
      );

      if (exists) {
        return currentPosts.map((post) =>
          post.id === savedPost.id
            ? savedPost
            : post
        );
      }

      return [savedPost, ...currentPosts];
    });
  };

  // ==========================================
  // DELETE CONFIRMATION
  // ==========================================

  const confirmDelete = (post) => {
    setPostToDelete(post);
    setDeleteModalOpen(true);
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async () => {
    if (!postToDelete) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not authenticated.");
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/blog-posts/${postToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete blog post"
        );
      }

      setPosts((currentPosts) =>
        currentPosts.filter(
          (post) => post.id !== postToDelete.id
        )
      );

      setDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (err) {
      console.error("DELETE BLOG POST ERROR:", err);

      setError(
        err.message || "Failed to delete blog post."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================
  // TOGGLE STATUS
  // ==========================================

  const toggleStatus = async (post) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not authenticated.");
      return;
    }

    const newStatus =
      post.status === "PUBLISHED"
        ? "DRAFT"
        : "PUBLISHED";

    try {
      const response = await fetch(
        `${API_URL}/blog-posts/${post.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update post status"
        );
      }

      setPosts((currentPosts) =>
        currentPosts.map((currentPost) =>
          currentPost.id === post.id
            ? data.blogPost
            : currentPost
        )
      );
    } catch (err) {
      console.error("TOGGLE BLOG STATUS ERROR:", err);

      setError(
        err.message || "Failed to update post status."
      );
    }
  };

  // ==========================================
  // STATUS BADGE
  // ==========================================

  const getStatusBadge = (status) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800 border-green-200";

      case "DRAFT":
        return "bg-gray-100 text-gray-800 border-gray-200";

      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* PAGE HEADER */}
      <div className="mb-8 sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Blog Posts
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Create, edit, and manage articles published
            on your public website.
          </p>
        </div>

        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>

            Create Post
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* SEARCH + FILTER */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        {/* SEARCH */}
        <div className="w-full sm:max-w-md">
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              type="text"
              className="block w-full rounded-md border border-gray-300 py-2 pl-10 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Search posts by title..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
            />
          </div>
        </div>

        {/* STATUS */}
        <div className="flex space-x-2">
          {["All", "PUBLISHED", "DRAFT"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                statusFilter === tab
                  ? "border border-indigo-200 bg-indigo-50 text-indigo-700"
                  : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab === "PUBLISHED"
                ? "Published"
                : tab === "DRAFT"
                ? "Draft"
                : "All"}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg
              className="h-8 w-8 animate-spin text-indigo-600"
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
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Post
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Published
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Created
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    {/* POST */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-50">
                          {post.featuredImage ? (
                            <img
                              src={getImageUrl(
                                post.featuredImage
                              )}
                              alt={post.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <svg
                                className="h-6 w-6 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeWidth="1.5"
                                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="ml-4 max-w-md">
                          <div className="line-clamp-1 text-sm font-medium text-gray-900">
                            {post.title}
                          </div>

                          <div className="mt-1 line-clamp-1 text-xs text-gray-400">
                            /{post.slug}
                          </div>

                          {post.excerpt && (
                            <div className="mt-1 line-clamp-1 text-sm text-gray-500">
                              {post.excerpt}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold leading-5 ${getStatusBadge(
                          post.status
                        )}`}
                      >
                        {post.status === "PUBLISHED"
                          ? "Published"
                          : "Draft"}
                      </span>
                    </td>

                    {/* PUBLISHED DATE */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(post.publishedAt)}
                    </td>

                    {/* CREATED DATE */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(post.createdAt)}
                    </td>

                    {/* ACTIONS */}
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        {/* TOGGLE STATUS */}
                        <button
                          type="button"
                          onClick={() => toggleStatus(post)}
                          className="text-amber-500 transition-colors hover:text-amber-700"
                          title={
                            post.status === "PUBLISHED"
                              ? "Move to Draft"
                              : "Publish Post"
                          }
                        >
                          {post.status === "PUBLISHED" ? (
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}
                        </button>

                        {/* VIEW */}
                        <button
                          type="button"
                          onClick={() =>
                            window.open(
                              `/blog/${post.slug}`,
                              "_blank"
                            )
                          }
                          className="text-gray-400 transition-colors hover:text-gray-900"
                          title="View"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />

                            <path
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>

                        {/* EDIT */}
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(post)
                          }
                          className="text-indigo-500 transition-colors hover:text-indigo-900"
                          title="Edit"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>

                        {/* DELETE */}
                        <button
                          type="button"
                          onClick={() =>
                            confirmDelete(post)
                          }
                          className="text-red-400 transition-colors hover:text-red-900"
                          title="Delete"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 01-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="px-4 py-16 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="1"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z"
              />

              <path
                strokeWidth="1"
                d="M14 4v6h6M9 14h6M9 18h3"
              />
            </svg>

            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No posts found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ||
              statusFilter !== "All"
                ? "Try adjusting your search or filters."
                : "Get started by creating your first blog post."}
            </p>

            {!searchQuery &&
              statusFilter === "All" && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={openAddModal}
                    className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>

                    Create Post
                  </button>
                </div>
              )}
          </div>
        )}
      </div>

      {/* BLOG FORM */}
      <BlogForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedPost(null);
        }}
        onSuccess={handleFormSuccess}
        blogPost={selectedPost}
      />

      {/* DELETE MODAL */}
      {deleteModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex min-h-screen items-center justify-center px-4 py-8">
            <div
              className="fixed inset-0 bg-gray-500/75"
              onClick={() => {
                if (!deleting) {
                  setDeleteModalOpen(false);
                  setPostToDelete(null);
                }
              }}
            />

            <div className="relative w-full max-w-lg rounded-xl bg-white p-6 text-left shadow-xl">
              <div className="flex items-start">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>

                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Blog Post
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-gray-700">
                      "{postToDelete?.title}"
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setPostToDelete(null);
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDelete}
                  className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting && (
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 12h4z"
                      />
                    </svg>
                  )}

                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}