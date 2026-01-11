import { useEffect, useMemo, useState } from "react";

function PasswordGate({ onAuthed }) {
  const [pwd, setPwd] = useState("");
  const savedPwd = localStorage.getItem("chefsite_admin_password") || "";
  const envPwd = import.meta.env.VITE_ADMIN_PASSWORD || "";
  const expected = savedPwd || envPwd;
  const hasExpected = expected.length > 0;

  function submit(e) {
    e.preventDefault();
    if (!hasExpected) {
      alert("Admin password not set. Use setup to create one.");
      return;
    }
    if (pwd === expected) {
      localStorage.setItem("chefsite_admin_authed", "true");
      onAuthed(true);
    } else {
      alert("Incorrect password");
    }
  }

  if (!hasExpected) {
    return <InitialPasswordSetup onAuthed={onAuthed} />;
  }

  return (
    <form className="review-form" onSubmit={submit}>
      <label>
        Admin Password
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          required
        />
      </label>
      <button className="btn" type="submit">
        Enter
      </button>
      <p className="muted">
        Note: Client-side password is not secure; use real auth for production.
      </p>
    </form>
  );
}

function InitialPasswordSetup({ onAuthed }) {
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  function submit(e) {
    e.preventDefault();
    const p = newPwd.trim();
    if (p.length < 4) {
      alert("Choose a longer password (min 4 chars)");
      return;
    }
    if (p !== confirmPwd.trim()) {
      alert("Passwords do not match");
      return;
    }
    localStorage.setItem("chefsite_admin_password", p);
    localStorage.setItem("chefsite_admin_authed", "true");
    onAuthed(true);
  }

  return (
    <form className="review-form" onSubmit={submit}>
      <label>
        Set Admin Password
        <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} required />
      </label>
      <label>
        Confirm Password
        <input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} required />
      </label>
      <button className="btn" type="submit">Save & Enter</button>
      <p className="muted">No .env found; saving password to this browser. For shared control, use a backend or host-managed config.</p>
    </form>
  );
}

function UploadPanel({ type = "image" }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [folder, setFolder] = useState("chefsite");
  const [status, setStatus] = useState("");
  const [result, setResult] = useState(null);
  const uploadTarget = import.meta.env.VITE_UPLOAD_TARGET || "local";

  const accept = useMemo(
    () => (type === "image" ? "image/*" : "video/mp4,video/webm"),
    [type]
  );
  const resourceType = type === "image" ? "image" : "video";

  function onFile(e) {
    setFile(e.target.files?.[0] || null);
    setResult(null);
  }

  async function upload() {
    if (!file) return alert("Choose a file first");
    setStatus("Uploading...");
    try {
      if (uploadTarget === "cloudinary") {
        const data = await uploadToCloudinary({
          file,
          resourceType,
          folder,
          tags: title ? [title] : [],
        });
        setResult({ url: data.secure_url, public_id: data.public_id });
      } else {
        const form = new FormData();
        form.append("file", file);
        const endpoint =
          resourceType === "image" ? "/api/upload/image" : "/api/upload/video";
        const res = await fetch(endpoint, { method: "POST", body: form });
        if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
        const data = await res.json();
        setResult(data);
      }
      setStatus("Upload complete");
    } catch (err) {
      console.error(err);
      setStatus(String(err.message || err));
    }
  }

  return (
    <div className="upload-panel">
      <h3>Upload {type === "image" ? "Image" : "Video"}</h3>
      <label>
        Title (optional)
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label>
        Description (optional)
        <input value={desc} onChange={(e) => setDesc(e.target.value)} />
      </label>
      <label>
        Folder (Cloudinary)
        <input value={folder} onChange={(e) => setFolder(e.target.value)} />
      </label>
      <label>
        File
        <input type="file" accept={accept} onChange={onFile} />
      </label>

      {file && (
        <div style={{ marginTop: ".5rem" }}>
          {type === "image" ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              style={{
                maxWidth: "100%",
                border: "1px solid #334155",
                borderRadius: ".5rem",
              }}
            />
          ) : (
            <video
              src={URL.createObjectURL(file)}
              controls
              style={{ maxWidth: "100%" }}
            />
          )}
        </div>
      )}

      <button className="btn" type="button" onClick={upload}>
        Upload
      </button>
      {status && (
        <p className="muted" style={{ marginTop: ".25rem" }}>
          {status}
        </p>
      )}

      {result && (
        <div className="review" style={{ marginTop: ".75rem" }}>
          <p>
            <strong>URL:</strong>{" "}
            <a href={result.url} target="_blank" rel="noreferrer">
              {result.url}
            </a>
          </p>
          {result.public_id && (
            <p>
              <strong>ID:</strong> {result.public_id}
            </p>
          )}
          {result.filename && (
            <p>
              <strong>Filename:</strong> {result.filename}
            </p>
          )}
          {result.size && (
            <p>
              <strong>Size:</strong> {result.size} bytes
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function saveDishToLocal(dish) {
  const KEY = "chefsite_dishes_v1";
  const raw = localStorage.getItem(KEY);
  const arr = raw ? JSON.parse(raw) : [];
  arr.unshift({
    ...dish,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    source: "admin",
  });
  localStorage.setItem(KEY, JSON.stringify(arr));
}

function ImageDishForm() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");

  async function addDish(e) {
    e.preventDefault();
    if (!file) return alert("Choose an image");
    setStatus("Processing image...");
    const reader = new FileReader();
    reader.onload = () => {
      const imageDataUrl = reader.result;
      saveDishToLocal({
        type: "image",
        name: name || "Untitled Dish",
        description,
        price: parseFloat(price) || undefined,
        imageDataUrl,
      });
      setStatus("Added");
      setFile(null);
      setName("");
      setDescription("");
      setPrice("");
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="upload-panel">
      <h3>Add Dish (Image)</h3>
      <form className="review-form" onSubmit={addDish}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Description
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Price
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        <label>
          Image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
        <button className="btn" type="submit">
          Add Dish
        </button>
        {status && <p className="muted">{status}</p>}
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            style={{
              maxWidth: "100%",
              marginTop: ".5rem",
              border: "1px solid #334155",
              borderRadius: ".5rem",
            }}
          />
        )}
      </form>
    </div>
  );
}

function YoutubeDishForm() {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  function addDish(e) {
    e.preventDefault();
    const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
    const id = m ? m[1] : "";
    if (!id) return alert("Provide a valid YouTube URL or video ID");
    saveDishToLocal({
      type: "youtube",
      name: name || "Featured Video",
      description,
      youtubeId: id,
    });
    setStatus("Added");
    setUrl("");
    setName("");
    setDescription("");
  }

  return (
    <div className="upload-panel">
      <h3>Add Dish (YouTube Video)</h3>
      <form className="review-form" onSubmit={addDish}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Description
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          YouTube URL or ID
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtu.be/... or video ID"
          />
        </label>
        <button className="btn" type="submit">
          Add Video
        </button>
        {status && <p className="muted">{status}</p>}
      </form>
    </div>
  );
}

function ContactInfoForm() {
  const KEY = "chefsite_contact_v1";
  const [email, setEmail] = useState("hello@chefsite.example");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [address, setAddress] = useState("123 Flavor St, Food City");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj.email) setEmail(obj.email);
        if (obj.phone) setPhone(obj.phone);
        if (obj.address) setAddress(obj.address);
      }
    } catch {}
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    const data = {
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
    };
    localStorage.setItem(KEY, JSON.stringify(data));
    setSaved("Saved");
    setTimeout(() => setSaved(""), 1500);
  }

  return (
    <section style={{ marginTop: "1.5rem" }}>
      <h2>Contact Info</h2>
      <form className="review-form" onSubmit={onSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Phone
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label>
          Address
          <input value={address} onChange={(e) => setAddress(e.target.value)} />
        </label>
        <button className="btn" type="submit">
          Save
        </button>
        {saved && (
          <span className="muted" style={{ marginLeft: ".5rem" }}>
            {saved}
          </span>
        )}
      </form>
    </section>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("chefsite_admin_authed") === "true")
      setAuthed(true);
  }, []);

  if (!authed)
    return (
      <section>
        <h2>Admin</h2>
        <PasswordGate onAuthed={setAuthed} />
      </section>
    );

  return (
    <section>
      <h2>Admin: Add Dishes</h2>
      <p className="muted">
        These items are saved to your browser (localStorage). For shared,
        persistent content, integrate a backend or storage later.
      </p>
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <ImageDishForm />
        <YoutubeDishForm />
      </div>
      <AboutInfoForm />
      <ContactInfoForm />
      <FeaturedImageForm />
      <FeaturedManager />
      <AdminSettings />
    </section>
  );
}

function AboutInfoForm() {
  const KEY = "chefsite_about_v1";
  const [bio, setBio] = useState(
    "I am a chef specialized in seasonal cuisine, blending classic techniques with modern flavors. My philosophy is simple: source locally, cook honestly, and let ingredients shine."
  );
  const [specialties, setSpecialties] = useState(
    [
      "Farm-to-table seasonal menus",
      "Seafood and citrus pairings",
      "Handmade pasta and artisan breads",
      "Plant-forward fine dining",
    ].join("\n")
  );
  const [experience, setExperience] = useState(
    "Trained at leading culinary institutes and kitchens across Europe and North America. Recipient of multiple regional awards and featured in food publications."
  );
  const [saved, setSaved] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj.bio) setBio(obj.bio);
        if (Array.isArray(obj.specialties))
          setSpecialties(obj.specialties.join("\n"));
        if (obj.experience) setExperience(obj.experience);
      }
    } catch {}
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    const data = {
      bio: bio.trim(),
      specialties: specialties
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean),
      experience: experience.trim(),
    };
    localStorage.setItem(KEY, JSON.stringify(data));
    setSaved("Saved");
    setTimeout(() => setSaved(""), 1500);
  }

  return (
    <section style={{ marginTop: "1.5rem" }}>
      <h2>About Content</h2>
      <form className="review-form" onSubmit={onSubmit}>
        <label>
          About the Chef (bio)
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </label>
        <label>
          Specialties (one per line)
          <textarea
            rows={4}
            value={specialties}
            onChange={(e) => setSpecialties(e.target.value)}
          />
        </label>
        <label>
          Experience
          <textarea
            rows={4}
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </label>
        <button className="btn" type="submit">
          Save
        </button>
        {saved && (
          <span className="muted" style={{ marginLeft: ".5rem" }}>
            {saved}
          </span>
        )}
      </form>
    </section>
  );
}

function AdminSettings() {
  const [current, setCurrent] = useState("");
  const [nextPwd, setNextPwd] = useState("");
  const savedPwd = localStorage.getItem("chefsite_admin_password") || "";
  const envPwd = import.meta.env.VITE_ADMIN_PASSWORD || "";
  const expected = savedPwd || envPwd;
  const [msg, setMsg] = useState("");

  function change(e) {
    e.preventDefault();
    if (!expected) {
      setMsg("No existing password. Use the setup above.");
      return;
    }
    if (current !== expected) {
      setMsg("Current password is incorrect.");
      return;
    }
    const p = nextPwd.trim();
    if (p.length < 4) {
      setMsg("Choose a longer password (min 4 chars)");
      return;
    }
    localStorage.setItem("chefsite_admin_password", p);
    setMsg("Password updated for this browser.");
    setCurrent("");
    setNextPwd("");
  }

  function clearOverride() {
    localStorage.removeItem("chefsite_admin_password");
    setMsg("Local override cleared. Env password (if any) will be used.");
  }

  return (
    <section style={{ marginTop: "1.5rem" }}>
      <h2>Admin Settings</h2>
      <form className="review-form" onSubmit={change}>
        <label>
          Current Password
          <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
        </label>
        <label>
          New Password
          <input type="password" value={nextPwd} onChange={(e) => setNextPwd(e.target.value)} required />
        </label>
        <button className="btn" type="submit">Update Password</button>
        {msg && <span className="muted" style={{ marginLeft: ".5rem" }}>{msg}</span>}
      </form>
      <button className="btn" type="button" onClick={clearOverride} style={{ marginTop: ".5rem" }}>Clear Local Override</button>
      <p className="muted">Client-side passwords are not secure; prefer real auth for production.</p>
    </section>
  );
}

function FeaturedImageForm() {
  const DISHES_KEY = "chefsite_dishes_v1";
  const FEATURED_KEY = "chefsite_featured_v1";
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");

  function saveFeaturedDish(e) {
    e.preventDefault();
    if (!file) return alert("Choose an image");
    setStatus("Processing image...");
    const reader = new FileReader();
    reader.onload = () => {
      const imageDataUrl = reader.result;
      // Load existing dishes
      const rawD = localStorage.getItem(DISHES_KEY);
      const dishes = rawD ? JSON.parse(rawD) : [];
      const id = crypto.randomUUID();
      const dish = {
        id,
        type: "image",
        name: name || "Featured Dish",
        description,
        price: parseFloat(price) || undefined,
        imageDataUrl,
        featured: true,
        createdAt: new Date().toISOString(),
        source: "admin",
      };
      dishes.unshift(dish);
      localStorage.setItem(DISHES_KEY, JSON.stringify(dishes));
      // Update featured IDs
      const rawF = localStorage.getItem(FEATURED_KEY);
      const featuredIds = rawF ? JSON.parse(rawF) : [];
      if (!featuredIds.includes(id)) featuredIds.unshift(id);
      localStorage.setItem(FEATURED_KEY, JSON.stringify(featuredIds));
      setStatus("Added to Featured");
      setFile(null);
      setName("");
      setDescription("");
      setPrice("");
    };
    reader.readAsDataURL(file);
  }

  return (
    <section style={{ marginTop: "1.5rem" }}>
      <h2>Upload Featured Dish (Image)</h2>
      <form className="review-form" onSubmit={saveFeaturedDish}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Description
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Price
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        <label>
          Image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
        <button className="btn" type="submit">
          Add Featured
        </button>
        {status && (
          <span className="muted" style={{ marginLeft: ".5rem" }}>
            {status}
          </span>
        )}
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            style={{
              maxWidth: "100%",
              marginTop: ".5rem",
              border: "1px solid #334155",
              borderRadius: ".5rem",
            }}
          />
        )}
      </form>
    </section>
  );
}

function FeaturedManager() {
  const DISHES_KEY = "chefsite_dishes_v1";
  const FEATURED_KEY = "chefsite_featured_v1";
  const [dishes, setDishes] = useState([]);
  const [selected, setSelected] = useState([]);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    try {
      const rawD = localStorage.getItem(DISHES_KEY);
      if (rawD) setDishes(JSON.parse(rawD));
      const rawF = localStorage.getItem(FEATURED_KEY);
      if (rawF) setSelected(JSON.parse(rawF));
    } catch {}
  }, []);

  function toggle(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function save() {
    localStorage.setItem(FEATURED_KEY, JSON.stringify(selected));
    setSaved("Saved");
    setTimeout(() => setSaved(""), 1500);
  }

  const imageDishes = dishes.filter((d) => d.type === "image");

  return (
    <section style={{ marginTop: "1.5rem" }}>
      <h2>Featured Dishes</h2>
      <p className="muted">
        Select dishes to feature on the home page (at least three will be shown
        with defaults if fewer selected).
      </p>
      <div className="grid">
        {imageDishes.map((d) => (
          <label key={d.id} className="card" style={{ padding: ".5rem" }}>
            <img
              src={d.imageDataUrl || d.image || "/placeholder.svg"}
              alt={d.name}
              style={{ width: "100%", height: "140px", objectFit: "cover" }}
            />
            <div className="card-body">
              <input
                type="checkbox"
                checked={selected.includes(d.id)}
                onChange={() => toggle(d.id)}
              />{" "}
              {d.name}
            </div>
          </label>
        ))}
      </div>
      <button className="btn" type="button" onClick={save}>
        Save Featured
      </button>
      {saved && (
        <span className="muted" style={{ marginLeft: ".5rem" }}>
          {saved}
        </span>
      )}
    </section>
  );
}
