import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Wrench,
  ChevronDown,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BACKEND_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

const SERVICES_CACHE_KEY = "gama_services_cache";
const CACHE_DURATION = 5 * 60 * 1000;

const getCachedServices = () => {
  try {
    const cached = localStorage.getItem(SERVICES_CACHE_KEY);
    if (!cached) return null;
    const parsedCache = JSON.parse(cached);
    if (!parsedCache || !Array.isArray(parsedCache.services) || !parsedCache.timestamp) {
      localStorage.removeItem(SERVICES_CACHE_KEY);
      return null;
    }
    if (Date.now() - parsedCache.timestamp > CACHE_DURATION) {
      localStorage.removeItem(SERVICES_CACHE_KEY);
      return null;
    }
    return parsedCache.services;
  } catch (error) {
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

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedServices, setExpandedServices] = useState({});

  useEffect(() => {
    let isMounted = true;

    const fetchServices = async () => {
      try {
        setError("");
        const cached = getCachedServices();
        if (cached) {
          if (isMounted) {
            setServices(cached);
            setLoading(false);
          }
          return;
        }

        if (isMounted) setLoading(true);

        const response = await fetch(`${API_URL}/services/public`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load services");
        }

        const fetchedServices = data.services || [];
        cacheServices(fetchedServices);

        if (isMounted) {
          setServices(fetchedServices);
        }
      } catch (err) {
        try {
          const oldCache = localStorage.getItem(SERVICES_CACHE_KEY);
          if (oldCache) {
            const parsed = JSON.parse(oldCache);
            if (parsed && Array.isArray(parsed.services)) {
              if (isMounted) {
                setServices(parsed.services);
                setError("");
              }
              return;
            }
          }
        } catch (_) {}

        if (isMounted) {
          setError(err.message || "Failed to load services");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchServices();
    return () => {
      isMounted = false;
    };
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "/assets/prod2.jpg";
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    return `${BACKEND_URL}${image.startsWith("/") ? "" : "/"}${image}`;
  };

  const toggleDescription = (id) => {
    setExpandedServices((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="w-full py-16 sm:py-24 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <p className="text-xs font-medium text-muted-foreground mb-1.5">
            Engineering services
          </p>
          <h2 className="text-2xl sm:text-4xl font-normal tracking-tight text-foreground">
            Industrial engineering & field operations
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            Specialized substation maintenance, transformer testing, harmonic analysis, and turnkey industrial installation.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6 space-y-4">
                <div className="aspect-[16/10] rounded-lg bg-muted" />
                <div className="h-5 w-1/2 rounded bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-5/6 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="rounded-xl border border-border bg-muted/40 p-10 text-center max-w-md mx-auto">
            <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-foreground mb-4">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && services.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-12 text-center max-w-md mx-auto">
            <Wrench className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-medium text-foreground mb-1">
              No services listed
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Services information will be published shortly.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <span>Contact engineering</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Services Cards */}
        {!loading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const isExpanded = expandedServices[service.id];
              return (
                <div
                  key={service.id}
                  className="rounded-xl border border-border bg-muted/30 p-1.5 flex flex-col justify-between"
                >
                  {/* Tinted Top Bar */}
                  <div className="px-4 py-2.5 flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">
                      Service #{String(service.id).padStart(3, "0")}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground bg-card px-2 py-0.5 rounded-md border border-border">
                      Certified
                    </span>
                  </div>

                  {/* Concentric Inner Body */}
                  <div className="flex-1 rounded-[calc(0.75rem-4px)] bg-card border border-border/80 p-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {service.image && (
                        <div className="aspect-[16/10] rounded-lg overflow-hidden bg-muted border border-border/60">
                          <img
                            src={getImageUrl(service.image)}
                            alt={service.title || service.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <h3 className="text-base font-medium text-foreground tracking-tight">
                        {service.title || service.name}
                      </h3>

                      <p
                        className={`text-xs text-muted-foreground leading-relaxed ${
                          isExpanded ? "" : "line-clamp-3"
                        }`}
                      >
                        {service.description}
                      </p>

                      {service.description && service.description.length > 120 && (
                        <button
                          type="button"
                          onClick={() => toggleDescription(service.id)}
                          className="text-xs font-medium text-foreground hover:underline inline-flex items-center gap-1"
                        >
                          <span>{isExpanded ? "Show less" : "Read details"}</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Field certified</span>
                      </div>
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground/80 transition-colors"
                      >
                        <span>Book service</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
