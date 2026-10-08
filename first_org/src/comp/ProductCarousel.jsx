
import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ThreeDot } from "react-loading-indicators";

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
  // POWER SYSTEM LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <section className="w-full overflow-hidden py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-[1405px] px-4 sm:px-5">

          {/* HEADER */}
          <div className="mb-8 flex items-end justify-between sm:mb-10">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />

                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                </span>

                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                  Powering Up
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                Our Products
              </h2>
            </div>

            {/* Fake navigation controls */}
            <div className="hidden gap-3 sm:flex">
              <div className="h-12 w-12 rounded-full border border-gray-200 bg-gray-50 sm:h-14 sm:w-14" />

              <div className="h-12 w-12 rounded-full border border-gray-200 bg-gray-50 sm:h-14 sm:w-14" />
            </div>
          </div>

          {/* POWER PANEL */}
          <div
            className="
              relative
              overflow-hidden
              rounded-[20px]
              bg-[#111111]
              sm:rounded-[30px]
            "
            style={{ height: `${cardHeight}px` }}
          >

            {/* Industrial grid */}
            <div
              className="
                absolute
                inset-0
                opacity-[0.06]
                [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)]
                [background-size:40px_40px]
              "
            />

            {/* Ambient glow */}
            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-[350px]
                w-[350px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-green-500/10
                blur-[100px]
              "
            />

            {/* ELECTRICAL CIRCUIT */}
            <div className="absolute inset-0 flex items-center justify-center">

              {/* Circuit line */}
              <div className="relative h-px w-[70%] bg-white/10">

                {/* Left node */}
                <div className="absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-white/20 bg-[#111111]" />

                {/* Right node */}
                <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-white/20 bg-[#111111]" />

                {/* Electrical pulse */}
                <div
                  className="
                    absolute
                    left-0
                    top-1/2
                    h-1
                    w-20
                    -translate-y-1/2
                    rounded-full
                    bg-green-400
                    shadow-[0_0_18px_rgba(50,205,50,0.9)]
                    animate-[electricity_1.8s_linear_infinite]
                  "
                />
              </div>

              {/* CENTER POWER UNIT */}
              <div
                className="
                  absolute
                  flex
                  h-28
                  w-24
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/10
                  bg-[#181818]
                  shadow-2xl
                  sm:h-36
                  sm:w-32
                "
              >

                {/* Loader */}
                <ThreeDot
                  variant="bounce"
                  color="#32cd32"
                  size="medium"
                  text=""
                  textColor=""
                />

                {/* Status indicators */}
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(50,205,50,0.8)]" />

                  <span className="h-1.5 w-1.5 rounded-full bg-white/10" />

                  <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
                </div>
              </div>
            </div>

            {/* SYSTEM STATUS */}
            <div className="absolute left-6 top-6 sm:left-8 sm:top-8 md:left-12 md:top-10">

              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

                <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/40">
                  System Status
                </span>
              </div>

              <p className="text-sm font-medium text-white/70">
                Initializing power systems
              </p>
            </div>

            {/* TECHNICAL INFORMATION */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between sm:bottom-8 sm:left-8 sm:right-8 md:bottom-10 md:left-12 md:right-12">

              <div>
                <p className="mb-1 text-[10px] uppercase tracking-[0.25em] text-white/30">
                  Voltage
                </p>

                <p className="font-mono text-sm text-white/70">
                  220 V
                </p>
              </div>

              <div className="hidden sm:block">
                <p className="mb-1 text-right text-[10px] uppercase tracking-[0.25em] text-white/30">
                  Supply
                </p>

                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />

                  <span className="text-sm text-white/60">
                    Connecting...
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE DOTS */}
          <div className="mt-6 flex justify-center gap-2 sm:mt-8">
            <span className="h-1.5 w-8 rounded-full bg-green-500" />

            <span className="h-1.5 w-1.5 rounded-full bg-gray-200" />

            <span className="h-1.5 w-1.5 rounded-full bg-gray-200" />
          </div>

          {/* LOADING MESSAGE */}
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>Connecting to our power systems</span>

            <span className="flex gap-0.5">
              <span className="animate-bounce [animation-delay:-0.3s]">
                .
              </span>

              <span className="animate-bounce [animation-delay:-0.15s]">
                .
              </span>

              <span className="animate-bounce">
                .
              </span>
            </span>
          </div>
        </div>

        {/* ELECTRICAL ANIMATION */}
        <style>{`
          @keyframes electricity {
            0% {
              transform: translateX(-20px);
              opacity: 0;
            }

            15% {
              opacity: 1;
            }

            85% {
              opacity: 1;
            }

            100% {
              transform: translateX(700px);
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

          {/* NAVIGATION */}
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

