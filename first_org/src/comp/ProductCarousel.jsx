
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
console.log("API_URL:", API_URL);
export default function ProductCarousel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/products/public`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load products"
          );
        }

        console.log("PUBLIC PRODUCTS:", data);

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
    if (!image) {
      return "";
    }

    // If backend already gives a complete URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // If backend gives /uploads/image.jpg
    if (image.startsWith("/")) {
      return `${API_URL}${image}`;
    }

    // If backend gives uploads/image.jpg
    return `${API_URL}/${image}`;
  };

  // =========================================================
  // CAROUSEL PRODUCTS
  // =========================================================

  const extendedProducts =
    products.length > 1
      ? [
          products[products.length - 1],
          ...products,
          products[0],
        ]
      : products;

  // =========================================================
  // NEXT
  // =========================================================

  const next = () => {
    if (
      products.length <= 1 ||
      isTransitioningRef.current
    ) {
      return;
    }

    isTransitioningRef.current = true;

    setTransition(true);

    setCurrent((prev) => prev + 1);
  };

  // =========================================================
  // PREVIOUS
  // =========================================================

  const prev = () => {
    if (
      products.length <= 1 ||
      isTransitioningRef.current
    ) {
      return;
    }

    isTransitioningRef.current = true;

    setTransition(true);

    setCurrent((prev) => prev - 1);
  };

  // =========================================================
  // INFINITE CAROUSEL
  // =========================================================

  useEffect(() => {
    if (products.length <= 1) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Reached duplicate first slide
    if (current === extendedProducts.length - 1) {
      timeoutRef.current = setTimeout(() => {
        setTransition(false);
        setCurrent(1);
        isTransitioningRef.current = false;
      }, 700);
    }

    // Reached duplicate last slide
    else if (current === 0) {
      timeoutRef.current = setTimeout(() => {
        setTransition(false);
        setCurrent(products.length);
        isTransitioningRef.current = false;
      }, 700);
    }

    else {
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
  // SLIDE WIDTH
  // =========================================================

  const getSlideWidth = () => {
    if (windowWidth < 640) {
      return windowWidth - 40;
    }

    if (windowWidth < 768) {
      return windowWidth - 48;
    }

    if (windowWidth < 1024) {
      return windowWidth - 64;
    }

    return Math.min(1020, windowWidth - 80);
  };

  // =========================================================
  // GAP
  // =========================================================

  const getGap = () => {
    if (windowWidth < 640) {
      return 16;
    }

    if (windowWidth < 768) {
      return 20;
    }

    return 32;
  };

  // =========================================================
  // CARD HEIGHT
  // =========================================================

  const getCardHeight = () => {
    if (windowWidth < 640) {
      return 400;
    }

    if (windowWidth < 768) {
      return 440;
    }

    if (windowWidth < 1024) {
      return 500;
    }

    return 560;
  };

  // =========================================================
  // TRANSLATE
  // =========================================================

  const slideWidth = getSlideWidth();
  const gap = getGap();
  const cardHeight = getCardHeight();

  const getTranslateX = () => {
    if (products.length <= 1) {
      return 0;
    }

    return current * (slideWidth + gap);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <section className="w-full py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-[1405px] px-4 sm:px-5">
          <h2 className="mb-8 text-3xl font-bold sm:text-4xl md:text-5xl">
            Our Products
          </h2>

          <div
            className="flex items-center justify-center rounded-[20px] bg-gray-100 sm:rounded-[30px]"
            style={{
              height: `${cardHeight}px`,
            }}
          >
            <p className="text-gray-500">
              Loading products...
            </p>
          </div>
        </div>
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
            style={{
              height: `${cardHeight}px`,
            }}
          >
            <p className="text-red-500">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // NO PRODUCTS
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
            style={{
              height: `${cardHeight}px`,
            }}
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
  // MAIN
  // =========================================================

  return (
    <section className="w-full py-12 sm:py-16 md:py-20">

      <div className="mx-auto max-w-[1405px] px-4 sm:px-5">

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-10 sm:flex-row sm:items-center sm:gap-6">

          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            Our Products
          </h2>

          {/* Navigation buttons */}

          <div className="flex w-full justify-end gap-3 sm:w-auto sm:gap-4">

            <button
              type="button"
              onClick={prev}
              disabled={products.length <= 1}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white transition-colors duration-300 hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:w-14"
              aria-label="Previous product"
            >
              <ChevronLeft
                size={windowWidth < 640 ? 20 : 24}
              />
            </button>

            <button
              type="button"
              onClick={next}
              disabled={products.length <= 1}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white transition-colors duration-300 hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:w-14"
              aria-label="Next product"
            >
              <ChevronRight
                size={windowWidth < 640 ? 20 : 24}
              />
            </button>

          </div>
        </div>

        {/* =================================================
            CAROUSEL
        ================================================== */}

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

              <div
                key={`${product.id}-${index}`}
                className="relative shrink-0 overflow-hidden rounded-[20px] sm:rounded-[30px]"
                style={{
                  width: `${slideWidth}px`,
                  height: `${cardHeight}px`,
                }}
              >

                {/* =================================================
                    BACKGROUND IMAGE
                ================================================== */}

                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${getImageUrl(
                      product.image
                    )}")`,
                  }}
                />

                {/* =================================================
                    GRADIENT
                ================================================== */}

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

                {/* =================================================
                    CONTENT
                ================================================== */}

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
                        windowWidth < 640
                          ? "100%"
                          : "80%",
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
                        windowWidth < 640
                          ? "1.6"
                          : "1.8",
                    }}
                  >
                    {product.description}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* =================================================
            DOTS
        ================================================== */}

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

                    if (
                      isTransitioningRef.current
                    ) {
                      return;
                    }

                    setTransition(true);

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
                  aria-label={`Go to slide ${
                    index + 1
                  }`}
                />
              );
            })}

          </div>
        )}

      </div>

    </section>
  );
}

