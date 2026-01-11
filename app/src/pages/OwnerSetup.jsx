import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OwnerSetup() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const tokenParam = params.get("token") || "";

  const savedPwd = localStorage.getItem("chefsite_admin_password") || "";
  const envToken = import.meta.env.VITE_OWNER_TOKEN || "";
  const savedToken = localStorage.getItem("chefsite_owner_token") || "";
  const allowedToken = savedToken || envToken;

  const firstTime = savedPwd.length === 0;
  const allowed = firstTime || (allowedToken && tokenParam === allowedToken);

  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [ownerToken, setOwnerToken] = useState(allowedToken);
  const [msg, setMsg] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!allowed) {
      setMsg("Access denied: invalid or missing owner token.");
      return;
    }
    const p = newPwd.trim();
    if (p.length < 4) {
      setMsg("Choose a longer password (min 4 chars)");
      return;
    }
    if (p !== confirmPwd.trim()) {
      setMsg("Passwords do not match");
      return;
    }
    if (ownerToken.trim()) {
      localStorage.setItem("chefsite_owner_token", ownerToken.trim());
    }
    localStorage.setItem("chefsite_admin_password", p);
    localStorage.setItem("chefsite_admin_authed", "true");
    setMsg("Admin password saved. Redirecting to Admin...");
    setTimeout(() => navigate("/admin"), 800);
  }

  if (!allowed) {
    return (
      <section>
        <h2>Owner Setup</h2>
        <p className="muted">Access denied. Provide a valid `token` query parameter.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Owner Setup</h2>
      <form className="review-form" onSubmit={submit}>
        <label>
          Set Admin Password
          <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} required />
        </label>
        <label>
          Confirm Password
          <input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} required />
        </label>
        <label>
          Owner Token (optional)
          <input type="text" value={ownerToken} onChange={(e) => setOwnerToken(e.target.value)} placeholder="Set a token to protect this page" />
        </label>
        <button className="btn" type="submit">Save</button>
        {msg && <span className="muted" style={{ marginLeft: ".5rem" }}>{msg}</span>}
      </form>
      <p className="muted">This is client-side only. For production security, use a real auth backend.</p>
    </section>
  );
}