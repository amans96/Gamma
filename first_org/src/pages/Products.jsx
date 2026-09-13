import { useEffect, useMemo, useState } from "react";
import { Search, ArrowDownAZ, ArrowUpAZ, X, PackageX, RefreshCw } from "lucide-react";

const API_URL = "http://localhost:5000/api";
const SERVER_URL = "http://localhost:5000";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search
  const [search, setSearch] = useState("");

  // Sorting
  const [sortOrder, setSortOrder] = useState("az");

  // =========================================================
  // GET PUBLIC PRODUCTS
  // =========================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/products/public`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load products");
        }

        setProducts(data.products || []);
      } catch (err) {
        console.error("PUBLIC PRODUCTS ERROR:", err);
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // =========================================================
  // IMAGE URL HELPER
  // =========================================================

  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    if (image.startsWith("/")) {
      return `${SERVER_URL}${image}`;
    }
    return `${SERVER_URL}/${image}`;
  };

  // =========================================================
  // SEARCH + SORT
  // =========================================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search by product name or description
    if (search.trim()) {
      const searchValue = search.toLowerCase().trim();
      result = result.filter((product) => {
        const name = product.name?.toLowerCase() || "";
        const description = product.description?.toLowerCase() || "";
        return name.includes(searchValue) || description.includes(searchValue);
      });
    }

    // A-Z
    if (sortOrder === "az") {
      result.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" })
      );
    }

    // Z-A
    if (sortOrder === "za") {
      result.sort((a, b) =>
        (b.name || "").localeCompare(a.name || "", undefined, { sensitivity: "base" })
      );
    }

    return result;
  }, [products, search, sortOrder]);

  // =========================================================
  // LOADING (SKELETON UI)
  // =========================================================

  if (loading) {
    return (
      <section className="w-full bg-slate-50/50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-3 h-4 w-28 animate-pulse rounded bg-blue-100" />
            <div className="mx-auto h-10 w-48 animate-pulse rounded-lg bg-slate-200" />
          </div>

          {/* Skeleton Cards Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex min-h-[250px] animate-pulse flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:flex-row"
              >
                <div className="h-60 w-full bg-slate-200 sm:h-auto sm:w-60 md:w-64 sm:shrink-0" />
                <div className="flex flex-1 flex-col justify-between p-6 md:p-7 space-y-4">
                  <div>
                    <div className="h-6 w-3/4 rounded bg-slate-200" />
                    <div className="mt-4 space-y-2.5">
                      <div className="h-4 w-full rounded bg-slate-100" />
                      <div className="h-4 w-5/6 rounded bg-slate-100" />
                      <div className="h-4 w-2/3 rounded bg-slate-100" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // ERROR STATE
  // =========================================================

  if (error) {
    return (
      <section className="w-full py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-600">
              Our Products
            </p>
            <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
              Products
            </h1>
          </div>

          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center">
            <p className="text-base font-semibold text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-700 transition"
            >
              <RefreshCw size={16} /> Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // MAIN COMPONENT
  // =========================================================

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6">

        {/* HEADER */}
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
            Our Products
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Explore Solutions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            Explore our range of electrical equipment and solutions designed for
            reliable and efficient performance.
          </p>
        </div>

        {/* SEARCH + FILTER CONTROLS */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-10 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative w-full sm:w-auto">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-8 text-sm font-medium text-slate-700 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:w-48"
            >
              <option value="az">Name: A → Z</option>
              <option value="za">Name: Z → A</option>
            </select>

            {sortOrder === "az" ? (
              <ArrowDownAZ
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
            ) : (
              <ArrowUpAZ
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
            )}
          </div>
        </div>

        {/* RESULT COUNT */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "Product" : "Products"} Found
          </p>

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              Clear search filter
            </button>
          )}
        </div>

        {/* NO PRODUCTS EMPTY STATE */}
        {filteredProducts.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <PackageX size={24} />
            </div>
            <p className="mt-4 text-base font-semibold text-slate-800">
              No products found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your search query or clear filters.
            </p>
          </div>
        ) : (

          /* PRODUCT GRID (HORIZONTAL CARDS WITH INCREASED HEIGHT) */
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group flex min-h-[250px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md sm:flex-row"
              >
                {/* Product Image Container */}
                <div className="relative h-60 w-full shrink-0 overflow-hidden bg-slate-100 sm:h-auto sm:w-60 md:w-64">
                  {product.image ? (
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-50 p-4">
                      <span className="text-xs text-slate-400">
                        No image available
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Information Container */}
                <div className="flex flex-1 flex-col justify-between p-6 md:p-7">
                  <div>
                    {/* Title & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                        {product.name}
                      </h2>

                      {product.status && (
                        <span
                          className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${
                            product.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                              : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/10"
                          }`}
                        >
                          {product.status}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {product.description && (
                      <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-slate-600">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}