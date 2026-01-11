import DishCard from "../components/DishCard.jsx";
import { Link } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Box, Typography, Button, Paper, Stack } from "@mui/material";
import { computeTheme, nextBoundaryMs } from "../theme.js";
import { useEffect, useState } from "react";

const featuredSeeds = [
  {
    name: "Signature Pasta",
    description: "Handmade pasta in creamy sauce",
    price: 14.5,
    image:
            minHeight: "calc(100vh - var(--nav-h) - var(--footer-h))",
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
  const [theme, setTheme] = useState(computeTheme());
  useEffect(() => {
    function schedule() {
      const ms = nextBoundaryMs();
      timer = setTimeout(() => {
        setTheme(computeTheme());
        schedule();
      }, ms);
    }
    let timer = null;
    schedule();
    return () => timer && clearTimeout(timer);
  }, []);
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
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Link
                  to="/book-event"
                  className="btn-circle"
                  aria-label="Book a Catering Event"
                  style={{ display: "inline-flex" }}
                >
                  Book Now
                </Link>
              </Box>
  const allImagePool = [
    ...dishes.filter((d) => d.type === "image"),
    ...featuredSeeds
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  mb: 1.5,
                  color: "text.primary",
                  fontWeight: 700,
                  fontFamily: 'Caveat, cursive',
                  letterSpacing: ".5px",
                  fontSize: { xs: "2rem", sm: "2.6rem", md: "3rem" },
                }}
              >
                Welcome to chefjocateringevents
              </Typography>
              <Typography
                sx={{
                  mb: 2.5,
                  color: "text.secondary",
                  fontFamily: 'Quicksand, system-ui, sans-serif',
                }}
              >
                Fresh food made with love for every occasion.
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  color="secondary"
                  component={Link}
                  to="/contact"
                  sx={{ borderRadius: 9999, px: 2.5, py: 0.75 }}
                >
                  Contact us
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  component={Link}
                  to="/dishes"
                  sx={{ borderRadius: 9999, px: 2.5, py: 0.75 }}
                >
                  Explore Menu
                </Button>
              </Stack>
            </Paper>
          </div>
        </section>
      </ThemeProvider>

      <section>
        <h2>Featured Dishes</h2>
        <div className="grid">
          {display.map((d, i) => (
            <DishCard key={d.id ? d.id : i} dish={d} />
          ))}
        </div>
      </section>

      <section
        className="container"
        style={{ marginTop: "1rem", marginBottom: "1rem" }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link
            to="/book-event"
            className="card"
            aria-label="Book a Catering Event"
            style={{ maxWidth: "280px" }}
          >
            <div className="card-body" style={{ textAlign: "center" }}>
              <h3 style={{ marginTop: 0 }}>Book a Catering Event</h3>
              <p className="muted">Request a quote for your event.</p>
              <span
                className="btn-circle"
                style={{
                  display: "inline-flex",
                  marginTop: ".5rem",
                  width: "88px",
                  height: "88px",
                  fontSize: ".9rem",
                }}
              >
                Book Now
              </span>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
