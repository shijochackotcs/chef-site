import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Dishes from "./pages/Dishes.jsx";
import Reviews from "./pages/Reviews.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import Admin from "./pages/Admin.jsx";
import NotFound from "./pages/NotFound.jsx";
import OwnerSetup from "./pages/OwnerSetup.jsx";

export default function App() {
  const ADMIN_ENABLED = import.meta.env.VITE_ADMIN_ENABLED === "true";
  return (
    <div className="app">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dishes" element={<Dishes />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/owner-setup" element={<OwnerSetup />} />
          {ADMIN_ENABLED && <Route path="/admin" element={<Admin />} />}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
