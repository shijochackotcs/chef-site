export async function sendEventEmail(request) {
  const contactRaw = localStorage.getItem("chefsite_contact_v1");
  let adminEmail = "";
  try {
    const obj = contactRaw ? JSON.parse(contactRaw) : {};
    adminEmail = obj.email || "";
  } catch {}
  const envAdmin = import.meta.env.VITE_ADMIN_EMAIL || "";
  const to = envAdmin || adminEmail || "hello@chefsite.example";
  const endpoint = import.meta.env.VITE_EVENT_EMAIL_ENDPOINT || "";

  const subject = `New Catering Event Request (${request.persons} people)`;
  const bodyLines = [
    `Event Details: ${request.eventDetails}`,
    `Number of Persons: ${request.persons}`,
    `Event Date: ${request.eventDate}`,
    `Contact Email: ${request.contactEmail || "(not provided)"}`,
    `Contact Phone: ${request.contactPhone}`,
    `Menu Preferences: ${request.menuPreferences || "(not provided)"}`,
    `Additional Info: ${request.additionalInfo || "(not provided)"}`,
    `Submitted At: ${request.submittedAt}`,
    `Source: ${request.source}`,
  ];
  const body = bodyLines.join("\n");

  if (endpoint) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, body, request }),
    });
    if (!res.ok) throw new Error(`Email endpoint failed: ${res.status}`);
    return true;
  }

  if (to) {
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    return true;
  }

  throw new Error("No admin email configured");
}
