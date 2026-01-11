import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const ADMIN_ENABLED = import.meta.env.VITE_ADMIN_ENABLED === "true";
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="logo">
          chefjocateringevents
        </Link>
        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          ☰
        </button>
        <div
          className={`nav-links ${open ? "open" : ""}`}
          onClick={() => setOpen(false)}
        >
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/dishes">Dishes</NavLink>
          <NavLink to="/favorites">Favorites</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/reviews">Reviews</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {ADMIN_ENABLED && <NavLink to="/admin">Admin</NavLink>}
        </div>
      </div>
    </nav>
  );
}
