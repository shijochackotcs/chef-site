import DishCard from "../components/DishCard.jsx";

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
      <section className="hero">
        <div className="hero-inner">
          <h1>Welcome to chefjocateringevents</h1>
          <p>Discover curated dishes and fine flavors.</p>
          <a className="btn" href="/dishes">
            Explore Dishes
          </a>
        </div>
      </section>

      <section className="container" style={{ marginTop: "1.5rem" }}>
        <h2>Book a Catering Event</h2>
        <EventBookingForm />
      </section>

      <section>
        <h2>Featured Dishes</h2>
        <div className="grid">
          {display.map((d, i) => (
            <DishCard key={d.id ? d.id : i} dish={d} />
          ))}
        </div>
      </section>
    </>
  );
}

import { useState } from "react";
import { sendEventEmail } from "../utils/email.js";

function EventBookingForm() {
  const [details, setDetails] = useState("");
  const [persons, setPersons] = useState("");
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [menu, setMenu] = useState("");
  const [info, setInfo] = useState("");
  const [status, setStatus] = useState("");

  function saveToLocal(data) {
    const KEY = "chefsite_event_requests_v1";
    try {
      const raw = localStorage.getItem(KEY);
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(data);
      localStorage.setItem(KEY, JSON.stringify(arr));
    } catch {}
  }

  async function onSubmit(e) {
    e.preventDefault();
    const count = parseInt(String(persons), 10) || 0;
    if (!details.trim()) {
      alert("Please provide event details");
      return;
    }
    if (!(count > 0)) {
      alert("Please provide a valid number of persons");
      return;
    }
    if (!date) {
      alert("Please choose an event date");
      return;
    }
    if (!phone.trim()) {
      alert("Please provide a contact phone");
      return;
    }

    const request = {
      id: crypto.randomUUID(),
      eventDetails: details.trim(),
      persons: count,
      eventDate: date,
      contactEmail: email.trim() || undefined,
      contactPhone: phone.trim(),
      menuPreferences: menu.trim() || undefined,
      additionalInfo: info.trim() || undefined,
      submittedAt: new Date().toISOString(),
      source: "home",
      userAgent: navigator.userAgent,
      referrer: document.referrer || undefined,
    };

    saveToLocal(request);
    setStatus("Saved. Sending email...");
    try {
      await sendEventEmail(request);
      setStatus("Request sent to admin.");
      setDetails("");
      setPersons("");
      setDate("");
      setEmail("");
      setPhone("");
      setMenu("");
      setInfo("");
    } catch (err) {
      setStatus("Saved locally. Email not configured.");
    }
  }

  return (
    <form className="review-form" onSubmit={onSubmit}>
      <label>
        Event Details
        <textarea rows={3} value={details} onChange={(e) => setDetails(e.target.value)} />
      </label>
      <label>
        Number of Persons
        <input type="number" min="1" value={persons} onChange={(e) => setPersons(e.target.value)} />
      </label>
      <label>
        Event Date
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <label>
        Contact Email (optional)
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Contact Phone
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </label>
      <label>
        Menu Preferences (optional)
        <textarea rows={3} value={menu} onChange={(e) => setMenu(e.target.value)} />
      </label>
      <label>
        Additional Information (optional)
        <textarea rows={3} value={info} onChange={(e) => setInfo(e.target.value)} />
      </label>
      <button className="btn" type="submit">Request Quote</button>
      {status && <span className="muted" style={{ marginLeft: ".5rem" }}>{status}</span>}
      <p className="muted" style={{ marginTop: ".25rem" }}>
        The more information you provide, the easier it will be for the caterer to give a good quote.
      </p>
    </form>
  );
}
