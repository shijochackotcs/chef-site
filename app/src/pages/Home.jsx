import DishCard from "../components/DishCard.jsx";
import { Link } from "react-router-dom";

const featuredSeeds = [
  {
    name: "Signature Pasta",
    description: "Handmade pasta in creamy sauce",
    price: 14.5,
    image:
      "https://images.unsplash.com/photo-1604908177078-6a15f54a1f3c?ixlib=rb-4.0.3&q=80&w=1080&auto=format&fit=crop",
  },
  {
    name: "Grilled Salmon",
    description: "Citrus glaze with herbs",
    price: 18.0,
    image:
      "https://images.unsplash.com/photo-1542736667-069246bdbc74?ixlib=rb-4.0.3&q=80&w=1080&auto=format&fit=crop",
  },
  {
    name: "Garden Salad",
    description: "Fresh greens, vinaigrette",
    price: 9.0,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&q=80&w=1080&auto=format&fit=crop",
  },
];

export default function Home() {
  const FEATURED_KEY = "chefsite_featured_v1";
  const DISHES_KEY = "chefsite_dishes_v1";
  let featuredIds = [];
  let dishes = [];
  try {
    const rawF = localStorage.getItem(FEATURED_KEY);
    if (rawF) featuredIds = JSON.parse(rawF);
    const rawD = localStorage.getItem(DISHES_KEY);
    if (rawD) dishes = JSON.parse(rawD);
  } catch {}

  const selectedFromIds = featuredIds
    .map((id) => dishes.find((d) => d.id === id && d.type === "image"))
    .filter(Boolean);
  const selectedFlagged = dishes.filter(
    (d) => d.type === "image" && d.featured
  );
  const selected = [...selectedFlagged, ...selectedFromIds];
  const distinct = [];
  const seen = new Set();
  for (const d of selected) {
    const k = d.id || d.name;
    if (!seen.has(k)) {
      seen.add(k);
      distinct.push(d);
    }
  }
  // Fallback: pull from all image dishes (admin + seeds), excluding placeholders
  const allImagePool = [
    ...dishes.filter((d) => d.type === "image"),
    ...featuredSeeds
      .filter((s) => s.image && !s.image.startsWith("/"))
      .map((s) => ({ ...s, id: `seed-${s.name}` })),
  ];
  const fillers = [];
  for (const item of allImagePool) {
    const key = item.id || item.name;
    if (fillers.length >= 3) break;
    if (!seen.has(key)) {
      seen.add(key);
      fillers.push(item);
    }
  }
  const display = [...distinct, ...fillers].slice(0, 3);
  return (
    <>
      <section
        className="hero"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(17,24,39,0.65), rgba(11,18,34,0.65) 60%, rgba(31,41,55,0.65)), url(https://cdn.pixabay.com/photo/2016/10/26/18/57/appetizer-1776723_1280.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-inner">
          <h1>Welcome to chefjocateringevents</h1>
          <p>Discover curated dishes and fine flavors.</p>
          <a className="btn" href="/dishes">
            Explore Dishes
          </a>
        </div>
      </section>

      

      <section>
        <h2>Featured Dishes</h2>
        <div className="grid">
          {display.map((d, i) => (
            <DishCard key={d.id ? d.id : i} dish={d} />
          ))}
        </div>
      </section>

      <section className="container" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link to="/book-event" className="card" aria-label="Book a Catering Event" style={{ maxWidth: "280px" }}>
            <div className="card-body">
              <h3 style={{ marginTop: 0 }}>Book a Catering Event</h3>
              <p className="muted">Request a quote for your event.</p>
              <span className="btn-circle" style={{ display: "inline-flex", marginTop: ".5rem", width: "72px", height: "72px", fontSize: ".8rem" }}>Book Now</span>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
