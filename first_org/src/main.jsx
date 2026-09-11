
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
import ProductForm from "./pages/admin/ProductForm.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
// Auth
import Login from "./pages/Login.jsx";

// Admin
import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminLayout from "./comp/admin/AdminLayout.jsx";
import Product from "./pages/admin/Product.jsx";
import Services from "./pages/admin/Services.jsx";
import Blog from "./pages/admin/Blog.jsx";
import Partners from "./pages/admin/Partners.jsx";


import ProtectedRoute from "./comp/ProtectedRoute.jsx";


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
        path: "services/installation",
        element: <ServicesPage />,
      },

      {
        path: "services/maintenance",
        element: <ServicesPage />,
      },

      {
        path: "services/repair",
        element: <ServicesPage />,
      },

      {
        path: "services/consulting",
        element: <ServicesPage />,
      },

      {
        path: "login",
        element: <Login />,
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
  <RouterProvider router={router} />
);
