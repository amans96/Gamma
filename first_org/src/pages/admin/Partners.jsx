
import React, { useCallback, useEffect, useMemo, useState } from "react";
import PartnerForm from "./PartnerForm";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BACKEND_URL =
  import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:5000";

// ==========================================
// CACHE CONFIGURATION
// ==========================================

const PARTNER_CACHE_KEY = "gama_admin_partners_cache";
const PARTNER_CACHE_DURATION = 5 * 60 * 1000;

const readPartnerCache = () => {
  try {
    const cached = sessionStorage.getItem(PARTNER_CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached);

    if (
      !Array.isArray(parsed.partners) ||
      typeof parsed.cachedAt !== "number"
    ) {
      sessionStorage.removeItem(PARTNER_CACHE_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const writePartnerCache = (partners) => {
  try {
    sessionStorage.setItem(
      PARTNER_CACHE_KEY,
      JSON.stringify({
        partners,
        cachedAt: Date.now(),
      })
    );
  } catch (error) {
    console.warn("Could not cache partners:", error);
  }
};

const clearPartnerCache = () => {
  try {
    sessionStorage.removeItem(PARTNER_CACHE_KEY);
  } catch {
    // Ignore storage errors.
  }
};

export default function Partners() {
  const [initialCache] = useState(() => readPartnerCache());

  const [partners, setPartners] = useState(
    () => initialCache?.partners ?? []
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(!initialCache);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Add/Edit modal
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const hadInitialCache = Boolean(initialCache);

  const getToken = () => localStorage.getItem("token");

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (image) => {
    if (!image) return null;

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${BACKEND_URL}${image.startsWith("/") ? "" : "/"}${image}`;
  };

  // ==========================================
  // UPDATE STATE AND CACHE TOGETHER
  // ==========================================

  const updatePartners = useCallback((updater) => {
    setPartners((current) => {
      const next =
        typeof updater === "function" ? updater(current) : updater;

      writePartnerCache(next);
      return next;
    });
  }, []);

  // ==========================================
  // FETCH PARTNERS
  // ==========================================

  const fetchPartners = useCallback(
    async ({ background = false } = {}) => {
      if (background) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const token = getToken();

        if (!token) {
          clearPartnerCache();
          updatePartners([]);
          throw new Error("You are not authenticated.");
        }

        const response = await fetch(`${API_URL}/partners`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            clearPartnerCache();
            updatePartners([]);
          }

          throw new Error(data.message || "Failed to fetch partners");
        }

        updatePartners(data.partners || []);
      } catch (err) {
        console.error("FETCH PARTNERS ERROR:", err);

        if (hadInitialCache && background) {
          setError("Could not refresh partners. Showing saved data.");
        } else {
          setError(err.message || "Failed to load partners.");
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [hadInitialCache, updatePartners]
  );

  // ==========================================
  // INITIAL LOAD / CACHE EXPIRATION
  // ==========================================

  useEffect(() => {
    const cacheIsFresh =
      initialCache &&
      Date.now() - initialCache.cachedAt < PARTNER_CACHE_DURATION;

    if (!cacheIsFresh) {
      fetchPartners({
        background: Boolean(initialCache),
      });
    }
  }, [initialCache, fetchPartners]);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredPartners = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return partners;

    return partners.filter((partner) =>
      [
        partner.name,
        partner.description,
        partner.website,
      ].some((value) => value?.toLowerCase().includes(query))
    );
  }, [partners, searchQuery]);

  // ==========================================
  // ADD PARTNER
  // ==========================================

  const handleAddPartner = () => {
    setSelectedPartner(null);
    setFormModalOpen(true);
  };

  // ==========================================
  // EDIT PARTNER
  // ==========================================

  const handleEditPartner = (partner) => {
    setSelectedPartner(partner);
    setFormModalOpen(true);
  };

  // ==========================================
  // FORM SUCCESS
  // ==========================================

  const handleFormSuccess = (savedPartner) => {
    if (!savedPartner?.id) {
      setFormModalOpen(false);
      setSelectedPartner(null);
      fetchPartners({ background: true });
      return;
    }

    updatePartners((current) => {
      const exists = current.some(
        (partner) => partner.id === savedPartner.id
      );

      if (exists) {
        return current.map((partner) =>
          partner.id === savedPartner.id ? savedPartner : partner
        );
      }

      return [savedPartner, ...current];
    });

    setFormModalOpen(false);
    setSelectedPartner(null);
  };

  // ==========================================
  // DELETE CONFIRMATION
  // ==========================================

  const confirmDelete = (partner) => {
    setPartnerToDelete(partner);
    setDeleteModalOpen(true);
  };

  // ==========================================
  // DELETE PARTNER
  // ==========================================

  const handleDelete = async () => {
    if (!partnerToDelete) return;

    try {
      setDeleting(true);

      const token = getToken();

      if (!token) {
        throw new Error("You are not authenticated.");
      }

      const response = await fetch(
        `${API_URL}/partners/${partnerToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          clearPartnerCache();
        }

        throw new Error(data.message || "Failed to delete partner");
      }

      updatePartners((current) =>
        current.filter((partner) => partner.id !== partnerToDelete.id)
      );

      setDeleteModalOpen(false);
      setPartnerToDelete(null);
    } catch (err) {
      console.error("DELETE PARTNER ERROR:", err);
      setError(err.message || "Failed to delete partner.");
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================
  // TOGGLE ACTIVE STATUS
  // ==========================================

  const toggleStatus = async (partner) => {
    try {
      const token = getToken();

      if (!token) {
        throw new Error("You are not authenticated.");
      }

      const response = await fetch(`${API_URL}/partners/${partner.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isActive: !partner.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          clearPartnerCache();
        }

        throw new Error(data.message || "Failed to update partner");
      }

      updatePartners((current) =>
        current.map((item) =>
          item.id === partner.id ? data.partner : item
        )
      );
    } catch (err) {
      console.error("TOGGLE PARTNER ERROR:", err);
      setError(err.message || "Failed to update partner.");
    }
  };

  // ==========================================
  // STATUS BADGE
  // ==========================================

  const getStatusBadge = (isActive) =>
    isActive
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-gray-100 text-gray-800 border-gray-200";

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* PAGE HEADER */}

      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Partners
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Manage your partner organizations and companies displayed on the
            website.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 sm:mt-0">
          <button
            type="button"
            onClick={() =>
              fetchPartners({ background: partners.length > 0 })
            }
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <button
            type="button"
            onClick={handleAddPartner}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
            Add Partner
          </button>
        </div>
      </div>

      {refreshing && (
        <p className="mb-3 text-sm text-gray-500">
          Updating partners...
        </p>
      )}

      {/* ERROR */}

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            className="ml-4 font-medium text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* SEARCH */}

      <div className="mb-6 max-w-md">
        <label htmlFor="search" className="sr-only">
          Search partners
        </label>

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
            name="search"
            id="search"
            className="block w-full rounded-md border-gray-300 border py-2 pl-10 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Search partners by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* PARTNERS TABLE */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
            <p className="mt-4 text-sm text-gray-500">
              Loading partners...
            </p>
          </div>
        ) : filteredPartners.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Partner
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Website
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Date Added
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredPartners.map((partner) => (
                  <tr
                    key={partner.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    {/* PARTNER */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {partner.logo ? (
                            <img
                              className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                              src={getImageUrl(partner.logo)}
                              alt={`${partner.name} logo`}
                              onError={(e) => {
                                e.currentTarget.style.visibility = "hidden";
                              }}
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-500">
                              {partner.name?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {partner.name}
                          </div>

                          {partner.description && (
                            <div className="max-w-xs truncate text-sm text-gray-500">
                              {partner.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* WEBSITE */}

                    <td className="whitespace-nowrap px-6 py-4">
                      {partner.website ? (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-900"
                        >
                          {partner.website.replace(/^https?:\/\//, "")}
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">
                          No website
                        </span>
                      )}
                    </td>

                    {/* STATUS */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        type="button"
                        onClick={() => toggleStatus(partner)}
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold leading-5 transition-colors ${getStatusBadge(
                          partner.isActive
                        )}`}
                        title="Click to change status"
                      >
                        {partner.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* DATE */}

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(partner.createdAt)}
                    </td>

                    {/* ACTIONS */}

                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        {partner.website && (
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 transition-colors hover:text-gray-900"
                            title="View website"
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
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => handleEditPartner(partner)}
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
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => confirmDelete(partner)}
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
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
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
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>

            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No partners found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {searchQuery
                ? "We could not find any partners matching your search."
                : "Get started by adding a new partner to display on your website."}
            </p>

            {!searchQuery && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleAddPartner}
                  className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
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
                  Add Partner
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}

      <PartnerForm
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setSelectedPartner(null);
        }}
        onSuccess={handleFormSuccess}
        partner={selectedPartner}
      />

      {/* DELETE CONFIRMATION MODAL */}

      {deleteModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex min-h-screen items-center justify-center px-4">
            {/* OVERLAY */}

            <div
              className="fixed inset-0 bg-gray-500/75"
              onClick={() => {
                if (!deleting) {
                  setDeleteModalOpen(false);
                  setPartnerToDelete(null);
                }
              }}
            />

            {/* MODAL */}

            <div className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 text-left shadow-xl">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>

                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Delete Partner
                  </h3>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete{" "}
                      <span className="font-semibold text-gray-700">
                        {partnerToDelete?.name}
                      </span>
                      ? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col-reverse gap-3 sm:mt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setPartnerToDelete(null);
                  }}
                  className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDelete}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
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
