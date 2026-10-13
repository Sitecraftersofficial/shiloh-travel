import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { Header, Footer } from "./components/SiteChrome";
import Home from "./routes/index";
import Services from "./routes/services";
import CarRental from "./routes/car-rental";
import Contact from "./routes/contact";
import Staff from "./routes/staff";
import NotFound from "./routes/NotFound";

function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
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
          <Route path="/car-rental" element={<CarRental />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
