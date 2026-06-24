/**
 * Pujari Connect — Design System: Color Tokens
 *
 * Theme: "Ivory & Gold" — a light, premium devotional look. Warm ivory/golden
 * background, white cards, charcoal text, with saffron (primary action) and
 * brass-gold (accent) highlights.
 *
 * ──────────────────────────────────────────────────────────────────────────
 *  TO RESKIN THE WHOLE APP, EDIT THE `BRAND` SEED BELOW (1–2 lines is enough).
 *  Every token downstream is derived from these five seeds.
 *    - primary : main call-to-action color (buttons, prices, active states)
 *    - gold    : decorative accent (borders, rings, badges, dividers)
 *    - bg      : app background base
 *    - surface : card / sheet surface
 *    - ink     : primary text color
 *  e.g. swap `primary` to '#7A1F2B' for a maroon theme, or set bg/surface/ink
 *  to dark values for a dark theme.
 * ──────────────────────────────────────────────────────────────────────────
 */

const BRAND = {
  primary: '#F2700A', // Saffron / kesari
  gold: '#C99A3E',    // Brass gold
  bg: '#FBF7EF',      // Ivory
  surface: '#FFFFFF', // White card
  ink: '#2A2018',     // Warm charcoal
} as const;

export const colors = {
  // ─── Brand / Saffron ───────────────────────────
  primary: BRAND.primary,
  primaryLight: '#FF8C3A',
  primaryDark: '#C95B07',
  secondary: BRAND.gold,
  secondaryDark: '#9A7728',
  tertiary: '#D98AA6',        // Lotus pink

  // ─── Sacred Accents ────────────────────────────
  saffron: BRAND.primary,
  marigold: '#F2A007',        // Genda / marigold
  gold: BRAND.gold,
  goldLight: '#E6C77E',
  goldDark: '#9A7728',
  vermilion: '#D7472A',       // Sindoor
  vermilionDark: '#B5371E',
  maroon: '#7A1F2B',          // Temple maroon
  lotus: '#D98AA6',
  sacredGreen: '#2E9E5B',

  // ─── Light Surfaces (ivory → white) ────────────
  background: BRAND.bg,
  surface: BRAND.surface,
  surfaceDim: '#F4EEE2',
  surfaceBright: '#FFFFFF',
  surfaceContainer: '#FBF6EC',
  surfaceContainerLow: '#FCF9F2',
  surfaceContainerHigh: '#F3ECDE',
  surfaceContainerHighest: '#EEE5D4',
  surfaceElevated: '#FFFFFF',

  // ─── Text (warm charcoal scale) ────────────────
  textPrimary: BRAND.ink,
  textSecondary: '#5C5043',
  textMuted: '#938678',
  textOnPrimary: '#FFFFFF',
  textOnDark: '#FFFFFF',
  textGold: '#9A7728',        // Gold readable on white (AA)

  // ─── Semantic ──────────────────────────────────
  success: '#16A34A',
  successLight: '#22C55E',
  successDark: '#15803D',
  error: '#DC2626',
  errorLight: '#FCA5A5',
  errorDark: '#991B1B',
  warning: '#D97706',
  info: '#2563EB',

  // ─── Cards & Hairlines (soft gold edges) ───────
  cardBg: '#FFFFFF',
  cardBgHover: '#FBF6EC',
  cardBorder: 'rgba(201, 154, 62, 0.20)',
  cardBorderLight: 'rgba(201, 154, 62, 0.38)',
  glassBg: 'rgba(255, 255, 255, 0.72)',
  glassStroke: 'rgba(201, 154, 62, 0.28)',
  hairlineGold: 'rgba(201, 154, 62, 0.32)',

  // ─── Special Purpose ───────────────────────────
  accentYellow: '#9A7728',    // Readable gold for price text/badges on white
  darkRed: '#7A1F2B',
  darkRedLight: '#9A2A38',
  overlay: 'rgba(0, 0, 0, 0.40)',
  overlayDark: 'rgba(0, 0, 0, 0.62)',
  shimmer: 'rgba(0, 0, 0, 0.04)',

  // ─── Rating Stars ──────────────────────────────
  starFilled: '#E8A704',
  starEmpty: '#D8CBB6',

  // ─── Status Badges ─────────────────────────────
  statusPending: '#D97706',
  statusConfirmed: '#16A34A',
  statusCompleted: '#2563EB',
  statusCancelled: '#DC2626',

  // ─── Gradients (arrays for LinearGradient) ─────
  gradientPrimary: ['#F2700A', '#F2A007'] as const,        // saffron → marigold
  gradientDark: ['#FFFFFF', '#FBF7EF'] as const,
  gradientCard: ['#FFFFFF', '#FCF8F0'] as const,
  gradientSuccess: ['#16A34A', '#22C55E'] as const,
  gradientGold: ['#E6C77E', '#C99A3E', '#9A7728'] as const,
  gradientSplash: ['#FFF7E8', '#FBEFD8', '#FBF7EF'] as const,
  gradientAarti: ['#FFE9C7', '#FFD8A0', '#F2A007'] as const, // warm golden card banner
  gradientTemple: ['#FFFFFF', '#FBF3E4'] as const,
  gradientSaffron: ['#F2700A', '#F2A007'] as const,
  gradientMaroon: ['#7A1F2B', '#9A2A38'] as const,
  // Soft golden-ivory app background wash
  gradientScreen: ['#FFFDF8', '#FBF4E6', '#F6EAD3'] as const,
} as const;

export type ColorToken = keyof typeof colors;
