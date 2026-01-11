export default function About() {
  const defaults = {
    bio: "I am a chef specialized in seasonal cuisine, blending classic techniques with modern flavors. My philosophy is simple: source locally, cook honestly, and let ingredients shine.",
    specialties: [
      "Farm-to-table seasonal menus",
      "Seafood and citrus pairings",
      "Handmade pasta and artisan breads",
      "Plant-forward fine dining",
    ],
    experience:
      "Trained at leading culinary institutes and kitchens across Europe and North America. Recipient of multiple regional awards and featured in food publications.",
  };

  let saved = {};
  try {
    const raw = localStorage.getItem("chefsite_about_v1");
    if (raw) saved = JSON.parse(raw);
  } catch {}

  const bio = saved.bio || defaults.bio;
  const specialties = Array.isArray(saved.specialties)
    ? saved.specialties
    : defaults.specialties;
  const experience = saved.experience || defaults.experience;

  return (
    <section>
      <h2>About the Chef</h2>
      <div className="about-grid">
        <div>
          <p className="muted">{bio}</p>
          <h3>Specialties</h3>
          <ul className="list">
            {specialties.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
          <h3>Experience</h3>
          <p>{experience}</p>
        </div>
        <div>
          <img
            className="about-photo"
            src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1080&auto=format&fit=crop"
            alt="Chef at work"
          />
          <div className="badges">
            <span className="badge">10+ Years</span>
            <span className="badge">Seasonal Cuisine</span>
            <span className="badge">Award-Winning</span>
          </div>
        </div>
      </div>
    </section>
  );
}
