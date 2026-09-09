# HearIntel Prototypes — Engineering Guidelines

This file defines the architectural, implementation, and code-quality standards for all AI agents working in the HearIntel prototypes repository.

Repositories/workspaces covered:

* `pms_prototype`
* `authorization_prototype`
* `landing_page_prototype`

The goal is simple: **make the prototype work clearly and reliably without adding unnecessary complexity.**

---

## 1. Core Architecture & Tech Stack

### Stack

* Vanilla HTML5
* CSS3 with custom properties and design tokens
* Vanilla JavaScript (ES6+)

Do not introduce frameworks, build tools, libraries, or dependencies unless explicitly requested.

### Existing Shared Modules

Respect the responsibilities of the existing files:

* `pms_prototype/data.js`
  Clinical database, mock records, and patient storage through `HearIntelDB`.

* `pms_prototype/prototype.js`
  Authentication coordination, role switching, patient shell, routing permissions, and report functionality.

* `pms_prototype/styles.css`
  Global design tokens, typography, surfaces, buttons, tables, and shared visual patterns.

* `authorization_prototype/index.html`
  Administrative Governance Console covering IAM, RBAC, scopes, permission management, and access simulation.

Before creating a new shared utility or abstraction, check whether the responsibility already belongs in an existing module.

### State Management

Primary prototype state is managed in memory and synchronized to `localStorage`.

Current storage keys include:

* `hearintel_governance_state`
* `hearintel_pms_auth_context`

When modifying state:

1. Update the in-memory state.
2. Persist the change to `localStorage`.
3. Immediately update the affected UI.

Do not require a page reload for changes that should be reflected immediately.

---

# 2. Non-Negotiable Implementation Rules

## A. No Speculative Engineering

Build for the current requirement.

Do not introduce:

* generic wrapper classes,
* factory or strategy patterns for single-use logic,
* speculative configuration systems,
* unused extension points,
* unused parameters,
* abstractions created only for hypothetical future requirements.

Prefer the smallest direct implementation that solves the actual problem.

Before adding an abstraction, ask:

> Is this abstraction solving a current complexity, or creating one?

If it only exists for a possible future use case, do not add it.

---

## B. Every Interactive Element Must Work

Do not create decorative functionality.

Every visible interactive control must do something meaningful:

* buttons,
* links,
* dropdowns,
* checkboxes,
* toggles,
* forms,
* tabs,
* actions in menus.

An interaction should result in one or more of:

* a state change,
* navigation,
* UI update,
* saved data,
* modal/dialog behavior,
* clear user feedback through `notify(...)` or an equivalent existing mechanism.

Do not present controls as functional when their handlers do nothing.

---

## C. Immediate State and UI Consistency

For user actions such as:

* saving a user,
* changing a role,
* toggling a permission,
* switching an organization,
* updating a setting,

the prototype must:

1. Update application state.
2. Persist the relevant state.
3. Re-render affected UI elements immediately.

The user should not need to refresh the browser to see their own change.

---

## D. Use Human-Readable Domain Language

Do not expose internal implementation values directly to users.

Avoid displaying raw values such as:

* `solo-main`
* `dashboard.view`
* internal IDs
* database keys
* implementation-specific role identifiers

Map internal values to clear clinical or administrative language.

For example:

* `dashboard.view` → `View Dashboard`
* `solo-main` → `Solo Practice`
* internal scope identifiers → clear descriptions of what records the user can access

---

## E. Preserve Clear Information Hierarchy

When choices have a natural hierarchy, reflect that hierarchy in the UI.

For example:

> Organization Type → Specific Organization

Use contextual or cascading selection rather than presenting unrelated values in one large flat list.

Do not create unnecessary navigation depth, but do not flatten meaningful structure either.

---

## F. Explain Abstract Access Concepts

When the UI exposes concepts such as roles, permissions, or scopes, provide plain-language context where needed.

For example, scopes should make it clear whether a user can access:

* all patients in an organization,
* patients within a specific branch,
* only their assigned caseload.

Do not assume the user understands IAM terminology.

---

## G. Solo Practice and Multi-User Rules

Solo subscriptions are single-user and single-facility.

For solo organizations:

* Hide user invitation functionality.
* Hide multi-user or team management features.
* Hide the `Institution & Team` workspace where it is not applicable.

However, do not unnecessarily restrict the solo practitioner from managing their own applicable settings, access configuration, or role context.

The UI should reflect the actual organization model instead of showing irrelevant enterprise features.

---

# 3. Anti-Slop Code Standards

## Core Principle

Write the smallest, clearest implementation that correctly solves the stated problem while matching the existing style of the codebase.

Do not add complexity simply to make the implementation look more complete or enterprise-grade.

Before writing code, ask:

> Would a competent senior engineer working within this existing prototype actually write it this way?

If the solution looks more complicated than the problem requires, simplify it.

---

## Avoid Speculative Abstraction

Do not build a generic, configurable, or pluggable system when the project currently needs one concrete implementation.

Avoid:

* factories for single implementations,
* strategy patterns without multiple real strategies,
* configuration objects with unused options,
* generic utility layers used once,
* unnecessary wrapper functions.

Use abstraction when it removes real duplication or clarifies real complexity. Do not use it preemptively.

---

## Avoid Defensive Bloat

Handle failure modes that are realistic for the code being changed.

Do not:

* wrap every function in `try/catch`,
* validate values that are already guaranteed by the calling context,
* add null checks for values that cannot realistically be null,
* add generic error layers without a real failure mode.

Do not silently hide errors by returning:

* empty arrays,
* `null`,
* arbitrary defaults,

unless that behavior is explicitly correct for the feature.

A visible failure is often better than silently masking a bug.

---

## Avoid Comment Noise

Comments should explain **why**, not restate **what** the code already says.

Avoid comments like:

```js
// Increment counter
counter++;
```

Use comments only where intent, tradeoffs, domain reasoning, or non-obvious behavior need explanation.

Do not add decorative comment banners or large section dividers unless the existing file already uses that style.

---

## Match the Existing Codebase

Before modifying a file:

* inspect nearby code,
* follow its naming conventions,
* follow its DOM patterns,
* reuse existing helpers where appropriate,
* preserve the existing architecture.

Do not rewrite working code simply to impose a different coding style.

---

# 4. Verification Before Completing Work

Before declaring a task complete, verify the actual behavior affected by the change.

## Syntax

Run a syntax check on modified JavaScript files where applicable:

```bash
node -c path/to/file.js
```

## Functional Flow

Verify that the changed functionality:

1. Opens or initializes correctly.
2. Performs the intended action.
3. Updates application state.
4. Updates the affected UI.
5. Persists correctly where persistence is expected.
6. Still behaves correctly after a page reload.

Do not assume a button works because an event listener exists. Verify the resulting behavior.

## Clean Changes

Keep changes focused.

Do not:

* modify unrelated files,
* reformat unrelated code,
* rename unrelated variables,
* remove existing comments without reason,
* rewrite working sections unnecessarily.

A good change should make it easy to understand:

> What changed, why it changed, and what behavior it fixes or adds.
## The Frankenstein Application Principle

> **Do not build a Frankenstein application.**

A Frankenstein application is a product assembled from disconnected features, abstractions, components, and patterns that may each look reasonable individually but do not form a coherent system together.

AI agents are especially prone to this: adding a new component because it seems useful, introducing an abstraction because it seems reusable, or adding UI because a screen feels incomplete.

**Do not optimize for how much can be added. Optimize for coherence.**

Every change should answer three questions:

1. **Why does this exist?**
2. **Does it solve a current requirement?**
3. **Does it fit naturally into the existing system?**

If the answer is unclear, do not add it.

The goal of the HearIntel prototypes is not to demonstrate how many technologies, patterns, or features can be assembled. The goal is to produce a **small, coherent, believable product experience** that can be understood, tested, and evolved.

**Prefer a simple system that feels intentionally designed over a sophisticated system that feels assembled.**


