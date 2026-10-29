/**
 * Design tokens — single source for mobile + web.
 * Never hardcode hex in components.
 */
export const colours = {
  primary: "#0D6B5F",
  primaryDark: "#0A5148",
  accent: "#B9551B", // flag / urgent / selected plot
  ink: "#0F1C19",
  ink2: "#1D2E29",
  muted: "#4A5A55",
  surface: "#FFFFFF",
  surface2: "#F5F8F3",
  bg: "#EEF1EC",
  success: "#1F7A4C",
  warn: "#C6890B",
  danger: "#B3261E",
  line: "rgba(15,28,25,0.13)",
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 48,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  full: 9999,
} as const;

export const typography = {
  display: "BricolageGrotesque",
  body: "IBMPlexSans",
  mono: "IBMPlexMono", // prices, areas, plot numbers
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 26,
    xxl: 34,
  },
} as const;

export const motion = {
  fast: 150,
  normal: 250,
  slow: 400,
  easing: "cubic-bezier(0.2, 0.7, 0.3, 1)",
} as const;
