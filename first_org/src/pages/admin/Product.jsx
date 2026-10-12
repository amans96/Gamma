
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Loader2,
  PackageOpen,
  RefreshCw,
} from "lucide-react";
import ProductModal from "./ProductForm";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BACKEND_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

// ==========================================
// PRODUCT CACHE SETTINGS
// ==========================================

const PRODUCT_CACHE_KEY = "gama_admin_products_cache";
const PRODUCT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function readProductCache() {
  try {
    const cached = sessionStorage.getItem(PRODUCT_CACHE_KEY);

    if (!cached) return null;

    const parsed = JSON.parse(cached);

    if (
      !Array.isArray(parsed.products) ||
      typeof parsed.cachedAt !== "number"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function writeProductCache(products) {
  try {
    sessionStorage.setItem(
      PRODUCT_CACHE_KEY,
      JSON.stringify({
        products,
        cachedAt: Date.now(),
      })
    );
  } catch (error) {
    console.warn("Could not save product cache:", error);
  }
}

function clearProductCache() {
  try {
    sessionStorage.removeItem(PRODUCT_CACHE_KEY);
  } catch (error) {
    console.warn("Could not clear product cache:", error);
  }
}

// ==========================================
// FRAMER MOTION
// ==========================================

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", duration: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

// ==========================================
// PRODUCT COMPONENT
// ==========================================

export default function Product() {
  const [initialCache] = useState(() => readProductCache());

  const [products, setProducts] = useState(
    () => initialCache?.products || []
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(!initialCache);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const hasInitialCache = Boolean(initialCache);

  // ==========================================
  // UPDATE PRODUCTS AND CACHE TOGETHER
  // ==========================================

  const updateProducts = useCallback((updater) => {
    setProducts((currentProducts) => {
      const nextProducts =
        typeof updater === "function"
          ? updater(currentProducts)
          : updater;

      writeProductCache(nextProducts);

      return nextProducts;
    });
  }, []);

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  const fetchProducts = useCallback(
    async ({ background = false } = {}) => {
      if (background) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      let forceError = false;

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          clearProductCache();
          setProducts([]);
          forceError = true;

          throw new Error(
            "You are not logged in. Please log in again."
          );
        }

        const response = await fetch(`${API_URL}/products`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            clearProductCache();
            setProducts([]);
            forceError = true;
          }

          throw new Error(
            data.message || "Failed to load products."
          );
        }

        const fetchedProducts = Array.isArray(data.products)
          ? data.products
          : [];

        updateProducts(fetchedProducts);
      } catch (err) {
        console.error("GET PRODUCTS ERROR:", err);

        // Preserve cached data if an ordinary background refresh fails.
        if (forceError || !hasInitialCache) {
          setError(err.message || "Failed to load products.");
        } else {
          setError("");
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [hasInitialCache, updateProducts]
  );

  // ==========================================
  // LOAD CACHE FIRST, REFRESH WHEN EXPIRED
  // ==========================================

  useEffect(() => {
    const cacheIsFresh =
      initialCache &&
      Date.now() - initialCache.cachedAt < PRODUCT_CACHE_DURATION;

    if (!cacheIsFresh) {
      fetchProducts({
        background: Boolean(initialCache),
      });
    }
  }, [initialCache, fetchProducts]);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return products;

    return products.filter((product) =>
      product.name?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  // ==========================================
  // DELETE MODAL
  // ==========================================

  const confirmDelete = (product) => {
    setError("");
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;

    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDelete = async () => {
    if (!productToDelete?.id) return;

    const productId = productToDelete.id;

    try {
      setDeleting(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "You are not logged in. Please log in again."
        );
      }

      const response = await fetch(
        `${API_URL}/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseText = await response.text();

      let data = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = {};
        }
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to delete product. Server returned ${response.status}.`
        );
      }

      // Update the UI and session cache immediately.
      updateProducts((currentProducts) =>
        currentProducts.filter(
          (product) => String(product.id) !== String(productId)
        )
      );

      setDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      console.error("DELETE PRODUCT ERROR:", err);
      setError(err.message || "Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================
  // HELPERS
  // ==========================================

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";

      case "INACTIVE":
        return "bg-gray-100 text-gray-700 border-gray-200";

      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "";

    if (/^https?:\/\//i.test(image)) {
      return image;
    }

    return `${BACKEND_URL}${image.startsWith("/") ? image : `/${image}`}`;
  };

  // ==========================================
  // INITIAL LOADING
  // ==========================================

  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">
          Loading products...
        </p>
      </div>
    );
  }

  // ==========================================
  // PAGE UI
  // ==========================================

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-gray-50/30 min-h-screen">
      {/* HEADER */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Products
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your product inventory, update details, or add new
            items to your catalog.
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              fetchProducts({ background: products.length > 0 })
            }
            disabled={refreshing}
            title="Refresh products"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            <span className="hidden sm:inline">
              {refreshing ? "Refreshing..." : "Refresh"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedProduct(null);
              setProductModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-all hover:shadow-md active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </button>
        </div>
      </div>

      {/* BACKGROUND REFRESH STATUS */}
      {refreshing && (
        <p className="mb-4 text-sm text-gray-500">
          Updating products...
        </p>
      )}

      {/* ERROR BANNER */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-3 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700 transition-colors"
              aria-label="Dismiss error"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH BAR */}
      <div className="mb-6 max-w-md">
        <div className="relative group">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>

          <input
            type="text"
            className="block w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all sm:text-sm shadow-sm"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
      </div>

      {/* PRODUCT TABLE */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Slug
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Date Added
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="divide-y divide-gray-100 bg-white"
              >
                {filteredProducts.map((product) => (
                  <motion.tr
                    variants={rowVariants}
                    key={product.id}
                    className="transition-colors hover:bg-gray-50/80 group"
                  >
                    {/* PRODUCT INFO */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 flex-shrink-0">
                          {product.image ? (
                            <img
                              className="h-12 w-12 rounded-xl border border-gray-200 object-cover shadow-sm group-hover:shadow transition-shadow"
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400 border border-gray-200">
                              <PackageOpen className="h-6 w-6 opacity-50" />
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {product.name}
                          </div>

                          <div className="text-xs text-gray-500 mt-0.5">
                            ID: {product.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* SLUG */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 font-medium">
                      {product.slug}
                    </td>

                    {/* STATUS */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadge(
                          product.status
                        )}`}
                      >
                        {product.status}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {product.createdAt
                        ? new Date(product.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "—"}
                    </td>

                    {/* ACTIONS */}
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProduct(product);
                            setProductModalOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => confirmDelete(product)}
                          disabled={deleting}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <PackageOpen className="h-10 w-10 text-gray-400" />
            </div>

            <h3 className="text-lg font-medium text-gray-900">
              No products found
            </h3>

            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              {searchQuery
                ? "We couldn't find anything matching your search. Try adjusting your keywords."
                : "Your inventory is currently empty. Get started by creating a new product."}
            </p>

            {!searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSelectedProduct(null);
                  setProductModalOpen(true);
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-all active:scale-95"
              >
                <Plus className="h-4 w-4" />
                New Product
              </button>
            )}
          </div>
        )}

        {/* RESULTS COUNT */}
        {filteredProducts.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredProducts.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {products.length}
              </span>{" "}
              products
            </p>
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteModalOpen && productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
              onClick={closeDeleteModal}
            />

            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>

                <div className="pt-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Product
                  </h3>

                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-gray-900">
                      "{productToDelete.name}"
                    </span>
                    ? This action cannot be undone and will remove it from
                    the database entirely.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="w-full rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 transition-colors disabled:opacity-50 sm:w-auto min-w-[120px]"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Product"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD / EDIT PRODUCT MODAL */}
      <ProductModal
        isOpen={productModalOpen}
        product={selectedProduct}
        onClose={() => {
          setProductModalOpen(false);
          setSelectedProduct(null);
        }}
        onSuccess={() => {
          setProductModalOpen(false);
          setSelectedProduct(null);

          // Refresh after a successful create or edit.
          fetchProducts({ background: true });
        }}
      />
    </div>
  );
}
