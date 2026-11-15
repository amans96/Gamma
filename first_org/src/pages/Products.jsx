import { useState, useMemo } from "react";
import { Search, ArrowDownAZ, ArrowUpAZ, X, PackageX, RefreshCw, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Footertemp from "../comp/Footertemp.jsx";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BACKEND_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

export default function Product() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("az");

  const fetchProducts = async () => {
    const response = await fetch(`${API_URL}/products/public`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to load products");
    }
    return data.products || [];
  };

  const {
    data: products = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const getImageUrl = (image) => {
    if (!image) return "/assets/prod1.jpg";
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    return `${BACKEND_URL}${image.startsWith("/") ? "" : "/"}${image}`;
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const searchValue = search.toLowerCase().trim();
      result = result.filter((product) => {
        const name = product.name?.toLowerCase() || "";
        const description = product.description?.toLowerCase() || "";
        return name.includes(searchValue) || description.includes(searchValue);
      });
    }

    if (sortOrder === "az") {
      result.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" })
      );
    }

    if (sortOrder === "za") {
      result.sort((a, b) =>
        (b.name || "").localeCompare(a.name || "", undefined, { sensitivity: "base" })
      );
    }

    return result;
  }, [products, search, sortOrder]);

  return (
    <div className="w-full bg-background min-h-screen flex flex-col justify-between">
      <main className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              Equipment catalog
            </p>
            <h1 className="text-2xl sm:text-4xl font-normal tracking-tight text-foreground">
              Industrial products & power solutions
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              Comprehensive power transformers, medium-voltage distribution systems, and specialized industrial enclosures.
            </p>
          </div>

          {/* Search, Filter & Count Toolbar Band */}
          <div className="rounded-xl border border-border bg-muted/30 p-3 sm:p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by model or specification..."
                className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-9 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs text-muted-foreground">
                {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
              </span>

              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="rounded-lg border border-border bg-card py-2 pl-8 pr-7 text-xs font-medium text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="az">Sort: A → Z</option>
                  <option value="za">Sort: Z → A</option>
                </select>
                {sortOrder === "az" ? (
                  <ArrowDownAZ className="w-3.5 h-3.5 text-muted-foreground pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2" />
                ) : (
                  <ArrowUpAZ className="w-3.5 h-3.5 text-muted-foreground pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row gap-5"
                >
                  <div className="w-full sm:w-48 aspect-[4/3] rounded-lg bg-muted shrink-0" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 w-20 rounded bg-muted" />
                    <div className="h-6 w-3/4 rounded bg-muted" />
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-full rounded bg-muted" />
                      <div className="h-3.5 w-5/6 rounded bg-muted" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="rounded-xl border border-border bg-muted/40 p-10 text-center max-w-md mx-auto">
              <p className="text-sm text-foreground mb-4">
                {error?.message || "Failed to load product catalog."}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-12 text-center max-w-md mx-auto">
              <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                <PackageX className="w-5 h-5" />
              </div>
              <h3 className="text-base font-medium text-foreground mb-1">
                No matching products
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Try adjusting your search query or view all catalog categories.
              </p>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Clear search filter
                </button>
              )}
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-xl border border-border bg-card p-5 flex flex-col sm:flex-row gap-5 transition-colors hover:border-foreground/20"
                >
                  <div className="w-full sm:w-48 aspect-[4/3] rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-mono text-muted-foreground">
                        Item #{String(product.id).padStart(4, "0")}
                      </span>
                      <h3 className="text-base font-medium text-foreground tracking-tight">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        Certified IEC Standard
                      </span>
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground/80 transition-colors"
                      >
                        <span>Inquire</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footertemp />
    </div>
  );
}
