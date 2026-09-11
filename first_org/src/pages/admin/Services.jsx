import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  X, 
  AlertTriangle, 
  Loader2, 
  LayoutTemplate 
} from "lucide-react";
import ServiceForm from "./ServiceForm";

const API_URL = "http://localhost:5000/api";
const SERVER_URL = "http://localhost:5000";

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    return `${SERVER_URL}${image.startsWith("/") ? image : `/${image}`}`;
  };

  // ==========================================
  // FETCH SERVICES
  // ==========================================

  const fetchServices = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not authenticated.");

      const response = await fetch(`${API_URL}/services`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load services");
      }

      setServices(data.services || []);
    } catch (err) {
      console.error("FETCH SERVICES ERROR:", err);
      setError(err.message || "Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredServices = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return services;

    return services.filter(
      (service) =>
        service.name?.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query) ||
        service.slug?.toLowerCase().includes(query)
    );
  }, [services, searchQuery]);

  // ==========================================
  // MODAL HANDLERS
  // ==========================================

  const openAddModal = () => {
    setSelectedService(null);
    setFormOpen(true);
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setFormOpen(true);
  };

  const handleFormSuccess = (savedService) => {
    setServices((currentServices) => {
      const exists = currentServices.some((service) => service.id === savedService.id);
      if (exists) {
        return currentServices.map((service) =>
          service.id === savedService.id ? savedService : service
        );
      }
      return [savedService, ...currentServices];
    });
  };

  const confirmDelete = (service) => {
    setServiceToDelete(service);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not authenticated.");
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/services/${serviceToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete service");
      }

      setServices((currentServices) =>
        currentServices.filter((service) => service.id !== serviceToDelete.id)
      );

      setDeleteModalOpen(false);
      setServiceToDelete(null);
    } catch (err) {
      console.error("DELETE SERVICE ERROR:", err);
      setError(err.message || "Failed to delete service.");
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================
  // HELPERS
  // ==========================================

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "DRAFT":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // ==========================================
  // RENDER
  // ==========================================

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Loading services...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-gray-50/30 min-h-screen">
      
      {/* HEADER */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Services</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage the services offered to your clients on the public website.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-all hover:shadow-md active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Add Service
          </button>
        </div>
      </div>

      {/* ERROR BANNER */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-3 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button onClick={() => setError("")} className="text-red-500 hover:text-red-700 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH BAR */}
      <div className="mb-6 max-w-md">
        <div className="relative group">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all sm:text-sm shadow-sm"
            placeholder="Search services by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {filteredServices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Service Details</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date Created</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <motion.tbody 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="divide-y divide-gray-100 bg-white"
              >
                {filteredServices.map((service) => (
                  <motion.tr variants={rowVariants} key={service.id} className="transition-colors hover:bg-gray-50/80 group">
                    
                    {/* DETAILS */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
                          {service.image ? (
                            <img
                              src={getImageUrl(service.image)}
                              alt={service.name}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => { e.currentTarget.style.display = "none"; }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                              <LayoutTemplate className="h-6 w-6 opacity-50" />
                            </div>
                          )}
                        </div>
                        <div className="max-w-sm">
                          <div className="text-sm font-semibold text-gray-900">{service.name}</div>
                          <div className="mt-1 truncate text-xs text-gray-500" title={service.description || ""}>
                            {service.description || "No description provided."}
                          </div>
                          <div className="mt-1 text-xs text-indigo-500 font-medium">/{service.slug}</div>
                        </div>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadge(service.status)}`}>
                        {service.status === "ACTIVE" ? "Active" : service.status === "DRAFT" ? "Draft" : service.status}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 font-medium">
                      {formatDate(service.createdAt)}
                    </td>

                    {/* ACTIONS */}
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          type="button"
                          onClick={() => console.log("View service:", service)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(service)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDelete(service)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <LayoutTemplate className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No services found</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              {searchQuery
                ? "We couldn't find any services matching your search term. Try a different keyword."
                : "Get started by creating a new service offering to display on your website."}
            </p>
            {!searchQuery && (
              <button
                type="button"
                onClick={openAddModal}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-all active:scale-95"
              >
                <Plus className="h-4 w-4" />
                New Service
              </button>
            )}
          </div>
        )}

        {/* RESULTS COUNT */}
        {filteredServices.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{filteredServices.length}</span> of <span className="font-semibold text-gray-900">{services.length}</span> services
            </p>
          </div>
        )}
      </div>

      {/* SERVICE FORM MODAL */}
      <ServiceForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedService(null);
        }}
        onSuccess={handleFormSuccess}
        service={selectedService}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteModalOpen && serviceToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
              onClick={() => {
                if (!deleting) {
                  setDeleteModalOpen(false);
                  setServiceToDelete(null);
                }
              }}
            />
            
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="pt-1">
                  <h3 className="text-lg font-semibold text-gray-900">Delete Service</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    Are you sure you want to delete <span className="font-semibold text-gray-900">"{serviceToDelete.name}"</span>? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setServiceToDelete(null);
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDelete}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 transition-colors disabled:opacity-50 sm:w-auto min-w-[120px]"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Service"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}