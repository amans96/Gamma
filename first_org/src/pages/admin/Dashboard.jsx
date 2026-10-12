
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Wrench,
  FileText,
  Users,
  Activity,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ==========================================
// DASHBOARD CACHE SETTINGS
// ==========================================

const DASHBOARD_CACHE_KEY = "gama_admin_dashboard_cache";
const DASHBOARD_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function readDashboardCache() {
  try {
    const cached = sessionStorage.getItem(DASHBOARD_CACHE_KEY);

    if (!cached) return null;

    const parsed = JSON.parse(cached);

    if (!parsed.dashboard || typeof parsed.cachedAt !== "number") {
      return null;
    }

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

// ==========================================
// FRAMER MOTION
// ==========================================

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

// ==========================================
// DASHBOARD COMPONENT
// ==========================================

const Dashboard = () => {
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

        // Keep displaying cached data if the background refresh fails.
        setError((currentError) => {
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

  // Load immediately from cache, then refresh only when the cache is stale.
  useEffect(() => {
    const cacheIsFresh =
      initialCache &&
      Date.now() - initialCache.cachedAt < DASHBOARD_CACHE_DURATION;

    if (!cacheIsFresh) {
      fetchDashboard({ background: Boolean(initialCache?.dashboard) });
    }
  }, [initialCache, fetchDashboard]);

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading && !dashboard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (error && !dashboard) {
    return (
      <div className="p-8">
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-2xl border border-red-100 max-w-lg mx-auto text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => fetchDashboard()}
            className="mt-5 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard) return null;

  // ==========================================
  // DASHBOARD STATISTICS
  // ==========================================

  const statCards = [
    {
      title: "Products",
      value: dashboard.stats.products,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Services",
      value: dashboard.stats.services,
      icon: Wrench,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Blog Posts",
      value: dashboard.stats.blogPosts,
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Partners",
      value: dashboard.stats.partners,
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  // ==========================================
  // DASHBOARD UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Overview
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome back. Here's what's happening today.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchDashboard({ background: Boolean(dashboard) })}
            disabled={refreshing}
            title="Refresh dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60 transition"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">
              {refreshing ? "Refreshing..." : "Refresh"}
            </span>
          </button>
        </div>

        {/* Background refresh notice */}
        {refreshing && (
          <p className="text-sm text-gray-500">
            Updating dashboard data...
          </p>
        )}

        {/* Refresh error: cached dashboard remains visible */}
        {error && dashboard && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Could not refresh the dashboard. Showing previously loaded data.
          </div>
        )}

        {/* Statistics Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.title}
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>

                  <div
                    className={`p-2 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-900">
                  {stat.value ?? 0}
                </h2>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
          </div>

          <div className="p-6">
            {dashboard.recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent activity found.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {dashboard.recentActivity.map((activity, index) => (
                  <div key={activity.id} className="flex gap-4 group">
                    {/* Timeline dot */}
                    <div className="relative flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-100 border-2 border-blue-500 mt-1.5 group-hover:bg-blue-500 transition-colors" />

                      {index !== dashboard.recentActivity.length - 1 && (
                        <div className="w-px h-full bg-gray-200 mt-2 absolute top-3" />
                      )}
                    </div>

                    {/* Activity content */}
                    <div className="pb-1">
                      <p className="font-medium text-gray-900">
                        {activity.details}
                      </p>

                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <span className="font-medium text-gray-700">
                          {activity.user?.name || "Admin"}
                        </span>

                        <span>•</span>

                        <span>
                          {new Date(activity.createdAt).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
