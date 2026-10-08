import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  AlertCircle,
  LayoutTemplate,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BACKEND_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

// ==========================================
// CACHE SETTINGS
// ==========================================

const SERVICES_CACHE_KEY = "gama_services_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ==========================================
// ANIMATIONS
// ==========================================

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// ==========================================
// SERVICES CACHE HELPERS
// ==========================================

const getCachedServices = () => {
  try {
    const cached = localStorage.getItem(SERVICES_CACHE_KEY);

    if (!cached) {
      return null;
    }

    const parsedCache = JSON.parse(cached);

    if (
      !parsedCache ||
      !Array.isArray(parsedCache.services) ||
      !parsedCache.timestamp
    ) {
      localStorage.removeItem(SERVICES_CACHE_KEY);
      return null;
    }

    const cacheAge = Date.now() - parsedCache.timestamp;

    // Cache expired
    if (cacheAge > CACHE_DURATION) {
      localStorage.removeItem(SERVICES_CACHE_KEY);
      return null;
    }

    return parsedCache.services;
  } catch (error) {
    console.error("SERVICES CACHE READ ERROR:", error);

    localStorage.removeItem(SERVICES_CACHE_KEY);

    return null;
  }
};

const cacheServices = (services) => {
  try {
    localStorage.setItem(
      SERVICES_CACHE_KEY,
      JSON.stringify({
        services,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error("SERVICES CACHE WRITE ERROR:", error);
  }
};

// ==========================================
// COMPONENT
// ==========================================

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Keeps track of which service cards are expanded
  const [expandedServices, setExpandedServices] = useState({});

  // ==========================================
  // FETCH SERVICES
  // ==========================================

  useEffect(() => {
    let isMounted = true;

    const fetchServices = async () => {
      try {
        setError("");

        // ==========================================
        // CHECK CACHE FIRST
        // ==========================================

        const cachedServices = getCachedServices();

        if (cachedServices) {
          console.log("SERVICES: Using cached data");

          if (isMounted) {
            setServices(cachedServices);
            setLoading(false);
          }

          return;
        }

        // ==========================================
        // NO CACHE - FETCH FROM API
        // ==========================================

        console.log("SERVICES: Fetching from API");

        if (isMounted) {
          setLoading(true);
        }

        const response = await fetch(`${API_URL}/services/public`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load services"
          );
        }

        const fetchedServices = data.services || [];

        // ==========================================
        // SAVE TO CACHE
        // ==========================================

        cacheServices(fetchedServices);

        if (isMounted) {
          setServices(fetchedServices);
        }
      } catch (err) {
        console.error("SERVICES ERROR:", err);

        // ==========================================
        // FALLBACK TO OLD CACHE
        // ==========================================

        try {
          const oldCache = localStorage.getItem(
            SERVICES_CACHE_KEY
          );

          if (oldCache) {
            const parsedCache = JSON.parse(oldCache);

            if (
              parsedCache &&
              Array.isArray(parsedCache.services)
            ) {
              console.log(
                "SERVICES: API failed, using old cached data"
              );

              if (isMounted) {
                setServices(parsedCache.services);
                setError("");
              }

              return;
            }
          }
        } catch (cacheError) {
          console.error(
            "SERVICES FALLBACK CACHE ERROR:",
            cacheError
          );
        }

        if (isMounted) {
          setError(
            err.message || "Failed to load services"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchServices();

    return () => {
      isMounted = false;
    };
  }, []);

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${BACKEND_URL}${image}`;
    }

    return `${BACKEND_URL}/${image}`;
  };

  // ==========================================
  // SEE MORE / SEE LESS
  // ==========================================

  const toggleDescription = (serviceId) => {
    setExpandedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <section className="w-full py-20 sm:py-24">
        <div className="mx-auto flex min-h-[400px] max-w-7xl flex-col items-center justify-center px-5">
          <Loader2 className="mb-4 h-9 w-9 animate-spin text-indigo-600" />

          <p className="text-sm font-medium text-gray-500">
            Loading services...
          </p>
        </div>
      </section>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <section className="w-full py-20 sm:py-24">
        <div className="mx-auto flex min-h-[400px] max-w-7xl items-center justify-center px-5">
          <div className="w-full max-w-md rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
            <AlertCircle className="mx-auto mb-4 h-10 w-10 text-red-500" />

            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Unable to load services
            </h2>

            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  // EMPTY
  // ==========================================

  if (services.length === 0) {
    return (
      <section className="w-full py-20 sm:py-24">
        <div className="mx-auto flex min-h-[400px] max-w-7xl flex-col items-center justify-center px-5 text-center">
          <div className="mb-5 rounded-2xl bg-gray-100 p-5">
            <LayoutTemplate className="h-10 w-10 text-gray-400" />
          </div>

          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            No Services Available
          </h2>

          <p className="max-w-md text-gray-500">
            Our services will appear here once they are
            available.
          </p>
        </div>
      </section>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <section className="w-full bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="mb-12 max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600"
          >
            What We Offer
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl"
          >
            Our Services
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-xl text-base leading-7 text-gray-500 sm:text-lg"
          >
            Explore the services we provide and discover
            how we can help you.
          </motion.p>
        </div>

        {/* SERVICES */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => {
            const isExpanded =
              expandedServices[service.id] || false;

            return (
              <motion.article
                key={service.id}
                variants={cardVariants}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* IMAGE */}

                <div className="relative h-52 shrink-0 overflow-hidden bg-gray-100 sm:h-56">
                  {service.image ? (
                    <img
                      src={getImageUrl(service.image)}
                      alt={service.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <LayoutTemplate className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* CONTENT */}

                <div className="flex flex-1 flex-col p-6">

                  {/* SERVICE NAME */}

                  <h3 className="text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-indigo-600">
                    {service.name}
                  </h3>

                  {/* DESCRIPTION */}

                  {service.description && (
                    <div className="mt-3">
                      <p
                        className={`text-sm leading-6 text-gray-600 ${
                          !isExpanded
                            ? "line-clamp-5"
                            : ""
                        }`}
                      >
                        {service.description}
                      </p>

                      {/* SEE MORE / SEE LESS */}

                      {service.description.length > 250 && (
                        <button
                          type="button"
                          onClick={() =>
                            toggleDescription(service.id)
                          }
                          className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-800"
                        >
                          {isExpanded ? (
                            <>
                              See less
                              <ChevronUp className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              See more
                              <ChevronDown className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}