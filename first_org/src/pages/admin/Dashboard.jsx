import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  Wrench, 
  FileText, 
  Users, 
  Activity, 
  AlertCircle, 
  Loader2 
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

// Framer Motion variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load dashboard");
        }

        setDashboard(data);
      } catch (error) {
        console.error("DASHBOARD ERROR:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-2xl border border-red-100 max-w-lg mx-auto text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: "Products", value: dashboard.stats.products, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Services", value: dashboard.stats.services, icon: Wrench, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Blog Posts", value: dashboard.stats.blogPosts, icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Partners", value: dashboard.stats.partners, icon: Users, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
            <p className="text-gray-500 mt-1">Welcome back. Here's what's happening today.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <div className={`p-2 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </h2>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
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
                      <div className="w-3 h-3 rounded-full bg-blue-100 border-2 border-blue-500 mt-1.5 group-hover:bg-blue-500 transition-colors"></div>
                      {index !== dashboard.recentActivity.length - 1 && (
                        <div className="w-px h-full bg-gray-200 mt-2 absolute top-3"></div>
                      )}
                    </div>
                    
                    {/* Activity Content */}
                    <div className="pb-1">
                      <p className="font-medium text-gray-900">
                        {activity.details}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <span className="font-medium text-gray-700">{activity.user?.name || "Admin"}</span>
                        <span>•</span>
                        <span>
                          {new Date(activity.createdAt).toLocaleDateString(undefined, { 
                            month: 'short', 
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
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