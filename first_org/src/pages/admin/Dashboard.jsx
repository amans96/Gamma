import { useCallback, useEffect, useState } from "react";
import {
  Package,
  Wrench,
  FileText,
  Users,
  Activity,
  AlertCircle,
  Loader2,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const DASHBOARD_CACHE_KEY = "gama_admin_dashboard_cache";
const DASHBOARD_CACHE_DURATION = 5 * 60 * 1000;

function readDashboardCache() {
  try {
    const cached = sessionStorage.getItem(DASHBOARD_CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    if (!parsed.dashboard || typeof parsed.cachedAt !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeDashboardCache(dashboard) {
  try {
    sessionStorage.setItem(
      DASHBOARD_CACHE_KEY,
      JSON.stringify({
        dashboard,
        cachedAt: Date.now(),
      })
    );
  } catch (error) {
    console.warn("Could not save dashboard cache:", error);
  }
}

function clearDashboardCache() {
  try {
    sessionStorage.removeItem(DASHBOARD_CACHE_KEY);
  } catch (error) {
    console.warn("Could not clear dashboard cache:", error);
  }
}

export default function Dashboard() {
  const [initialCache] = useState(() => readDashboardCache());
  const [dashboard, setDashboard] = useState(
    () => initialCache?.dashboard || null
  );
  const [loading, setLoading] = useState(!initialCache?.dashboard);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const hasCachedDashboard = Boolean(initialCache?.dashboard);

  const fetchDashboard = useCallback(
    async ({ background = false } = {}) => {
      if (background) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          clearDashboardCache();
          setDashboard(null);
          throw new Error("You are not authenticated. Please log in again.");
        }

        const response = await fetch(`${API_URL}/admin/dashboard`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            clearDashboardCache();
            setDashboard(null);
          }
          throw new Error(data.message || "Failed to load dashboard.");
        }

        if (!data.stats || !Array.isArray(data.recentActivity)) {
          throw new Error("The server returned an invalid dashboard response.");
        }

        setDashboard(data);
        writeDashboardCache(data);
      } catch (err) {
        console.error("DASHBOARD ERROR:", err);
        setError((current) => {
          if (dashboard || hasCachedDashboard) return "";
          return err.message || "Failed to load dashboard.";
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [dashboard, hasCachedDashboard]
  );

  useEffect(() => {
    const cacheIsFresh =
      initialCache &&
      Date.now() - initialCache.cachedAt < DASHBOARD_CACHE_DURATION;

    if (!cacheIsFresh) {
      fetchDashboard({ background: Boolean(initialCache?.dashboard) });
    }
  }, [initialCache, fetchDashboard]);

  if (loading && !dashboard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-3">
        <Loader2 className="w-7 h-7 text-muted-foreground animate-spin" />
        <p className="text-xs text-muted-foreground">
          Loading dashboard metrics...
        </p>
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50/70 p-6 max-w-lg mx-auto text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
        <h2 className="text-sm font-medium text-red-900">
          Unable to load dashboard data
        </h2>
        <p className="text-xs text-red-700">{error}</p>
        <button
          type="button"
          onClick={() => fetchDashboard()}
          className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!dashboard) return null;

  const statCards = [
    {
      title: "Products in catalog",
      value: dashboard.stats.products,
      icon: Package,
      path: "/admin/products",
    },
    {
      title: "Active services",
      value: dashboard.stats.services,
      icon: Wrench,
      path: "/admin/services",
    },
    {
      title: "Published articles",
      value: dashboard.stats.blogPosts,
      icon: FileText,
      path: "/admin/blog",
    },
    {
      title: "Corporate partners",
      value: dashboard.stats.partners,
      icon: Users,
      path: "/admin/partners",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-normal tracking-tight text-foreground">
            System overview
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Operational statistics and recent administrative activity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchDashboard({ background: Boolean(dashboard) })}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          <span>{refreshing ? "Refreshing..." : "Refresh data"}</span>
        </button>
      </div>

      {error && dashboard && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/80 px-3.5 py-2.5 text-xs text-amber-800">
          Could not refresh live data. Showing previously cached values.
        </div>
      )}

      {/* KPI Tiles (Calm UI: one number leads per surface, clean neutral frame) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              to={stat.path}
              className="rounded-xl border border-border bg-card p-5 space-y-3 transition-colors hover:border-foreground/20 block"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.title}
                </span>
                <div className="w-7 h-7 rounded-lg bg-muted border border-border flex items-center justify-center text-foreground">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-light tracking-tight text-foreground">
                  {stat.value ?? 0}
                </span>
                <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                  Manage <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-medium text-foreground tracking-tight">
              Recent administrative activity
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            {dashboard.recentActivity.length} events logged
          </span>
        </div>

        <div className="p-5">
          {dashboard.recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs text-muted-foreground">
                No administrative activity has been recorded yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboard.recentActivity.map((activity, index) => (
                <div key={activity.id || index} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-foreground/60 mt-1.5 shrink-0" />
                  <div className="flex-1 space-y-0.5">
                    <p className="font-medium text-foreground">
                      {activity.details}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      <span>{activity.user?.name || "Admin"}</span>
                      <span className="mx-1.5">•</span>
                      <span>
                        {new Date(activity.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
