# HearIntel — Brand Palette Book v3
## Medical Ink Design System


---

## Design Philosophy

> Clinical precision meets human warmth. Every decision serves the audiologist's cognitive load — not decoration.

- **Information hierarchy over decoration** — what matters most is largest, boldest, most prominent
- **No emojis as icons** — Lucide SVG only (14px, stroke-width 1.75)
- **Motion is purposeful** — 180ms ease for nav, 160ms for forms, 120ms for micro
- **Color carries meaning** — brand cyan = system UI; teal = clinical data; red = right ear; blue = left ear
- **Tasteful not rigid** — inspired by OrangeFarm sidebar layout, not copied from templates

---

## Color System

### Base Backgrounds
| Token | Value | Use |
|-------|-------|-----|
| `--bg-page` | `#FAFAF9` | Warm off-white page background |
| `--surface` | `#FFFFFF` | Cards, panels, inputs |
| `--surface-2` | `#F5F4F2` | Hover surfaces, nested cards |
| `--bg-subtle` | `#F0EFED` | Subtle sections, code blocks |

### Sidebar (Warm Ink)
| Token | Value | Use |
|-------|-------|-----|
| `--sidebar-bg` | `#1A1714` | Warm dark — medical premium (skill: `#1C1917`) |
| `--sidebar-hover` | `rgba(255,255,255,0.05)` | Nav item hover |
| `--sidebar-active` | `rgba(8,145,178,0.12)` | Active nav item tint |
| `--sidebar-accent` | `#38BDF8` | Sky-400 — active indicator on dark bg |
| `--sidebar-text` | `rgba(255,255,255,0.62)` | Inactive nav labels (WCAG AA: 5.8:1) |

### Brand (System UI)
| Token | Value | Use |
|-------|-------|-----|
| `--brand` | `#0891B2` | Primary brand cyan — buttons, links, focus |
| `--brand-hover` | `#0E7490` | Hover state for brand elements |
| `--brand-subtle` | `rgba(8,145,178,0.08)` | Active state background tint |
| `--brand-border` | `rgba(8,145,178,0.25)` | Brand-colored borders |

### Clinical Data Colors (NOT UI chrome)
| Value | Use |
|-------|-----|
| `#14B8A6` teal-500 | Clinical data visualization only |
| `#DC2626` | Right ear (red) audiogram |
| `#1D4ED8` | Left ear (blue) audiogram |
| `#10B981` | Status active dot in registry tables |

> **Rule**: Teal/green NEVER appears in sidebar chrome, nav, or header UI.

### Text
| Token | Value | Use |
|-------|-------|-----|
| `--text-primary` | `#0C0A09` | Body text, headings |
| `--text-secondary` | `#44403C` | Supporting text, labels |
| `--text-tertiary` | `#78716C` | Placeholders, meta, muted |
| `--text-label` | `#A8A29E` | Section labels, table headers |

### Semantic
| Token | Value | Use |
|-------|-------|-----|
| `--status-danger` | `#DC2626` | Alerts, red flags |
| `--status-warning` | `#D97706` | Caution states |
| `--status-success` | `#059669` | Cleared, confirmed |
| `--status-neutral` | `#78716C` | Default/inactive |

---

## Typography

### Font Stack
| Role | Font | Weights |
|------|------|---------|
| Headings, Brand | **Figtree** | 600, 700 |
| Body, Nav, UI | **DM Sans** | 400, 500, 600 |
| Numerics, Data | **JetBrains Mono** | 400, 500, 600 |

### Scale
| Element | Size | Weight | Font |
|---------|------|--------|------|
| Brand name | 16px | 700 | Figtree |
| Page title (h1) | 21px | 700 | Figtree |
| Section title | 13.5px | 700 | Figtree |
| Card title | 13.5px | 700 | Figtree |
| Nav item | 13px | 400 | DM Sans |
| Nav active | 13px | 500 | DM Sans |
| Sub-nav item | 12px | 400 | DM Sans |
| Body text | 13.5px | 400 | DM Sans |
| Form label | 11.5px | 600 | DM Sans |
| Form input | 13.5px | 400 | DM Sans |
| Table cell | 13px | 400 | DM Sans |
| Table header | 11px | 700 | Figtree |
| KPI value | 22px | 700 | JetBrains Mono |
| Caption/meta | 11px | 400 | DM Sans |
| Section label | 9px | 700 | DM Sans |
| Badge | 11px | 600 | DM Sans |

---

## Component Patterns

### Sidebar Rail (204px)
```
[Brand lockup — 18px 14px padding, border-bottom]
[nav-group — padding 0 8px]
  [nav-section — 9px uppercase label]
  [nav-item — 34px min-height, 13px 400, border-left 2px transparent]
    [nav-icon — 14px Lucide, opacity 0.55 → 1 active]
    [nav-label — DM Sans]
  [nav-sub — indent 22px, no connector line]
    [nav-sub-item — 12px 400, border-left 2px transparent]
[sidebar-assessment-block — neutral card, no color]
  [label: CURRENT PATIENT]
  [patient-name — Figtree 12.5px 600]
  [resume link — 11px muted → hover]
[sidebar-footer — border-top separator]
  [footer-row: name + Switch]
  [footer-meta: age · sex · mrn]
  [theme-switch-bar]
```

### Encounter Header
- Background: `#1A1714` (matches sidebar, forms one dark band)
- Patient name: Figtree 14.5px 600, `rgba(255,255,255,0.94)`
- Meta: DM Sans 11.5px 400, `rgba(255,255,255,0.42)`
- Actions: ghost btn, `rgba(255,255,255,0.82)`
- Saved indicator: neutral dot, no color

### Cards
- Background: `var(--surface)` white
- Border: `1px solid var(--border)` `#E7E5E4`
- Radius: `var(--radius)` 8px
- Shadow: `var(--shadow-card)` subtle
- Title: Figtree 13.5px 700, no uppercase, `letter-spacing: -0.01em`

### Buttons
| Variant | Style |
|---------|-------|
| Primary | `var(--brand)` bg, white text, 13px 600 |
| Ghost | transparent bg, `var(--text-secondary)` text |
| Danger | `var(--status-danger)` bg |

### Form Fields
- Label: DM Sans 11.5px 600, `var(--text-secondary)`
- Input: DM Sans 13.5px 400, `var(--text-primary)`
- Focus: `border-color: var(--brand)` + `box-shadow: 0 0 0 3px rgba(8,145,178,0.12)`
- Radius: `var(--radius-sm)` 6px

### Registry Table
- Row: clickable (`cursor: pointer`), full-row `onclick`
- Density: default (10px) / compact (6px) / comfortable (14px) — user-controlled
- Sort: column headers with directional indicator
- Empty state: icon + title + description, centered, `48px` icon circle

### Toast Notifications
- Position: fixed bottom-right
- Dark bg: `var(--text-primary)` with white text
- Success: `#0F766E` teal-dark
- Error: `#B91C1C`
- Animation: `toastIn 220ms` + `toastOut 220ms at 2.8s`
- Auto-dismiss: 3.2s

---

## Spacing System
| Token | Value |
|-------|-------|
| `--radius-xs` | 4px |
| `--radius-sm` | 6px |
| `--radius` | 8px |
| `--radius-lg` | 12px |

---

## Motion
| Context | Duration | Easing |
|---------|----------|--------|
| Sidebar nav transitions | 180ms | ease |
| Form focus/hover | 160ms | ease |
| Button/badge hover | 150ms | ease |
| Micro interactions | 120ms | ease |
| Toast entry | 220ms | ease |
| Page-level transitions | — | none (SPA-style instant) |

---

## Anti-Patterns (NEVER do these)
- ❌ Emojis as icons — use Lucide SVG only
- ❌ Green/teal in sidebar chrome — clinical data only
- ❌ Hardcoded colors like `#2DD4BF`, `#14B8A6` in nav/header
- ❌ All-uppercase card titles — use Figtree with `letter-spacing: -0.01em`
- ❌ Generic `monospace` font — always `var(--font-mono)`
- ❌ Missing hover/focus states on interactive elements
- ❌ `font-family: Inter` — DM Sans is the body font
- ❌ Neon badges or traffic-light colors in UI chrome
- ❌ `cursor: default` on anything interactive
- ❌ `#FFFFFF` hardcoded backgrounds — use `var(--surface)`

---

## Page Inventory

| Page | Role | Key Pattern |
|------|------|-------------|
| 00-dashboard | Clinical worklist | KPI strip + patient table + signal sidebar |
| 01-registry | Patient list | Sortable table, density toggle, empty state |
| 02-profile | Patient record | 4-tab layout, KPI tiles (JetBrains Mono 22px) |
| 03-start-encounter | Assessment gate | Single CTA |
| 04-workspace-history | Case history | Form-heavy, red flag grid, COSI goals |
| 05-workspace-otoscopy | Ear canal imaging | Media upload + annotation |
| 06-workspace-pta | Audiogram | SVG chart, right/left ear toggle, data entry |
| 07-workspace-immittance | Tympanometry | Chart + interpretation |
| 08-workspace-speech | Speech audiometry | SRT/WRS input |
| 09-conclusion | Diagnosis + management | Pathway cards, ICD-10, care plan |
| 10-media | Clinical media | File library |
| 11-settings | Practice settings | Form-based |
| 12-workspace-electrophysiology | ABR/ASSR/OAE | Advanced testing |
| 13-workspace-screening | Hearing screening | Pass/Refer workflow |
