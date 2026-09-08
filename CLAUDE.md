# HearIntel Prototypes — Engineering & Anti-Slop Guidelines (CLAUDE.md)

This file sets the architectural standards, code quality rules, and anti-slop guidelines for all AI agents working on the HearIntel prototypes repository (`pms_prototype`, `authorization_prototype`, `landing_page_prototype`).

---

## 1. Core Architecture & Tech Stack

- **Stack**: Vanilla HTML5, CSS3 (custom properties / design tokens), Vanilla JavaScript (ES6+). No unnecessary frameworks or build-step dependencies.
- **Shared Modules**:
  - `pms_prototype/data.js`: Clinical database, mock records, and patient storage (`HearIntelDB`).
  - `pms_prototype/prototype.js`: Universal auth coordinator, role switcher, patient shell, routing permissions, and report engine.
  - `pms_prototype/styles.css`: Global design tokens, typography, surfaces, buttons, and tables.
  - `authorization_prototype/index.html`: Admin Governance Console (IAM, RBAC, scopes, permission matrix, decision simulator).
- **State Management**: Primary state is managed in memory and synchronized immediately to `localStorage` (`hearintel_governance_state`, `hearintel_pms_auth_context`).

---

## 2. Zero-Tolerance Anti-Slop Rules

Every AI assistant modifying this repository must strictly adhere to the following:

### A. Ban on "Futures Slop" (Speculative Engineering)
- **Do not invent unrequested abstractions**: Never generate generic wrapper classes, speculative config interfaces, or unused parameters for "future expansion".
- **Solve the immediate requirement cleanly**: Write direct, readable, verifiable logic that solves the user's specific problem without redundant indirection layers.
- **No dead placeholder parameters**: If a function parameter or setting isn't actively consumed, do not add it.

### B. Ban on Dead / Decorative UI (Action Integrity)
- **Every interactive element must work**: Every button, dropdown, checkbox, and link must trigger real state changes, navigation, or visual feedback (`notify(...)`).
- **No decorative toggles or disabled illusions**: Never display a form control as active if its handler does nothing.
- **Immediate visual persistence**: Any edit (e.g. saving a user, toggling a permission, switching an organization) must:
  1. Update the in-memory state.
  2. Persist to `localStorage`.
  3. Immediately re-render the affected DOM elements (table, cards, badge) without requiring a browser reload.

### C. Ban on Jargon & Opaque Controls
- **Human-readable domain labels**: Never present raw database slugs or internal keys (e.g. `solo-main`, `dashboard.view`) to the user. Always map to clear clinical/administrative labels.
- **Two-tier hierarchical navigation**: Where categorizations exist (e.g. Organization Type -> Specific Organization), use cascading dropdowns rather than dumping flat, mixed lists.
- **Contextual explanations for abstract concepts**: Concepts like "Scope" must include plain-language descriptions explaining exact patient visibility boundaries (Organization-wide vs. Branch only vs. Assigned caseload).

### D. Single-User / Multi-User Consistency
- **Solo Practice guardrails**: Solo subscriptions are strictly single-user with a single facility.
  - Hide "Invite User" actions for solo orgs in Governance.
  - Hide the "Institution & Team" workspace in PMS settings for solo practitioners.
  - Do not lock users out of customizing their own access levels or roles.

---

## 3. Verification & Pre-Commit Standards

Before completing any task or committing changes:
1. **Syntax Check**: Run `node -c` on all modified JavaScript code blocks to catch syntax errors, missing concatenations, or unescaped quotes.
2. **End-to-End Flow Verification**: Verify that the modified UI opens, updates state, reflects changes in parent tables, and survives a page reload.
3. **Clean Diffs**: Avoid modifying unrelated lines or formatting. Preserve existing comments and docstrings.
