import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

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

  if (loading) {
    return null;
  }

  if (partners.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white overflow-hidden">

      <div className="max-w-7xl mx-auto text-center mb-14">

        <p className="uppercase tracking-[6px] text-orange-500 font-semibold">
          Trusted By
        </p>

        <h2 className="text-4xl font-bold mt-4">
          Leading Companies & Partners
        </h2>

      </div>

      <div className="relative overflow-hidden">

        {/* Left Fade */}
        <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-white to-transparent"></div>

        {/* Right Fade */}
        <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-white to-transparent"></div>

        <div className="flex w-max animate-marquee gap-20">

          {[...partners, ...partners].map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex h-28 w-52 shrink-0 items-center justify-center"
            >
            <img 
  src={`http://localhost:5000${partner.logo}`}
                alt={partner.name}
                className="max-h-20 max-w-full object-contain grayscale opacity-70 transition duration-300 hover:grayscale-0 hover:opacity-100"
              />
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}