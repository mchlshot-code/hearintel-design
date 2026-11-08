# HearIntel landing and onboarding — frontend handover

Review date: 8 November 2026. This is a frontend-only prototype for the existing live system. It never sends applications, calls live authentication, reads file contents, accepts legal terms, or grants access. All example identities, facilities and geography IDs are synthetic. The full existing PMS remains in `pms_prototype/`.

## Open and review

Run `npm run dev` from the repository root. The preview opens the new HearIntel landing. `landing_page_prototype/pms.html` preserves the previous PMS product presentation, connected to the new onboarding. The root prototype hub still links to the landing, PMS and authorization prototypes.

New UI uses the existing Figtree / DM Sans / JetBrains Mono families and Medical Ink palette. The original PMS root tokens were moved unchanged to `shared/medical-ink-tokens.css`; both public and clinical styles import this file. Existing clinical theme overrides remain in their original file. The supplied logo is used as an image, never redrawn. UI Peak informed spacing, alignment, restrained hierarchy and state coverage; its palette did not replace HearIntel tokens.

## Source authority

Read these current files before porting (main branches, reviewed 2026-11-08):

- Frontend: https://github.com/Gregz-tech/nadr-platform/blob/main/src/lib/api.js
- Submission coordinator: https://github.com/Gregz-tech/nadr-platform/blob/main/src/lib/onboarding.js
- Session destinations: https://github.com/Gregz-tech/nadr-platform/blob/main/src/lib/workspaceRouting.js
- Facility fields: https://github.com/Gregz-tech/nadr-platform/blob/main/src/pages/accessRequest/FacilityRegistration.jsx
- Solo fields: https://github.com/Gregz-tech/nadr-platform/blob/main/src/pages/accessRequest/SoloRegistration.jsx
- Research fields: https://github.com/Gregz-tech/nadr-platform/blob/main/src/pages/accessRequest/ResearcherRegistration.jsx
- Activation: `src/pages/auth/InitialPasswordSetup.jsx`, `StaffInvitationAcceptance.jsx`, `src/pages/pms/PmsWorkspaceContext.jsx`.
- Backend: https://github.com/Gregz-tech/HearIntel-backend/blob/main/src/platform/auth/http.ts
- Backend validation: `src/platform/auth/accountRequests.ts`, `documentUpload.ts`, `onboardingOptions.ts`, `pmsAgreement.ts`.

The checked code is evidence for request/response contracts, not proof of deployed environment configuration. Reconfirm branch/commit parity with the developer before integrating. Earlier architecture documents contain superseded phase statuses; do not infer current behavior from those statuses.

## Screen-to-API map

All endpoints are relative to the configured existing API base. Reuse the React application's existing API client; do not paste the vanilla prototype's simulation into the live application.

| Screen/action | Existing integration | Frontend behavior |
| --- | --- | --- |
| Product entry | Existing `/register/facility`, `/register/solo`, `/register/researcher` routes | Carry product intent into the screen. Query/route state is presentational and never grants access. Validate submitted product choice server-side as today. |
| Existing facility lookup | GET `/auth/onboarding/facilities?product=...&q=...` | Retain 250 ms debounce. Ignore stale results. Display safe names/codes. Affiliation still needs independent verification. |
| Country/State/LGA | GET `/auth/onboarding/geography` | One cached-in-flow response; cascade the selects. Discard child selections when a parent changes. Use returned IDs, not preview IDs. |
| PMS agreement | GET `/auth/onboarding/agreements/pms`, PDF route `/pdf` | Fetch the current version and exact text. No preselected acceptance. No synthetic agreement acceptance record. |
| Application creation | POST `/auth/account-requests` | Reuse `submitOnboardingRequest`, retaining its receipt/upload token recovery. Guard duplicate clicks. |
| Document upload | POST `/auth/account-requests/:id/documents/:kind` | Existing `x-hearintel-upload-token`, raw file body and content type; one document per request. Never include files in the JSON application payload. |
| Confirmation | POST `/auth/account-requests/:id/complete` | Success requires `submission_confirmed === true`. Missing documents remain an incomplete submission, not a success toast. |
| Receipt delivery | Completion response `receipt_email_status` | Submission and email delivery are different states. Do not assert an email was sent on failed/not_configured delivery. The current prototype does not simulate email delivery. |
| Add product for existing authorized facility | POST `/auth/facilities/:facilityId/product-requests`; GET `/auth/my/facility-product-requests`; evidence-summary/document routes | Retain authenticated workflow and exact facility. Do not register the facility again or reset an existing identity. This prototype explains entry; the authenticated product-request editor remains existing live functionality. |
| Sign-in destination | Supabase authentication then GET `/auth/me` | Reuse `postLoginDestination`. PMS → `/pms`; Registry contributor → submissions; authorized analyst → dashboard; dual product → chooser. Administrative precedence remains intact. |
| Invitation | Existing password setup, POST `/auth/staff-invitations/accept`, then fresh session context | First-time users use emailed password setup. Existing users sign in using the invited email. The prototype walks through these states without implementing auth. |

## Payload and document requirements

`onboarding-contract.mjs` mirrors the current frontend mapping and backend facility enum values. It is an inspectable prototype fixture, not another production source of truth. Every review screen includes an expandable developer panel showing its proposed payload.

Facility request kinds: `facility_pms_onboarding`, `facility_registry_onboarding`, `facility_both_onboarding`. Single-product role hints remain `facility_admin` or `facility_registry_admin`. A combined request records independent representative emails and does not imply access to both products. New/existing facility relationship is preserved in `application_data.facility_relationship`.

Required facility fields remain: contact, legal name, organization/facility/ownership/accreditation classifications, corporate registration and facility licence identifiers, country/state/LGA/address/coordinates, DPO contact, declared services. Reordering does not make required evidence optional.

- Every facility: `accreditation_certificate`.
- Registry or both: `data_contribution_agreement`.
- PMS or both with declared services: `calibration_logs`.
- PMS or both: current PMS processing-agreement acceptance and representative authority.
- Research: `registry_access`, academic identity/ORCID, project/ethics, requested tier, `ethics_approval` PDF. Requested tier is not a guarantee of access or analytical availability.
- Upload bounds: 5 bytes minimum; 8 MiB maximum per document; supported server MIME types PDF/JPEG/PNG. Backend content/signature validation remains authoritative. The research UI retains its PDF-only evidence choice.

## Verified integration findings

1. **Registry completion mismatch.** The live facility form currently omits the `data_contribution_agreement` upload even though `completeSubmission` requires it for Registry/both. The prototype adds this field and maps it to the existing upload kind. No new endpoint or agreement text is invented.
2. **Registry-only PMS clickwrap mismatch.** The live facility form requests the PMS agreement for all products. Backend submission validation requires PMS acceptance for PMS/both; the agreement states it covers PMS only. This prototype follows the backend contract: Registry-only uses its contribution evidence rather than PMS assent. Verify the live frontend correction with the developer; do not rewrite legal text.
3. **Solo request type mismatch.** The live solo form submits `solo_practice_onboarding`; the inspected backend `ACCOUNT_REQUEST_KINDS` does not include it. The backend does accept `pms_access`, but no equivalence has been established. Solo fields and review are available; submission is deliberately blocked. The developer must identify the deployed solo contract or correct the frontend mapping. No backend change has been made or presumed.
4. **Facility pagination not established.** Public lookup has product/q arguments; no verified paging response or cursor contract. The preview shows 12 synthetic facilities, 5 at a time, purely to demonstrate bounded navigation. Do not add invented `offset`/`cursor` arguments. For live lookup retain the current bound/search and discuss a real paging contract only if users need more results.
5. **Applicant status tracking not established.** No general anonymous application-tracking endpoint was verified. The success screen explains review and activation; it does not invent a status tracker, live approval poll, automatic approval, or approval ETA.
6. **Routing consistency.** `workspaceRouting.js` distinguishes Registry contributors from aggregate readers; `Launchpad.jsx` previously had a broader Registry-only dashboard redirect. Reuse the shared routing function when porting rather than duplicating authority/destination logic.

## Woven principles applied precisely

Read: `gpt.md`, `Chunking_principles.md`, `docs/engineering/REFRESH_CHUNKING.md`, `docs/product/ONBOARDING.md`, `docs/engineering/AI_ENGINEERING_QUALITY.md` from `adewalemchel-dotcom/woven`. These behavioral rules do not transplant Woven's palette, business loop, Next.js APIs or server architecture into HearIntel.

| Mechanism | What it means here | Implementation boundary |
| --- | --- | --- |
| Bounds | Cap document size, accepted formats, field length, lookup work and in-flight submission | Existing backend limits remain authority; early UI validation explains them. |
| Chunking | Divide one large logical workload into independently processable/retryable units | No large-workload chunking is needed for ordinary onboarding documents. Do not implement custom multipart or split a clinical transaction. |
| Pagination | Deliver growing collections a page at a time | Preserve existing PMS patient `limit/offset` and server search. Do not download all patients and filter locally. Directory preview paging is explicitly a simulation, not a new API contract. |
| Throttling | Control request frequency | Existing facility search debounce 250 ms; stale responses ignored. No continuous onboarding polling. |
| Concurrency | Limit simultaneous work | One submission at a time; existing sequential document uploads retained. |
| Batching | Group compatible independent work into fewer supported requests | Reuse `/auth/me` for coherent access context and the existing PMS dashboard snapshot. Geography is read once. `Promise.all` of independent reads is parallelism, not HTTP batching. Never combine uploads when the API has no batch contract. |
| Code splitting | Load genuinely separate features on demand | Landing does not load onboarding JavaScript. Reuse existing React route splitting; keep persistent PMS navigation mounted. |
| Refresh domains | Refresh only coherent state that changed | Submission response updates local state. After invitation acceptance refresh access context. No whole-app reload or one request/channel per panel. |
| Streaming | Deliver useful partial output | Not required for these application forms. Stage feedback is operation status, not streamed backend output. |

For PMS, patient/facility/encounter context must stay tied to current server-approved membership. Existing draft revision/concurrency boundaries stay intact. Never mark clinical data saved or finalized from a local-only flag. Patient directory, visit history, media and other growing collections must use existing scoped server queries and pagination. Preserve date-bounded appointment reads. Batch only through an existing supported endpoint. Backend retry/immutability rules remain unchanged. No PMS clinical screen or server code was rewritten in this increment.

## Port sequence

1. Import the approved visual treatment into the existing React landing/onboarding shell using Medical Ink tokens.
2. Carry product intent; remove repeat product questions. Preserve the generic product chooser for visitors without intent.
3. Reorganize existing fields, add stage validation and review/edit links. Keep payload values intact.
4. Add the missing Registry contribution upload; align product-specific agreements with the verified contract.
5. Keep `submitOnboardingRequest` as the submission coordinator. Drive visible stages from its actual asynchronous outcomes. Expose per-document progress with callbacks only if needed; do not duplicate receipt state.
6. Keep existing auth, invitation and membership providers. Resolve the solo mismatch before enabling solo submission.
7. Verify desktop and mobile, invalid fields, expired upload token, missing evidence, failed receipt delivery, interrupted submission, duplicate clicks, stale search and cross-product routing in the existing isolated test environment. Do not validate by creating real production applications.

## Preview coverage and limits

Working: product/path selection; existing/new facility; bounded fictional search, paging and empty results; preparation; stage validation; conditional documents; exact PMS agreement text; editable review; browser-local text draft/resume; upload-failure retry; confirmation-failure retry; confirmed submission without approval; sign-in destination and invitation walkthroughs; solo dependency block.

Not production-tested: deployed auth/permissions, real uploads, delivery, approval, full geography, actual directory paging, authenticated additional-product application, or clinical data performance. This build does not make those claims.

`npm test` verifies payload and evidence mapping, upload bounds, bounded pages, duplicate-click protection, upload/confirmation retry, routing distinctions and the explicit solo integration block.

## Latest direction and automatic location (8 November)

The live frontend main head was checked through connected GitHub: `200fae72a2605c6dc411f48ac29a5624473d639e` (6 November). A local Git pull of the private production repository has NOT succeeded because terminal Git has no authentication. This working branch belongs to `mchlshot-code/hearintel-design`, not `Gregz-tech/nadr-platform`. No production code or deployment has been changed. Future production work must be based on the then-current live branch and submitted as a separate PR; do not merge this vanilla prototype directly into the React application.

User clarified that the distinct mobile-system experience is not planned. Responsive public pages are retained, but no mobile PMS product design or native mobile workflow is included.

The facility Location stage now attempts one `getCurrentPosition` call on first entry when coordinates are empty. It uses a secure-context check, browser permission, high-accuracy hint, a 10-second acquisition timeout and no cached fix. It displays reported accuracy, supports retry/manual entry, never tracks continuously, and does not overwrite coordinates manually edited while the request was pending. Device location is not automatically assumed to be facility location. No coordinate-based reverse-geocoding or invented State/LGA inference is added. Coordinates still map to existing `application_data.location.latitude` / `longitude` fields. The current live form already has click-triggered geolocation; the change to automatic capture belongs in that existing frontend handler. This addition is syntax-checked, not verified using a person's real location. The HTTP local preview may require manual entry because geolocation requires a secure context.

Testing direction: stop the extended interactive browser matrix; use existing GitHub workflows for future production changes, with focused manual checks only where needed. Current main's Registry quality and invitation security runs were successful when checked; they do not validate this unported prototype. Existing `Frontend Integration CI` runs on PRs and covers dependency audit, Node tests and Vite build; it currently requires a self-hosted Linux runner. Do not rerun unrelated successful workflows or trigger deployments to test UI.

Worker evidence: backend `package.json` exposes `registry:projection:worker`, executing `src/scripts/registryProjectionWorker.ts`. This script calls `processNextRegistryProjection`, waits 5 seconds when idle, handles termination and checks a production ingestion gate. That proves worker code exists, not that a production worker service is currently deployed. The inspected frontend is Vite/React; a background Registry projector is not a browser worker or proof of Cloudflare Workers hosting.

## Repository synchronization boundary

The only owned HearIntel repository discovered on the connected accounts is the public `mchlshot-code/hearintel-design`. Gregz-tech/nadr-platform is private. Importing its complete source into this public repository would expose that source. No upstream application sync has been performed pending confirmation of the intended destination and visibility. Publishing the user's prototype changes is a separate, explicitly authorized action. Future live-site PRs remain deferred.
