// LE MARRAKECHI theme — Moroccan luxury palette
export const palette = {
  gold: "#D4AF37",
  goldSoft: "#C9A24B",
  emerald: "#1B7A5E",
  copper: "#C87A3F",
};

export const dark = {
  mode: "dark",
  bg: "#14100C",
  surface: "#1F1710",
  card: "#2A2018",
  cardAlt: "#332619",
  text: "#F3E9D8",
  textMuted: "#B8A88F",
  border: "#3A2E22",
  gold: palette.gold,
  emerald: "#0C6B47",
  emeraldDeep: "#08502F",
  royalGreen: "#07452F",
  bordeaux: "#8E2436",
  copper: palette.copper,
  ivory: "#F3E9D8",
  overlay: "rgba(0,0,0,0.55)",
};

// Luxury gradient tokens
export const grad = {
  gold: ["#E8C766", "#C9A24B", "#A8791F"] as const,
  bronze: ["#C08B5C", "#8C5A2B"] as const,
  emerald: ["#0C6B47", "#063D2A"] as const,
  emeraldDeep: ["#08502F", "#052318"] as const,
  royal: ["#0A5C3E", "#063D2A", "#04271B"] as const,
  bordeaux: ["#A22A3C", "#6E1C29", "#42101A"] as const,
  night: ["#241a10", "#14100C"] as const,
};

export const light = {
  mode: "light",
  bg: "#F7F0E4",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  cardAlt: "#F1E7D5",
  text: "#2B1B12",
  textMuted: "#7A6A55",
  border: "#E4D8C2",
  gold: "#B8912E",
  emerald: "#0A5C39",
  emeraldDeep: "#08502F",
  royalGreen: "#063D2A",
  bordeaux: "#7A1F2E",
  copper: palette.copper,
  ivory: "#F3E9D8",
  overlay: "rgba(0,0,0,0.35)",
};

export type Theme = typeof dark;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radius = { sm: 8, md: 14, lg: 22, pill: 999 };
// Arabic calligraphy (Quranic-style) font families loaded in _layout.tsx
export const font = { calligraphy: "ArefRuqaa" as const, naskh: "Amiri" as const };
