import { useEffect } from "react";
import { Route, Routes, useLocation, useSearchParams } from "react-router-dom";

import { Header, Footer } from "./components/SiteChrome";
import Home from "./routes/index";
import Services from "./routes/services";
import CarRental from "./routes/car-rental";
import VehicleDetail from "./routes/vehicle-detail";
import Contact from "./routes/contact";
import Staff from "./routes/staff";
import NotFound from "./routes/NotFound";

function CarRentalRoute() {
  const [searchParams] = useSearchParams();
  return searchParams.has("vehicle") ? <VehicleDetail /> : <CarRental />;
}

function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, search, hash]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/car-rental" element={<CarRentalRoute />} />
          <Route path="/car-rental/:vehicleId" element={<VehicleDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
