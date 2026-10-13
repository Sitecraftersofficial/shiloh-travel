import { Route, Routes } from "react-router-dom";

import { Header, Footer } from "./components/SiteChrome";
import Home from "./routes/index";
import Services from "./routes/services";
import CarRental from "./routes/car-rental";
import Contact from "./routes/contact";
import Staff from "./routes/staff";
import NotFound from "./routes/NotFound";

export default function App() {
  return (
    <>
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
