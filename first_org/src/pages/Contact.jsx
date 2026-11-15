import ContactHero from "../comp/ContactHero.jsx";
import ContactForm from "../comp/ContactForm.jsx";
import ContactInfo from "../comp/ContactInfo.jsx";
import Map from "../comp/Map.jsx";
import Footertemp from "../comp/Footertemp.jsx";
import contactImg from "../assets/image.jpeg";

export default function Contact() {
  return (
    <div className="w-full bg-background min-h-screen flex flex-col justify-between">
      <main className="w-full">
        <ContactHero
          image={contactImg}
          title="Contact Gamma engineering"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-12">
          {/* Form & Map Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-xl border border-border bg-card p-5 space-y-1">
                <h3 className="text-sm font-medium text-foreground tracking-tight">
                  Facility location
                </h3>
                <p className="text-xs text-muted-foreground">
                  Our main engineering works and testing laboratory in Addis Ababa.
                </p>
              </div>
              <Map />
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="pt-6 border-t border-border">
            <ContactInfo />
          </div>
        </div>
      </main>

      <Footertemp />
    </div>
  );
}
