import { createTheme } from "@mui/material/styles";

function slotFromDate(date) {
  const hours = date.getHours();
  return Math.floor(hours / 3); // 0..7
}

function paletteForSlot(slot) {
  const sets = [
    { mode: "dark", primary: { main: "#f59e0b" }, secondary: { main: "#22c55e" }, background: { default: "#0f172a", paper: "#111827" } },
    { mode: "dark", primary: { main: "#60a5fa" }, secondary: { main: "#fbbf24" }, background: { default: "#0b1222", paper: "#0f172a" } },
    { mode: "light", primary: { main: "#ef4444" }, secondary: { main: "#06b6d4" }, background: { default: "#fff7ed", paper: "#fff" } },
    { mode: "light", primary: { main: "#22c55e" }, secondary: { main: "#f59e0b" }, background: { default: "#f0f9ff", paper: "#ffffff" } },
    { mode: "dark", primary: { main: "#a78bfa" }, secondary: { main: "#f472b6" }, background: { default: "#0f172a", paper: "#111827" } },
    { mode: "light", primary: { main: "#0ea5e9" }, secondary: { main: "#f97316" }, background: { default: "#f8fafc", paper: "#ffffff" } },
    { mode: "dark", primary: { main: "#f43f5e" }, secondary: { main: "#22d3ee" }, background: { default: "#0b1222", paper: "#0f172a" } },
    { mode: "light", primary: { main: "#10b981" }, secondary: { main: "#eab308" }, background: { default: "#f1f5f9", paper: "#ffffff" } },
  ];
  return sets[slot % sets.length];
}

export function computeTheme(date = new Date()) {
  const slot = slotFromDate(date);
  const palette = paletteForSlot(slot);
  return createTheme({ palette });
}

export function nextBoundaryMs(date = new Date()) {
  const hours = date.getHours();
  const next = Math.floor(hours / 3) * 3 + 3; // next multiple of 3
  const nextDate = new Date(date);
  nextDate.setHours(next, 0, 0, 0);
  return Math.max(1000, nextDate.getTime() - date.getTime());
}
