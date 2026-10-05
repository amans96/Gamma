
import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [current, setCurrent] = useState(1);
  const [transition, setTransition] = useState(true);

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const timeoutRef = useRef(null);
  const isTransitioningRef = useRef(false);

  // =========================================================
  // GET PUBLIC PRODUCTS
  // =========================================================

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
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // =========================================================
  // HANDLE WINDOW RESIZE
  // =========================================================

  useEffect(() => {
    let resizeTimeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // =========================================================
  // RESET CAROUSEL WHEN PRODUCTS CHANGE
  // =========================================================

  useEffect(() => {
    if (products.length > 0) {
      setCurrent(1);
      setTransition(false);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransition(true);
        });
      });
    }
  }, [products.length]);

  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (image) => {
    if (!image) return "";

    const normalizedPath = image.replace(/\\/g, "/");

    if (
      normalizedPath.startsWith("http://") ||
      normalizedPath.startsWith("https://")
    ) {
      return normalizedPath;
    }

    const slash = normalizedPath.startsWith("/") ? "" : "/";

    return `${BACKEND_URL}${slash}${normalizedPath}`;
  };

  // =========================================================
  // CAROUSEL PRODUCTS
  // =========================================================

  const extendedProducts = useMemo(() => {
    if (products.length <= 1) return products;

    return [
      products[products.length - 1],
      ...products,
      products[0],
    ];
  }, [products]);

  // =========================================================
  // NEXT
  // =========================================================

  const next = () => {
    if (products.length <= 1 || isTransitioningRef.current) return;

    isTransitioningRef.current = true;
    setCurrent((prev) => prev + 1);
  };

  // =========================================================
  // PREVIOUS
  // =========================================================

  const prev = () => {
    if (products.length <= 1 || isTransitioningRef.current) return;

    isTransitioningRef.current = true;
    setCurrent((prev) => prev - 1);
  };

  // =========================================================
  // INFINITE CAROUSEL
  // =========================================================

  useEffect(() => {
    if (products.length <= 1) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (current === extendedProducts.length - 1) {
      timeoutRef.current = setTimeout(() => {
        setTransition(false);
        setCurrent(1);
        isTransitioningRef.current = false;
      }, 700);
    } else if (current === 0) {
      timeoutRef.current = setTimeout(() => {
        setTransition(false);
        setCurrent(products.length);
        isTransitioningRef.current = false;
      }, 700);
    } else {
      isTransitioningRef.current = false;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    current,
    products.length,
    extendedProducts.length,
  ]);

  // =========================================================
  // RE-ENABLE TRANSITION
  // =========================================================

  useEffect(() => {
    if (!transition) {
      const rafId = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransition(true);
        });
      });

      return () => cancelAnimationFrame(rafId);
    }
  }, [transition]);

  // =========================================================
  // DIMENSIONS
  // =========================================================

  const getSlideWidth = () => {
    if (windowWidth < 640) return windowWidth - 40;
    if (windowWidth < 768) return windowWidth - 48;
    if (windowWidth < 1024) return windowWidth - 64;

    return Math.min(1020, windowWidth - 80);
  };

  const getGap = () => {
    if (windowWidth < 640) return 16;
    if (windowWidth < 768) return 20;

    return 32;
  };

  const getCardHeight = () => {
    if (windowWidth < 640) return 400;
    if (windowWidth < 768) return 440;
    if (windowWidth < 1024) return 500;

    return 560;
  };

  const slideWidth = getSlideWidth();
  const gap = getGap();
  const cardHeight = getCardHeight();

  const getTranslateX = () => {
    if (products.length <= 1) return 0;

    return current * (slideWidth + gap);
  };

  // =========================================================
  // PREMIUM LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <section className="w-full overflow-hidden py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-[1405px] px-4 sm:px-5">

          {/* Header */}
          <div className="mb-8 flex items-end justify-between sm:mb-10">

            <div>
              {/* Tiny eyebrow */}
              <div className="mb-3 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-500" />
                </span>

                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                  Discover
                </span>
              </div>

              {/* Animated title */}
              <div className="relative h-10 w-56 overflow-hidden sm:h-12 sm:w-72 md:h-14 md:w-80">
                <div className="absolute inset-0 animate-pulse rounded-xl bg-gray-200" />

                {/* Moving shine */}
                <div
                  className="
                    absolute
                    inset-y-0
                    -left-full
                    w-1/2
                    skew-x-[-20deg]
                    bg-gradient-to-r
                    from-transparent
                    via-white/80
                    to-transparent
                    animate-[shimmer_1.6s_infinite]
                  "
                />
              </div>
            </div>

            {/* Fake navigation controls */}
            <div className="hidden gap-3 sm:flex">
              <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200 sm:h-14 sm:w-14" />
              <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200 sm:h-14 sm:w-14" />
            </div>
          </div>

          {/* Product skeleton */}
          <div
            className="
              relative
              overflow-hidden
              rounded-[20px]
              bg-gray-200
              sm:rounded-[30px]
            "
            style={{ height: `${cardHeight}px` }}
          >

            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300" />

            {/* Huge ambient glow */}
            <div
              className="
                absolute
                -right-32
                -top-32
                h-[500px]
                w-[500px]
                rounded-full
                bg-white/60
                blur-[100px]
                animate-pulse
              "
            />

            {/* Shimmer sweep */}
            <div
              className="
                absolute
                inset-y-0
                -left-[60%]
                w-[45%]
                skew-x-[-20deg]
                bg-gradient-to-r
                from-transparent
                via-white/60
                to-transparent
                animate-[productShimmer_2s_ease-in-out_infinite]
              "
            />

            {/* Fake content */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16">

              {/* Badge */}
              <div className="mb-6 h-6 w-28 animate-pulse rounded-full bg-gray-300/80" />

              {/* Product title */}
              <div className="space-y-3">
                <div className="h-10 w-[70%] animate-pulse rounded-lg bg-gray-300 sm:h-12 md:h-16" />

                <div className="h-10 w-[48%] animate-pulse rounded-lg bg-gray-300 sm:h-12 md:h-16" />
              </div>

              {/* Description */}
              <div className="mt-6 max-w-xl space-y-3">
                <div className="h-3 w-full animate-pulse rounded-full bg-gray-300/80" />
                <div className="h-3 w-[85%] animate-pulse rounded-full bg-gray-300/80" />
                <div className="h-3 w-[65%] animate-pulse rounded-full bg-gray-300/80" />
              </div>

              {/* Fake CTA */}
              <div className="mt-8 h-11 w-32 animate-pulse rounded-full bg-gray-300/90" />
            </div>

            {/* Bottom loading indicator */}
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
            </div>
          </div>

          {/* Mobile dots */}
          <div className="mt-6 flex justify-center gap-2 sm:mt-8">
            <div className="h-2 w-8 animate-pulse rounded-full bg-gray-300" />
            <div className="h-2 w-2 animate-pulse rounded-full bg-gray-200" />
            <div className="h-2 w-2 animate-pulse rounded-full bg-gray-200" />
          </div>

          {/* Loading text */}
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>Curating our collection</span>

            <span className="flex gap-0.5">
              <span className="animate-bounce [animation-delay:-0.3s]">
                .
              </span>
              <span className="animate-bounce [animation-delay:-0.15s]">
                .
              </span>
              <span className="animate-bounce">.</span>
            </span>
          </div>
        </div>

        {/* Custom animation keyframes */}
        <style>{`
          @keyframes shimmer {
            0% {
              transform: translateX(0) skewX(-20deg);
            }
            100% {
              transform: translateX(400%) skewX(-20deg);
            }
          }

          @keyframes productShimmer {
            0% {
              transform: translateX(0) skewX(-20deg);
              opacity: 0;
            }
            20% {
              opacity: 1;
            }
            80% {
              opacity: 1;
            }
            100% {
              transform: translateX(400%) skewX(-20deg);
              opacity: 0;
            }
          }
        `}</style>
      </section>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <section className="w-full py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-[1405px] px-4 sm:px-5">
          <h2 className="mb-8 text-3xl font-bold sm:text-4xl md:text-5xl">
            Our Products
          </h2>

          <div
            className="flex items-center justify-center rounded-[20px] bg-gray-100 sm:rounded-[30px]"
            style={{ height: `${cardHeight}px` }}
          >
            <p className="text-red-500">
              {error.message || "Failed to load products."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // EMPTY
  // =========================================================

  if (products.length === 0) {
    return (
      <section className="w-full py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-[1405px] px-4 sm:px-5">
          <h2 className="mb-8 text-3xl font-bold sm:text-4xl md:text-5xl">
            Our Products
          </h2>

          <div
            className="flex items-center justify-center rounded-[20px] bg-gray-100 sm:rounded-[30px]"
            style={{ height: `${cardHeight}px` }}
          >
            <p className="text-gray-500">
              No products available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // MAIN RENDER
  // =========================================================

  return (
    <section className="w-full py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-[1405px] px-4 sm:px-5">

        {/* HEADER */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-10 sm:flex-row sm:items-center sm:gap-6">

          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">
              Discover
            </span>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Our Products
            </h2>
          </div>

          <div className="flex w-full justify-end gap-3 sm:w-auto sm:gap-4">
            <button
              type="button"
              onClick={prev}
              disabled={products.length <= 1}
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-black
                text-white
                transition-all
                duration-300
                hover:-translate-x-1
                hover:bg-orange-500
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:h-14
                sm:w-14
              "
              aria-label="Previous product"
            >
              <ChevronLeft size={windowWidth < 640 ? 20 : 24} />
            </button>

            <button
              type="button"
              onClick={next}
              disabled={products.length <= 1}
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-black
                text-white
                transition-all
                duration-300
                hover:translate-x-1
                hover:bg-orange-500
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:h-14
                sm:w-14
              "
              aria-label="Next product"
            >
              <ChevronRight size={windowWidth < 640 ? 20 : 24} />
            </button>
          </div>
        </div>

        {/* CAROUSEL */}
        <div className="w-full overflow-hidden">
          <div
            className="flex"
            style={{
              gap: `${gap}px`,
              transform: `translateX(-${getTranslateX()}px)`,
              transition: transition
                ? "transform 700ms cubic-bezier(0.4, 0, 0.2, 1)"
                : "none",
            }}
          >
            {extendedProducts.map((product, index) => (
              <Link
                to="/products"
                key={`${product.id}-${index}`}
                className="
                  group
                  relative
                  block
                  shrink-0
                  cursor-pointer
                  overflow-hidden
                  rounded-[20px]
                  sm:rounded-[30px]
                "
                style={{
                  width: `${slideWidth}px`,
                  height: `${cardHeight}px`,
                }}
              >
                {/* IMAGE */}
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name || "Product"}
                  width="1200"
                  height="560"
                  loading={index === current ? "eager" : "lazy"}
                  decoding="async"
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    object-center
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-105
                  "
                />

                {/* GRADIENT */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      windowWidth < 640
                        ? "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%)"
                        : windowWidth < 768
                        ? "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 100%)"
                        : "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.05) 100%)",
                  }}
                />

                {/* CONTENT */}
                <div className="relative z-10 flex h-full flex-col justify-center px-6 text-white sm:px-8 md:px-12 lg:px-16">

                  <h1
                    className="mb-3 font-bold leading-tight sm:mb-4 md:mb-6"
                    style={{
                      fontSize:
                        windowWidth < 640
                          ? "1.75rem"
                          : windowWidth < 768
                          ? "2.25rem"
                          : windowWidth < 1024
                          ? "3rem"
                          : "3.75rem",
                      maxWidth:
                        windowWidth < 640 ? "100%" : "80%",
                    }}
                  >
                    {product.name}
                  </h1>

                  <p
                    className="leading-relaxed text-gray-200"
                    style={{
                      fontSize:
                        windowWidth < 640
                          ? "0.875rem"
                          : windowWidth < 768
                          ? "1rem"
                          : "1.125rem",
                      maxWidth:
                        windowWidth < 640
                          ? "100%"
                          : windowWidth < 768
                          ? "90%"
                          : "70%",
                      lineHeight:
                        windowWidth < 640 ? "1.6" : "1.8",
                    }}
                  >
                    {product.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* DOTS */}
        {products.length > 1 && (
          <div className="mt-6 flex justify-center gap-2 sm:mt-8 md:hidden">
            {products.map((product, index) => {
              const activeIndex =
                ((current - 1) % products.length +
                  products.length) %
                products.length;

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    if (isTransitioningRef.current) return;

                    setCurrent(index + 1);
                    isTransitioningRef.current = true;

                    setTimeout(() => {
                      isTransitioningRef.current = false;
                    }, 700);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? "w-8 bg-orange-500"
                      : "w-2 bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

