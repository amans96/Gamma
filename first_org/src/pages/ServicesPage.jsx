import Services from "../comp/Services.jsx";
import Footertemp from "../comp/Footertemp.jsx";

export default function ServicesPage() {
  return (
    <div className="w-full bg-background min-h-screen flex flex-col justify-between">
      <main className="flex-1">
        <Services />
      </main>
      <Footertemp />
    </div>
  );
}
