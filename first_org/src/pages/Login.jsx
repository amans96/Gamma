import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import logo from "../assets/image.png";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user?.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-sm space-y-6">
        {/* Back Link */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to website</span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-6">
          <div className="space-y-2 text-center">
            <div className="w-10 h-10 rounded-xl border border-border bg-muted/60 flex items-center justify-center p-1.5 mx-auto">
              <img src={logo} alt="Gamma logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl font-normal tracking-tight text-foreground">
              Admin authentication
            </h1>
            <p className="text-xs text-muted-foreground">
              Sign in to manage products, services, and content.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50/70 p-3 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-medium text-foreground block">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@gammasolutions.com"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-border bg-muted/30 py-2 px-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-foreground focus:bg-card transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="login-password" className="text-xs font-medium text-foreground block">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-border bg-muted/30 py-2 px-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-foreground focus:bg-card transition-colors"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Sign in</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Protected management console. Authorized personnel only.
        </p>
      </div>
    </div>
  );
}
