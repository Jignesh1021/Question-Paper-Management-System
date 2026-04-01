# Design System: QPMS Intelligence Core

## 1. Visual Theme & Atmosphere
A clinical, high-agency interface with confident asymmetric layouts and fluid weighted motion. The atmosphere is that of a "Minimalist Intelligence Deck" — precise, architectural, and authoritative. It uses Ivory-toned depth over deep Charcoal Ink, accented by a singular Indigo pulse.

## 2. Color Palette & Roles
- **Deep Slate Canvas** (#020617) — Primary workspace foundation
- **Ink Surface** (#09090b) — Elevated component surfaces
- **Indigo Pulse** (#6366f1) — Singular accent for CTAs, active states, and focus rings
- **Alabaster Primary** (#f8fafc) — Primary display text and high-contrast labels
- **Ghost Metadata** (#94a3b8) — Secondary text, descriptions, and timestamps
- **Whisper Border** (rgba(255,255,255,0.08)) — Structural lines and card definitions
- **Banned:** Neon glows, #000000 pure black, purple button glows, oversaturated accents.

## 3. Typography Rules
- **Display:** "Satoshi" — Track-tight, controlled scale, weight-driven hierarchy
- **Body:** "Geist" — Relaxed leading, 65ch max-width, neutral secondary color
- **Mono:** "JetBrains Mono" — For metadata, timestamps, and high-density stats
- **Banned:** Inter, generic system fonts for premium contexts. No serif fonts in dashboard.

## 4. Component Stylings
- **Buttons:** Flat, tactile -1px translate on active. No outer glow. Indigo fill for primary.
- **Cards:** Replacement with **Border-Top Dividers** or "Whisper Borders" for high density. Rounded corners (1.5rem) when used.
- **Inputs:** Label above, helper text in Ghost Metadata. Focus ring in Indigo Pulse.
- **Perpetual Micro-Interactions:** Active components (Sidebars, List Items) feature infinite float or pulse loops (stiffness 100, damping 20).

## 5. Layout Principles
- **Grid-First Architecture:** Asymmetric splits for Landing, multi-column dashboard views.
- **Strict Single-Column Collapse:** Below 76px. No horizontal overflow.
- **Spacing:** Vertical section gaps reduce proportionally via `clamp(3rem, 10vw, 8rem)`.
- **No Overlapping:** Every element occupies a clean, distinct spatial zone.

## 6. Motion & Interaction
- **Spring Physics:** Weighty feel (`stiffness: 100, damping: 20`). No linear easing.
- **Staggered Cascade:** Waterfall reveals for all list data.
- **Hardware Acceleration:** Animating exclusively via `transform` and `opacity`.

## 7. Anti-Patterns (Banned)
- No emojis
- No "Inter" font
- No fake round numbers (`99.99%`)
- No AI copywriting clichés ("Elevate", "Next-Gen")
- No generic names ("Acme", "John Doe")
- No centered Hero sections (variance 8+)
- No "LABEL // YEAR" lazy formatting
