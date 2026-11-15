import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Package, ArrowRight, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getBackendOrigin = () => {
  try {
    return new URL(API_URL).origin;
  } catch (error) {
    return typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:5000";
  }
};

const BACKEND_URL = getBackendOrigin();

export default function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

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
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["public-products"],
    queryFn: fetchProducts,
  });

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assets/prod1.jpg";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `${BACKEND_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  const handlePrev = () => {
    if (products.length <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (products.length <= 1) return;
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="w-full py-16 sm:py-20 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              Engineered solutions
            </p>
            <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground">
              Featured products
            </h2>
          </div>

          {/* Controls */}
          {products.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground mr-2 font-mono">
                {String(currentIndex + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous product"
                className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next product"
                className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Loading State (Hand-built skeleton matching loaded frame) */}
        {isLoading && (
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 aspect-[16/10] rounded-xl bg-muted" />
              <div className="lg:col-span-5 space-y-4">
                <div className="h-4 w-28 rounded-lg bg-muted" />
                <div className="h-8 w-3/4 rounded-lg bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-5/6 rounded bg-muted" />
                  <div className="h-4 w-2/3 rounded bg-muted" />
                </div>
                <div className="h-10 w-36 rounded-xl bg-muted pt-2" />
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="rounded-xl border border-border bg-muted/40 p-8 text-center max-w-lg mx-auto">
            <p className="text-sm text-foreground mb-4">
              {error?.message || "Unable to load products."}
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
        {!isLoading && !isError && products.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-12 text-center max-w-md mx-auto">
            <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center mx-auto mb-3 text-muted-foreground">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-base font-medium text-foreground mb-1">
              No products found
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Products will be displayed once published.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Contact sales</span>
            </Link>
          </div>
        )}

        {/* Loaded Product Showcase Card */}
        {!isLoading && !isError && products.length > 0 && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {products[currentIndex] && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center p-6 sm:p-8">
                {/* Product Media */}
                <div className="lg:col-span-7">
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-border bg-muted">
                    <img
                      src={getImageUrl(products[currentIndex].image)}
                      alt={products[currentIndex].name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                {/* Product Specifications & Prose */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1">
                      Model #{String(products[currentIndex].id).padStart(4, "0")}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-normal tracking-tight text-foreground mb-3">
                      {products[currentIndex].name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                      {products[currentIndex].description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <span>View all products</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
