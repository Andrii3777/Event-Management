# DESIGN.md — Event Management Design System

## 1. Visual Concept
The interface is designed around an **Ethereal Frosted Glassmorphism** aesthetic tailored for modern community and tech events:
- **Atmosphere**: Deep cobalt blue ambient glows (`background.jpg`) diffused under a frosted semi-transparent veil (`backdrop-blur-2xl` with a soft ice-mist gradient).
- **Cards & Surfaces**: Translucent rounded glass containers (`bg-white/75`, `backdrop-blur-xl`, `border-white/80`, `shadow-sm`) that elevate tactically on hover.
- **Accents**: Electric cobalt primary CTAs, soft ice-blue date badges, fluid vector wave elements along card/modal bottoms, and subtle cursive script watermarks.

---

## 2. Design Tokens

### 2.1 Color Palette
```css
:root {
  /* Brand Cobalt */
  --brand-50: #eff6ff;
  --brand-100: #dbeafe;
  --brand-200: #bfdbfe;
  --brand-500: #3b82f6;
  --brand-600: #2563eb;
  --brand-700: #1d4ed8;

  /* Neutrals & Slate */
  --slate-900: #0f172a; /* Main headings, highest contrast */
  --slate-800: #1e293b; /* Heavy labels & titles */
  --slate-600: #475569; /* Body copy & descriptions */
  --slate-500: #64748b; /* Secondary meta, dates, counts */
  --slate-400: #94a3b8; /* Placeholders & inactive icons */
  --slate-200: #e2e8f0; /* Borders & dividers */

  /* Glass & Frost */
  --glass-bg: rgba(255, 255, 255, 0.75);
  --glass-bg-hover: rgba(255, 255, 255, 0.92);
  --glass-border: rgba(255, 255, 255, 0.85);
  --glass-shadow: 0 8px 30px rgba(15, 23, 42, 0.05);

  /* Status Colors */
  --danger-bg: #fff1f2;
  --danger-text: #e11d48;
  --danger-border: #fecdd3;
}
```

### 2.2 Typography
- **Primary Sans**: `"Plus Jakarta Sans", "Inter", system-ui, -apple-system, sans-serif`
  - Hero Page Titles: `32px` – `44px` (bold / extrabold, tracking `-0.03em`)
  - Section Headings / Modal Titles: `22px` – `26px` (bold, tracking `-0.02em`)
  - Eyebrow Tags: `11px` (bold, tracking `0.1em`, uppercase)
  - Card Titles: `16px` – `18px` (bold, slate-900)
  - Body / Form Inputs: `14px` (regular / medium, slate-600 / slate-800)
  - Date Badge Day Number: `24px` – `28px` (black / 900 weight, cobalt blue)
  - Secondary Meta: `12px` – `13px` (medium, slate-500)
- **Accent Script**: `"Caveat", "Nanum Pen Script", cursive`
  - Watermarks: `18px` – `22px` (`text-blue-500/40`, rotated `-6deg`)

### 2.3 Radii & Elevation
- `rounded-xl`: `12px` (buttons, inputs, date badges)
- `rounded-2xl`: `16px` (event cards, navbar pill, search container)
- `rounded-3xl`: `24px` (modals, auth containers)
- `rounded-full`: pills, status chips, circular action buttons

### 2.4 Motion & Transitions
- `duration-200 ease-out` on all interactive states (hover, focus, active).
- `active:scale-[0.98]` on buttons for tactile, native click response.
- `hover:-translate-y-0.5 hover:shadow-md` on event cards.

---

## 3. Component Blueprints

1. **Top Floating Navbar**:
   Frosted capsule floating at page top (`bg-white/80 backdrop-blur-md border border-white/60 shadow-sm rounded-2xl`). Includes logo with calendar mark, auth controls, "My events" navigation, and "Create event" button.

2. **Event Card**:
   Frosted glass tile (`bg-white/75 backdrop-blur-md rounded-2xl border border-white/80 p-5 shadow-sm`). Contains:
   - Compact vertical date badge (`bg-blue-50/90 text-blue-600 rounded-xl px-3.5 py-3`).
   - Center metadata: title, location pin, brief summary, attendee tally.
   - Right circular chevron / action button linking to event details.

3. **Event Detail Modal (`/events/:id`)**:
   Deep overlay (`bg-slate-900/40 backdrop-blur-sm`). Floating frosted card (`rounded-3xl bg-white shadow-2xl p-7 relative overflow-hidden`).
   Includes date badge, title, location/date/organizer 3-column fact grid, full description, and join/leave/edit/delete actions, with organic wave graphics at bottom.

4. **Event Form Modal (`/events/create`, `/events/:id/edit`)**:
   Centered frosted modal with calendar plus badge, clean labeled inputs with iconography, and full-width gradient cobalt submit button.

5. **Auth Card (`/login`, `/signup`)**:
   Centered card with floating blur orbs, avatar glyph, mail/lock/user inputs with show/hide password toggle, and clear switch links.

---

## 4. Visual Polish & Quality Standards
- Clean surface hierarchy: consistent elevation, frosted glass diffusion, and micro-borders.
- High contrast: all body text meets WCAG AA (≥ 4.5:1 ratio against light glass background).
- Zero unhandled edge cases: skeleton loaders for initial fetches, graceful empty states with reset filters, text truncation with tooltips/clamps, and fully responsive layout down to 320px screens.
