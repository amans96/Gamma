import "./index.css";

import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from "./App.jsx";

// Public pages
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Products from "./pages/Products.jsx";
import Project from "./pages/Projects.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import WhyChooseUsDetail from "./comp/WhyChooseUsDetail.jsx";

// Auth
import Login from "./pages/Login.jsx";

// Admin
import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminLayout from "./comp/admin/AdminLayout.jsx";
import Product from "./pages/admin/Product.jsx";
import ProductForm from "./pages/admin/ProductForm.jsx";
import Services from "./pages/admin/Services.jsx";
import Blog from "./pages/admin/Blog.jsx";
import Partners from "./pages/admin/Partners.jsx";

import ProtectedRoute from "./comp/ProtectedRoute.jsx";

// React Query
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter([
  // =====================================
  // PUBLIC WEBSITE
  // =====================================
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: "about",
        element: <About />,
      },

      {
        path: "contact",
        element: <Contact />,
      },

      {
        path: "products",
        element: <Products />,
      },

      {
        path: "projects",
        element: <Project />,
      },

      {
        path: "services",
        element: <ServicesPage />,
      },

      {
        path: "login",
        element: <Login />,
      },

      {
        path: "blog",
        element: <BlogPage />,
      },

      {
        path: "why-choose-us/:slug",
        element: <WhyChooseUsDetail />,
      },
    ],
  },

  // =====================================
  // ADMIN
  // =====================================
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },

          {
            path: "products",
            element: <Product />,
          },

          {
            path: "products/new",
            element: <ProductForm />,
          },

          {
            path: "products/:id/edit",
            element: <ProductForm />,
          },

          {
            path: "services",
            element: <Services />,
          },

          {
            path: "blog",
            element: <Blog />,
          },

          {
            path: "partners",
            element: <Partners />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);