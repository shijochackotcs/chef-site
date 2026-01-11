import { useState } from "react";
import { sendEventEmail } from "../utils/email.js";

export default function BookEvent() {
  return (
    <section>
      <h2>Book a Catering Event</h2>
      <p className="muted">Provide as much detail as possible for an accurate quote.</p>
      <EventBookingForm />
    </section>
  );
}

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
      source: "book-event",
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
