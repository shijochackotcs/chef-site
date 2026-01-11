import { useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tokenParam = params.get("token") || "";
  const hasPwd = (localStorage.getItem("chefsite_admin_password") || "").length > 0;
  const envToken = import.meta.env.VITE_OWNER_TOKEN || "";
  const savedToken = localStorage.getItem("chefsite_owner_token") || "";
  const allowedToken = savedToken || envToken;
  const showOwnerLink = !hasPwd || (tokenParam && allowedToken && tokenParam === allowedToken);

  return (
    <footer className="footer">
      <small>© {new Date().getFullYear()} chefjocateringevents</small>
      {showOwnerLink && (
        <a
          href={tokenParam ? `/owner-setup?token=${encodeURIComponent(tokenParam)}` : "/owner-setup"}
          style={{ marginLeft: "0.75rem", fontSize: "0.85rem" }}
        >
          Owner Setup
        </a>
      )}
    </footer>
  );
}
