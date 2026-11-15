import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BACKEND_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

export default function TrustedCompanies() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch(`${API_URL}/partners/public`);
        if (!response.ok) {
          throw new Error("Failed to fetch partners");
        }
        const data = await response.json();
        setPartners(data.partners || []);
      } catch (error) {
        console.error("FETCH PARTNERS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading || partners.length === 0) {
    return null;
  }

  const getLogoUrl = (logoPath) => {
    if (!logoPath) return "";
    if (logoPath.startsWith("http://") || logoPath.startsWith("https://")) {
      return logoPath;
    }
    return `${BACKEND_URL}${logoPath.startsWith("/") ? "" : "/"}${logoPath}`;
  };

  return (
    <section className="w-full py-16 bg-muted/20 border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <p className="text-xs font-medium text-muted-foreground tracking-tight">
          Trusted by leading industrial enterprises and grid operators
        </p>
      </div>

      <div className="relative overflow-hidden w-full">
        {/* Soft edge masking */}
        <div className="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none" />

        <div className="flex w-max animate-marquee gap-14 items-center">
          {[...partners, ...partners].map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex h-16 w-40 shrink-0 items-center justify-center px-4"
            >
              <img
                src={getLogoUrl(partner.logo)}
                alt={partner.name}
                className="max-h-10 max-w-full object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-200"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
