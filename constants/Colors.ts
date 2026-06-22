/**
 * Pujari Connect Design System — Color Tokens
 * Ported from MyPandit's Color.kt theme with enhancements
 */

export const colors = {
  // ─── Brand Colors ──────────────────────────────
  primary: '#FF792C',        // Vibrant orange (brand identity)
  primaryLight: '#FF9A5C',
  primaryDark: '#CC5A1A',
  secondary: '#FFE523',      // Golden yellow (accent/highlights)
  secondaryDark: '#998700',
  tertiary: '#FF9AD8',       // Soft pink

  // ─── Dark Theme Surfaces ───────────────────────
  background: '#0F0A04',     // Deep dark brown-black
  surface: '#1A1008',        // Dark brown base
  surfaceDim: '#19120C',
  surfaceBright: '#413731',
  surfaceContainer: '#221A14',
  surfaceContainerLow: '#1E1610',
  surfaceContainerHigh: '#312822',
  surfaceContainerHighest: '#3C332C',
  surfaceElevated: '#261E18',

  // ─── Text Colors ───────────────────────────────
  textPrimary: '#FBEDE4',    // Off-white warm
  textSecondary: '#CBC4CF',  // Muted lavender
  textMuted: '#948F99',      // Subtle gray
  textOnPrimary: '#FFFFFF',
  textOnDark: '#FBE8DC',

  // ─── Semantic Colors ──────────────────────────
  success: '#06C167',        // Green CTAs (Book, Proceed, Checkout)
  successLight: '#0EE67D',
  successDark: '#04944E',
  error: '#FF5449',
  errorLight: '#FFB4AB',
  errorDark: '#93000A',
  warning: '#FFB74D',
  info: '#64B5F6',

  // ─── Card & Glass Effects ─────────────────────
  cardBg: 'rgba(255, 255, 255, 0.06)',
  cardBgHover: 'rgba(255, 255, 255, 0.10)',
  cardBorder: 'rgba(255, 255, 255, 0.10)',
  cardBorderLight: 'rgba(255, 255, 255, 0.15)',
  glassBg: 'rgba(255, 255, 255, 0.08)',
  glassStroke: 'rgba(255, 255, 255, 0.12)',

  // ─── Special Purpose ──────────────────────────
  accentYellow: '#FFED29',   // Badges, prices, selected states
  darkRed: '#3F0D12',        // Cart/sheet backgrounds
  darkRedLight: '#5A1520',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
  shimmer: 'rgba(255, 255, 255, 0.05)',

  // ─── Rating Stars ─────────────────────────────
  starFilled: '#FFD700',
  starEmpty: '#4A4540',

  // ─── Status Badge Colors ──────────────────────
  statusPending: '#FFB74D',
  statusConfirmed: '#06C167',
  statusCompleted: '#64B5F6',
  statusCancelled: '#FF5449',

  // ─── Gradients (as arrays for LinearGradient) ─
  gradientPrimary: ['#FF792C', '#FF9A5C', '#FFBF8A'] as const,
  gradientDark: ['#0F0A04', '#1A1008', '#261E18'] as const,
  gradientCard: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)'] as const,
  gradientSuccess: ['#06C167', '#0EE67D'] as const,
  gradientGold: ['#FFE523', '#FFD700', '#FFBF00'] as const,
  gradientSplash: ['#1A0A00', '#2D1408', '#0F0A04'] as const,
} as const;

export type ColorToken = keyof typeof colors;
