# HearIntel Brand Palette Book
## Medical Ink Design System

---

## Design Direction

HearIntel should feel like a serious clinical workspace: calm, precise, and trustworthy, with enough warmth to avoid the coldness of generic hospital software.

The visual system separates three jobs for color:

- **Brand UI**: actions, focus states, selected navigation, and links.
- **Clinical data**: audiology charts, measurement states, and ear-specific conventions.
- **Operational status**: active, pending, warning, danger, and neutral system feedback.

This separation keeps the product professional. The interface does not become decorative, and clinical colors remain meaningful.

---

## Core Palette

### Brand UI

| Token | Value | Use |
| --- | --- | --- |
| `--brand` | `#0891B2` | Primary buttons, selected UI, links, key focus states |
| `--brand-hover` | `#0E7490` | Hover and pressed states |
| `--brand-subtle` | `rgba(8,145,178,0.08)` | Selected backgrounds, soft active states |
| `--brand-border` | `rgba(8,145,178,0.24)` | Selected borders and active outlines |
| `--brand-glow` | `rgba(8,145,178,0.16)` | Focus glow and low-emphasis highlights |

Design note: the cyan brand should be used sparingly. It is a signal for action and orientation, not a page background color.

### Clinical Data

| Token | Value | Use |
| --- | --- | --- |
| `--teal-500` | `#00897B` | Clinical anchors, non-ear-specific data visualization |
| `--teal-600` | `#00796B` | Clinical hover or stronger emphasis |
| `--teal-subtle` | `rgba(0,137,123,0.08)` | Clinical data backgrounds |
| `--right-ear` | `#DC2626` | Right ear audiogram and measurement marks |
| `--left-ear` | `#2563EB` | Left ear audiogram and measurement marks |

Design rule: teal is for clinical content and data. It should not be used for primary navigation chrome, page headers, or generic buttons.

### Surfaces

| Token | Value | Use |
| --- | --- | --- |
| `--bg-page` | `#FAFAF9` | Main page background |
| `--bg-subtle` | `#F4F5F7` | Subtle bands, wells, secondary panels |
| `--surface` | `#FFFFFF` | Cards, forms, tables, modals |
| `--surface-2` | `#F9FAFB` | Nested areas inside cards |
| `--surface-3` | `#F3F4F6` | Table headers and deeper nesting |

Design note: the base palette is intentionally warm-neutral. It should feel clinical without looking sterile or washed out.

### Sidebar

| Token | Value | Use |
| --- | --- | --- |
| `--sidebar-bg` | `#1A1714` | Main app navigation shell |
| `--sidebar-hover` | `rgba(255,255,255,0.05)` | Sidebar hover states |
| `--sidebar-active` | `rgba(8,145,178,0.12)` | Active sidebar state |
| `--sidebar-accent` | `#38BDF8` | Active indicator and brand mark on dark background |
| `--sidebar-text` | `rgba(255,255,255,0.62)` | Inactive sidebar labels |
| `--sidebar-text-active` | `#FFFFFF` | Active sidebar labels |

Design rule: the sidebar should feel like a stable clinical instrument panel. Avoid gradients, bright blocks, or decorative effects.

### Text

| Token | Value | Use |
| --- | --- | --- |
| `--text-primary` | `#0C0A09` | Headings and primary body text |
| `--text-secondary` | `#44403C` | Supporting text |
| `--text-label` | `#78716C` | Form labels and table labels |
| `--text-tertiary` | `#A8A29E` | Captions, metadata, quiet helper text |
| `--text-muted` | `#D6D3D1` | Disabled or very low-emphasis text |

### Status

| Token | Value | Use |
| --- | --- | --- |
| `--success` | `#16A34A` | Confirmed, complete, active |
| `--warning` | `#D97706` | Review needed, pending, caution |
| `--danger` | `#DC2626` | Risk, alert, destructive action |
| `--status-info-dot` | `#38BDF8` | Informational status dots |

Design rule: use status colors as small signals. Prefer dots, borders, and text accents over large filled pills.

---

## Prototype Themes

### Default: Medical Ink

The default theme is the main HearIntel product direction.

- Warm page background with white clinical surfaces.
- Deep warm sidebar for stable app navigation.
- Cyan brand accents for actions and active states.
- Teal reserved for clinical measurement and data.
- Red and blue preserved for audiology ear conventions.

Use this theme for normal PMS demos, clinical workflows, and stakeholder walkthroughs.

### Editorial

The editorial theme is softer and more document-like.

- Slightly lighter page surfaces.
- Warmer dark sidebar.
- Reduced shadow depth.
- Quiet borders and softer contrast.

Use this theme for patient-record review, report-heavy pages, or demos where the product should feel less operational and more consultative.

### Layered

The layered theme is higher contrast and more structured.

- Cooler background contrast.
- Stronger panel separation.
- Deeper sidebar.
- Clearer table and dashboard hierarchy.

Use this theme for dense dashboards, registry review, or demos where scanning and comparison matter most.

---

## Typography

| Role | Font | Weight Range | Use |
| --- | --- | --- | --- |
| Headings and brand | Figtree | 600-800 | Page titles, card titles, brand lockup |
| Body and controls | DM Sans | 400-700 | Forms, navigation, body copy, buttons |
| Data and numerics | JetBrains Mono | 400-600 | MRNs, KPI values, audiology measurements |

Keep typography compact and readable. This is a professional tool, not a landing page.

---

## Component Guidance

### Navigation

- Sidebar width: 204px.
- Icons: Lucide SVG, 14px, consistent stroke.
- Active state: subtle brand tint plus accent indicator.
- Labels: sentence case or short title case.
- Avoid large colorful navigation blocks.

### Cards And Panels

- Use white surfaces with quiet borders.
- Keep radii modest.
- Use shadows for hierarchy, not decoration.
- Avoid nested card stacks unless the inner element is a real control surface.

### Buttons

| Variant | Treatment |
| --- | --- |
| Primary | Brand background, white text, compact height |
| Secondary | White surface, neutral border, primary text |
| Ghost | Transparent, quiet text, hover surface |
| Danger | Reserved for destructive or clinical-risk actions |

Primary buttons should be rare. A screen with too many primary buttons loses hierarchy.

### Forms

- Labels should be clear, compact, and paired with fields.
- Focus should use the brand border and soft focus ring.
- Helper text should be short and useful.
- Do not show active controls that do not save, notify, navigate, or visibly update the UI.

### Clinical Charts

- Right ear remains red.
- Left ear remains blue.
- Teal may support neutral clinical measurement.
- Chart colors should not be repurposed for generic UI decoration.
- Diagrams should render immediately and redraw after user edits.

---

## Accessibility And Contrast

- Maintain WCAG AA contrast for body text and controls.
- Use color plus text or shape for clinical meaning.
- Do not rely on color alone for pass/fail or right/left interpretation.
- Focus states must be visible on keyboard navigation.
- Avoid low-contrast gray text inside tables and form controls.

---

## Anti-Patterns

- Do not use teal or green as generic navigation chrome.
- Do not use gradients, orbs, or atmospheric backgrounds in PMS workflows.
- Do not turn every action into a primary button.
- Do not use neon badges or large traffic-light fills.
- Do not expose raw internal keys such as permission slugs, branch IDs, or database values.
- Do not use decorative controls that do not perform an action.
- Do not use generic stock styling that makes the product feel unrelated to audiology.

---

## Page Inventory

| Page | Role | Primary Pattern |
| --- | --- | --- |
| `00-dashboard` | Clinical worklist | KPI strip, patient table, signal sidebar |
| `01-registry` | Patient list | Sortable table, density controls, empty state |
| `02-profile` | Patient record | Tabbed clinical record with KPI tiles |
| `03-start-encounter` | Assessment setup | Focused assessment launch form |
| `03-assessment-hub` | Diagnostic hub | Module cards and assessment navigation |
| `04-workspace-history` | Case history | Form-heavy intake and red flag review |
| `05-workspace-otoscopy` | Otoscopy | Media upload and annotation |
| `06-workspace-pta` | PTA | SVG audiogram and threshold matrix |
| `07-workspace-immittance` | Tympanometry | Curve visualization and interpretation |
| `08-workspace-speech` | Speech audiometry | SRT, WRS, QuickSIN, tinnitus inputs |
| `09-conclusion` | Diagnosis and care plan | Pathway selection and final assessment |
| `10-media` | Clinical media | File library and reports |
| `11-settings` | Practice settings | Form-based preferences and team invite |
| `12-workspace-electrophysiology` | Advanced testing | ABR, ASSR, OAE, VEMP review |
| `13-workspace-screening` | Hearing screening | Pass/refer workflow |

