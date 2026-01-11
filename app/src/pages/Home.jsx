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
      <ThemeProvider theme={theme}>
        <section
          className="hero"
          style={{
              backgroundImage:
                "linear-gradient(120deg, rgba(17,24,39,0.65), rgba(11,18,34,0.65) 60%, rgba(31,41,55,0.65)), url(https://cdn.pixabay.com/photo/2016/06/07/17/26/food-1447929_1280.jpg), url(/uploads/images/yummy.webp), url(/uploads/images/OIP.jpg), url(/uploads/images/hero.webp), url(https://cdn.pixabay.com/photo/2017/01/18/19/39/restaurant-1999850_1280.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "calc(100vh - var(--nav-h) - var(--footer-h))",
          }}
        >
          <div className="hero-inner">
            <Paper
              elevation={0}
              sx={(theme) => ({
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(0,0,0,0.35)"
                    : "rgba(255,255,255,0.55)",
                boxShadow: { xs: "0 4px 16px rgba(0,0,0,0.2)", sm: "0 8px 24px rgba(0,0,0,0.25)" },
                border: "1px solid rgba(255,255,255,0.12)",
              })}
            >
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  mb: { xs: 1, sm: 1.25, md: 1.5 },
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
                  mb: { xs: 1.5, sm: 2, md: 2.5 },
                  color: "text.secondary",
                  fontFamily: 'Quicksand, system-ui, sans-serif',
                }}
              >
                Fresh food made with love for every occasion.
              </Typography>
              {display && display.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                    mb: { xs: 1.5, sm: 2 },
                  }}
                >
                  <img
                    src={display[0].image}
                    alt={display[0].name}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "1px solid rgba(255,255,255,0.25)",
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&q=80&w=300&auto=format&fit=crop";
                    }}
                  />
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Popular: {display[0].name}
                  </Typography>
                </Box>
              )}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" alignItems="center">
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
                <Button
                  variant="outlined"
                  color="secondary"
                  component={Link}
                  to="/favorites"
                  sx={{ borderRadius: 9999, px: 2.5, py: 0.75 }}
                >
                  Favorite Dishes
                </Button>
              </Stack>
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
            </Paper>
          </div>
        </section>
      </ThemeProvider>
    </>
  );
}
