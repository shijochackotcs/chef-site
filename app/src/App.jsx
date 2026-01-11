import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect, useState } from "react";
import { computeTheme, nextBoundaryMs } from "./theme.js";
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
import BookEvent from "./pages/BookEvent.jsx";
import Favorites from "./pages/Favorites.jsx";

export default function App() {
  const ADMIN_ENABLED = import.meta.env.VITE_ADMIN_ENABLED === "true";
  const [theme, setTheme] = useState(computeTheme());
  useEffect(() => {
    let timer = null;
    function schedule() {
      const ms = nextBoundaryMs();
      timer = setTimeout(() => {
        setTheme(computeTheme());
        schedule();
      }, ms);
    }
    schedule();
    return () => timer && clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dishes" element={<Dishes />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book-event" element={<BookEvent />} />
            <Route path="/about" element={<About />} />
            <Route path="/owner-setup" element={<OwnerSetup />} />
            {ADMIN_ENABLED && <Route path="/admin" element={<Admin />} />}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
