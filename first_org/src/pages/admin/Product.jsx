import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  Loader2,
  PackageOpen,
  RefreshCw,
} from "lucide-react";
import ProductModal from "./ProductForm";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const BACKEND_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

const PRODUCT_CACHE_KEY = "gama_admin_products_cache";
const PRODUCT_CACHE_DURATION = 5 * 60 * 1000;

function readProductCache() {
  try {
    const cached = sessionStorage.getItem(PRODUCT_CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    if (!Array.isArray(parsed.products) || typeof parsed.cachedAt !== "number") return null;
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

export default function Product() {
  const [initialCache] = useState(() => readProductCache());
  const [products, setProducts] = useState(() => initialCache?.products || []);
  const [loading, setLoading] = useState(!initialCache?.products);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const hasInitialCache = Boolean(initialCache?.products);

  const updateProducts = useCallback((newProducts) => {
    setProducts(newProducts);
    writeProductCache(newProducts);
  }, []);

  const fetchProducts = useCallback(
    async ({ background = false } = {}) => {
      if (background) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token required.");

        const response = await fetch(`${API_URL}/products`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to load products.");
        }

        const fetched = Array.isArray(data.products) ? data.products : [];
        updateProducts(fetched);
      } catch (err) {
        console.error("GET PRODUCTS ERROR:", err);
        if (!hasInitialCache) {
          setError(err.message || "Failed to load products.");
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [hasInitialCache, updateProducts]
  );

  useEffect(() => {
    const cacheIsFresh =
      initialCache &&
      Date.now() - initialCache.cachedAt < PRODUCT_CACHE_DURATION;

    if (!cacheIsFresh) {
      fetchProducts({ background: Boolean(initialCache) });
    }
  }, [initialCache, fetchProducts]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return products;
    return products.filter((p) =>
      p.name?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete?.id) return;
    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/products/${productToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed to delete product.");
      }

      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    return `${BACKEND_URL}${image.startsWith("/") ? "" : "/"}${image}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-normal tracking-tight text-foreground">
            Product catalog management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure specifications, models, and public inventory visibility.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => fetchProducts({ background: Boolean(products.length) })}
            disabled={refreshing}
            className="p-2 rounded-xl border border-border bg-card text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedProduct(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add product</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50/80 p-3 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Search Toolbar */}
      <div className="rounded-xl border border-border bg-card p-3 flex items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title or slug..."
            className="w-full rounded-lg border border-border bg-muted/30 py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground focus:bg-card"
          />
        </div>
        <span className="text-xs text-muted-foreground font-mono shrink-0">
          {filteredProducts.length} {filteredProducts.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      {/* Table Content */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {loading && !products.length ? (
          <div className="py-16 text-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto" />
            <p className="text-xs text-muted-foreground">Loading catalog items...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <PackageOpen className="w-8 h-8 text-muted-foreground mx-auto" />
            <h3 className="text-sm font-medium text-foreground">No products found</h3>
            <p className="text-xs text-muted-foreground">
              Add your first product or try another search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
                <tr>
                  <th className="py-3 px-4 font-normal">Product</th>
                  <th className="py-3 px-4 font-normal">Identifier (Slug)</th>
                  <th className="py-3 px-4 font-normal">Status</th>
                  <th className="py-3 px-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                          {p.image ? (
                            <img
                              src={getImageUrl(p.image)}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                              None
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground tracking-tight">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-xs">
                            {p.description || "No description provided."}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground">
                      /{p.slug}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                          p.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {p.status || "ACTIVE"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProduct(p);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDelete(p)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Create/Edit Modal */}
      <ProductModal
        isOpen={modalOpen}
        product={selectedProduct}
        onClose={() => {
          setModalOpen(false);
          setSelectedProduct(null);
        }}
        onSuccess={() => fetchProducts()}
      />

      {/* Delete Confirmation Dialog (Floating layer) */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px]">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-red-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-medium text-foreground tracking-tight">
                Delete product
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to remove <strong>"{productToDelete?.name}"</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-medium text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
