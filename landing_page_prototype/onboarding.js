import {
  products,
  stages,
  fields,
  documents,
  geography,
  serviceOptions,
  buildPayload,
  integrationIssue,
  facilityPage,
  uploadError,
  firstIncompleteStage,
} from "./onboarding-contract.mjs";
import { createPreviewSubmission } from "./preview-submission.mjs";

const screen = document.querySelector("#screen"),
  progress = document.querySelector("#progress"),
  notes = document.querySelector("#developer-notes");
const query = new URLSearchParams(location.search),
  draftKey = "hearintel_public_preview_v1";
const state = {
  product: products[query.get("product")] ? query.get("product") : "",
  path: ["facility", "solo", "researcher"].includes(query.get("path"))
    ? query.get("path")
    : "",
  view: query.get("view") || "choose",
  step: 0,
  values: {
    services: [],
    countryId: geography.countries[0].id,
    requestedTier: "1",
  },
  files: {},
  accepted: false,
  authority: false,
  relationship: "",
  facilityQuery: "",
  offset: 0,
  reviewReturn: false,
};
let operation = null,
  searchTimer = null,
  searchVersion = 0,
  agreementPromise = null,
  failAt = "";
const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const button = (text, action, primary = false) =>
  `<button type="button" class="e-btn${primary ? " primary" : ""}" data-action="${action}">${text}</button>`;
const choice = (title, description, key, value, selected = false) =>
  `<button type="button" class="e-choice" data-${key}="${value}" aria-pressed="${selected}"><span><strong>${title}</strong><p>${description}</p></span><span class="e-choice-mark" aria-hidden="true">${selected ? "Selected" : "Choose"}</span></button>`;
function persist() {
  try {
    sessionStorage.setItem(
      draftKey,
      JSON.stringify({
        product: state.product,
        path: state.path,
        step: state.step,
        values: state.values,
        relationship: state.relationship,
      }),
    );
  } catch {
    document
      .querySelector("#draft-note")
      ?.replaceChildren(
        "Draft storage is unavailable. Keep this tab open to retain your entries.",
      );
  }
}
function developer() {
  const payload = state.path
    ? buildPayload(state.path, {
        ...state.values,
        product: state.product,
        relationship: state.relationship,
      })
    : {};
  notes.innerHTML = `<p><strong>Local simulation.</strong> No network requests, emails, agreement acceptance or access grants occur. Use fictional details. File contents are never read.</p><p>Existing live routes: /register/facility, /register/solo, /register/researcher. Product intent is presentation state only.</p><p>API sequence: POST /auth/account-requests → POST /auth/account-requests/:id/documents/:kind (one document per request) → POST /auth/account-requests/:id/complete. Only submission_confirmed === true permits the success state.</p><p>Facility directory: GET /auth/onboarding/facilities?product=…&q=… · search debounce 250 ms, stale responses ignored. Preview pagination operates on 12 fictional facilities, 5 at a time. The live directory is bounded but has no verified paging contract: do not invent offset/cursor parameters.</p><p>Geography fixture includes only Osun and Lagos, with synthetic IDs. Live selects must use GET /auth/onboarding/geography. Cache the response within the flow; do not fetch the same geography for each select.</p><p>Agreement text is a source snapshot from GET /auth/onboarding/agreements/pms, v1.0. Registry-only requests require a contribution document, not PMS clickwrap, in the reviewed backend. The live facility form currently differs.</p>${integrationIssue(state.path) ? `<p><strong>Integration dependency:</strong> ${esc(integrationIssue(state.path))}</p>` : ""}<label for="failure-mode">Preview a recoverable failure</label><select id="failure-mode" class="e-btn" ${operation ? "disabled" : ""}><option value="">Successful submission</option><option value="upload" ${failAt === "upload" ? "selected" : ""}>First upload fails once</option><option value="complete" ${failAt === "complete" ? "selected" : ""}>Confirmation fails once</option></select><p>Prepared payload (fictional IDs; never sent):</p><pre>${esc(JSON.stringify(payload, null, 2))}</pre><a class="e-textlink" href="../docs/FRONTEND_HANDOVER.md">Read developer handover</a>`;
  notes.querySelector("select")?.addEventListener("change", (e) => {
    failAt = e.target.value;
  });
}
function title(heading, description, eyebrow = "") {
  return `${eyebrow ? `<div class="e-eyebrow">${eyebrow}</div>` : ""}<h1 tabindex="-1">${heading}</h1><p class="e-intro">${description}</p><div id="form-error" class="e-notice e-error" role="alert" hidden></div>`;
}
function render(focus = true) {
  clearTimeout(searchTimer);
  searchVersion++;
  document.querySelector("#rail-title").innerHTML = state.product
    ? esc(products[state.product])
    : "Your work.<br>The right workspace.";
  document.querySelector("#rail-description").textContent =
    state.path === "researcher"
      ? "Apply for a reviewed research scope."
      : state.product === "pms"
        ? "A focused workspace for everyday hearing care."
        : "Your application follows the access you need.";
  document.querySelector("#save-exit").hidden = state.view !== "form";
  document
    .querySelector(".e-rail")
    .classList.toggle("has-progress", state.view === "form");
  const completeThrough =
    state.view === "form"
      ? (firstIncompleteStage(
          state.path,
          { ...state.values, product: state.product },
          state.files,
          state,
        )?.step ?? 4)
      : 0;
  progress.innerHTML =
    state.view === "form"
      ? stages(state.path)
          .map(
            (label, i) =>
              `<li ${i === state.step ? 'aria-current="step"' : ""} class="${i < state.step && i < completeThrough ? "complete" : ""}"><span class="e-stepnum">${i + 1}</span><span class="step-label">${label}</span></li>`,
          )
          .join("")
      : "";
  if (state.view === "form") renderForm();
  else if (state.view === "prepare") renderPrepare();
  else if (state.view === "relationship") renderRelationship();
  else if (state.view === "submitting") renderOperation();
  else if (state.view === "success") renderSuccess();
  else if (state.view === "signin") renderSignin();
  else if (state.view === "invite") renderInvite();
  else renderChoose();
  developer();
  if (focus) screen.querySelector("h1")?.focus();
}
function renderChoose() {
  const productChoice = !state.product
    ? `<div class="e-options">${choice("Clinical PMS", "Manage patients, assessments and practice workflows.", "product", "pms")}${choice("HearIntel Registry", "Contribute facility data or apply for research access.", "product", "registry")}${choice("PMS + Registry", "Apply for both products for a new facility.", "product", "both")}</div>`
    : "";
  let pathways = "";
  if (state.product === "pms")
    pathways =
      choice(
        "A healthcare facility",
        "Apply on behalf of your clinic, hospital or hearing centre.",
        "path",
        "facility",
      ) +
      choice(
        "My independent practice",
        "Apply as a solo practitioner with a single-person workspace.",
        "path",
        "solo",
      );
  if (state.product === "registry")
    pathways =
      choice(
        "Contribute facility data",
        "Register your facility for Registry participation.",
        "path",
        "facility",
      ) +
      choice(
        "Apply for research access",
        "Request an approved scope for your research project.",
        "path",
        "researcher",
      );
  if (state.product === "both")
    pathways = choice(
      "A new healthcare facility",
      "One institutional application. Separate PMS and Registry decisions.",
      "path",
      "facility",
    );
  screen.innerHTML =
    title(
      state.product
        ? "How will you use " + products[state.product] + "?"
        : "Where would you like to start?",
      state.product
        ? "Choose the pathway that fits your work."
        : "Choose a product. We’ll ask only the questions for that pathway.",
      "Get started",
    ) +
    productChoice +
    `<div class="e-options">${pathways}</div>${state.product ? '<button class="e-plain" data-action="change-product">Change product</button>' : ""}<hr class="e-divider"><p class="e-hint">Already registered? <a class="e-textlink" href="signin.html">Sign in</a></p><p class="e-hint">Joining an existing team? <button class="e-plain" data-action="invite">Use your invitation</button></p>`;
  try {
    const saved = JSON.parse(sessionStorage.getItem(draftKey) || "null");
    if (saved?.path) {
      screen.insertAdjacentHTML(
        "beforeend",
        `<div class="e-notice"><strong>There is a draft on this browser.</strong><p>Continue your ${esc(products[saved.product])} application. Documents must be attached again.</p><button class="e-plain" data-action="resume">Resume saved draft</button><button class="e-plain" data-action="discard">Discard draft</button></div>`,
      );
    }
  } catch {
    /* An unreadable preview draft is not an application. */
  }
}
function renderRelationship() {
  screen.innerHTML =
    title(
      "Is your facility already on HearIntel?",
      "A facility is registered once. Access to PMS and Registry is approved separately.",
      products[state.product],
    ) +
    `<div class="e-options">${state.product !== "both" ? choice("Yes, it already uses HearIntel", "Find your facility to request the other product.", "relationship", "existing", state.relationship === "existing") : ""}${choice("No, this is a new facility", "Provide the facility’s details and evidence for review.", "relationship", "new", state.relationship === "new")}</div>${state.product === "both" ? '<p class="e-hint">For an existing facility, request the missing product from its current account.</p>' : ""}<div id="facility-search" ${state.relationship === "existing" ? "" : "hidden"}><div class="e-field"><label for="facility-query">Find your facility</label><input id="facility-query" type="search" maxlength="100" placeholder="Search by facility name or code" value="${esc(state.facilityQuery)}"><p class="e-hint">Preview results are fictional facilities.</p></div><div id="facility-results" aria-live="polite"></div></div><div class="e-notice"><p>${state.relationship === "existing" ? "Your affiliation will be checked with the facility. Selecting a facility does not grant access." : "Your facility’s identity and evidence will be reviewed before a workspace is activated."}</p><label class="e-check"><input type="checkbox" id="relationship-ack" ${state.values.relationshipAcknowledged ? "checked" : ""}><span>I understand and am authorized to apply for this facility.</span></label></div><div class="e-form-actions">${button("Back", "choose")}${button("Continue", "confirm-relationship", true)}</div>`;
  if (state.relationship === "existing") showFacilities();
  document.querySelector("#facility-query")?.addEventListener("input", (e) => {
    state.facilityQuery = e.target.value;
    state.offset = 0;
    const version = ++searchVersion;
    document.querySelector("#facility-results").innerHTML =
      '<p class="e-search-status" role="status">Searching facilities…</p>';
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      if (version === searchVersion) showFacilities();
    }, 250);
  });
}
function showFacilities() {
  const el = document.querySelector("#facility-results");
  if (!el) return;
  const page = facilityPage(state.facilityQuery, state.offset);
  el.innerHTML = page.items.length
    ? `<div class="e-search-results">${page.items.map((f) => choice(f.name, f.facility_code + " · " + f.state + " · fictional existing facility", "facility", f.facility_code, state.values.facilityCode === f.facility_code)).join("")}</div><div class="e-form-actions">${button("Previous results", "page-prev")}${button("Next results", "page-next")}</div><p class="e-search-status">${page.offset + 1}–${page.offset + page.items.length} of ${page.total} preview facilities</p>`
    : '<p class="e-empty">No facilities match this search. Try another name or code.</p>';
  const prev = el.querySelector("[data-action=page-prev]"),
    next = el.querySelector("[data-action=page-next]");
  if (prev) prev.disabled = state.offset === 0;
  if (next) next.disabled = state.offset + page.pageSize >= page.total;
}
function renderPrepare() {
  const docs = documents(state.path, state.product, state.values.services);
  screen.innerHTML =
    title(
      "Before you begin",
      state.path === "researcher"
        ? "Prepare the evidence for your research access request."
        : "Have these details ready. You can save your text entries and return on this browser.",
      products[state.product],
    ) +
    `<div class="e-review"><section><h2>What you’ll need</h2><ul>${(state.path === "facility" ? ["Facility identity and registration details", "Facility address, coordinates and main contact", "Data protection officer details"] : state.path === "solo" ? ["Your contact details and current professional credentials", "Your qualification and practice location"] : ["Your ORCID and institutional affiliation", "Your project and ethics approval details"]).map((x) => `<li>${x}</li>`).join("")}${docs.map((x) => `<li>${x.label}</li>`).join("")}${state.path === "facility" && state.product !== "registry" ? "<li>Calibration logs if you declare active clinical services</li>" : ""}</ul></section></div><div class="e-notice"><strong>Application is followed by review.</strong><p>Submitting your details does not activate product access. Activation instructions follow approval.</p></div>${state.path === "solo" ? '<p class="e-hint">This preview lets you review the complete solo journey. Submission is pending verification of the existing solo integration.</p>' : ""}<p class="e-hint">Use fictional information in this preview. File contents stay on your device.</p><div class="e-form-actions">${button("Back", "back-path")}${button("Begin application", "begin", true)}</div>`;
}
function fieldHtml(f) {
  const value = state.values[f.name] ?? "",
    id = "field-" + f.name,
    attributes = `id="${id}" name="${f.name}" ${f.required ? "required" : ""} ${f.min !== undefined ? `min="${f.min}"` : ""} ${f.max !== undefined && f.type === "number" ? `max="${f.max}"` : ""} ${f.step ? `step="${f.step}"` : ""} maxlength="${f.max || 255}" aria-describedby="${id}-error"`;
  let options = f.options || [];
  if (f.name === "lgaId")
    options = geography.lgas
      .filter((x) => x.state_id === state.values.stateId)
      .map((x) => [x.id, x.name]);
  let control =
    f.type === "select"
      ? `<select ${attributes} ${f.name === "lgaId" && !state.values.stateId ? "disabled" : ""}><option value="">Select ${esc(f.label.toLowerCase())}</option>${options.map(([key, label]) => `<option value="${esc(key)}" ${value === key ? "selected" : ""}>${esc(label)}</option>`).join("")}</select>`
      : f.type === "textarea"
        ? `<textarea ${attributes} rows="3">${esc(value)}</textarea>`
        : `<input ${attributes} type="${f.type}" value="${esc(value)}" ${f.type === "email" ? 'autocomplete="email"' : f.type === "tel" ? 'autocomplete="tel"' : ""}>`;
  if (f.name === "facilityName" && state.relationship === "existing")
    control = `<input ${attributes} value="${esc(value)}" readonly>`;
  return `<div class="e-field ${f.wide ? "wide" : ""}"><label for="${id}">${esc(f.label)}</label>${control}<p id="${id}-error" class="e-field-error" hidden></p></div>`;
}
function renderForm() {
  const labels = stages(state.path),
    descriptions =
      state.path === "facility"
        ? [
            "Tell us who is applying and identify the facility.",
            "Use the facility’s actual location, rather than your current location if you are elsewhere.",
            "Provide your responsible contact and declare the services available at this facility.",
            "Attach the evidence required for your selected product.",
            "Check your details before sending your application.",
          ]
        : state.path === "solo"
          ? [
              "Your contact details will be used for your application.",
              "Provide your professional registration and qualification.",
              "Tell us where your independent practice operates.",
              "Attach your professional evidence and review the PMS agreement.",
              "Check your details before your application proceeds.",
            ]
          : [
              "Tell us who is requesting access.",
              "Provide the project and ethics approval information.",
              "Choose the scope you are requesting. It remains subject to review.",
              "Attach the ethics evidence for your project.",
              "Check your request before submitting it for review.",
            ];
  screen.innerHTML =
    title(
      labels[state.step],
      descriptions[state.step],
      products[state.product] +
        " · " +
        (state.path === "solo"
          ? "Solo practice"
          : state.path === "researcher"
            ? "Research access"
            : "Facility application"),
    ) +
    `<form id="application-form" novalidate><div id="stage-content"></div><div class="e-form-actions"><div>${button("Back", "back")}${state.step === 4 ? "" : button("Save & exit", "save")}</div><button type="submit" class="e-btn primary">${state.step === 4 ? (state.path === "solo" ? "Check integration readiness" : "Submit preview application") : state.reviewReturn ? "Save & return to review" : "Continue"}</button></div><p class="e-hint" id="draft-note">Text entries are saved on this browser. Files and agreement selections must be provided again after reopening.</p></form>`;
  const content = screen.querySelector("#stage-content");
  if (state.step === 4) content.innerHTML = reviewHtml();
  else {
    content.innerHTML = `<div class="e-formgrid">${fields(
      state.path,
      state.step,
      { ...state.values, product: state.product },
    )
      .map(fieldHtml)
      .join("")}</div>`;
    if (state.path === "facility" && state.step === 2)
      content.insertAdjacentHTML(
        "beforeend",
        `<fieldset class="e-fieldset"><legend>Services currently available and calibrated</legend>${serviceOptions.map((s) => `<label class="e-check"><input type="checkbox" name="services" value="${esc(s)}" ${(state.values.services || []).includes(s) ? "checked" : ""}><span>${s}</span></label>`).join("")}</fieldset><p class="e-hint">${state.product === "registry" ? "Registry participation does not require adopting PMS." : "Declaring active services requires calibration logs in the next step."}</p>`,
      );
    if (state.step === 3) content.innerHTML = documentsHtml();
    if (state.path === "facility" && state.step === 1) {
      content.insertAdjacentHTML("afterbegin", `<div class="e-notice"><strong>Use the facility’s location</strong><p>We can fill the coordinates from your device with your permission. If you are elsewhere, enter the facility’s coordinates instead.</p><p id="location-status" role="status">Ready to request your current location.</p><button type="button" class="e-btn small" id="capture-location">Use current location</button></div>`);
      screen.querySelector("#capture-location").addEventListener("click", captureLocation);
      if (!state.locationAttempted && !state.values.latitude && !state.values.longitude) captureLocation();
    }
  }
  screen.querySelector("#application-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateStage()) {
      if (state.step === 4) submit();
      else {
        state.step = state.reviewReturn ? 4 : state.step + 1;
        state.reviewReturn = false;
        persist();
        render();
      }
    }
  });
  if (
    state.step === 3 &&
    state.product !== "registry" &&
    state.path !== "researcher"
  )
    loadAgreement();
}
function captureLocation() {
  const status = screen.querySelector("#location-status");
  const control = screen.querySelector("#capture-location");
  if (!status || state.locating) return;
  state.locationAttempted = true;
  if (!window.isSecureContext || !navigator.geolocation) {
    status.textContent = "Automatic location needs a secure connection and a supported browser. You can enter the coordinates manually.";
    return;
  }
  const before = {latitude: state.values.latitude, longitude: state.values.longitude};
  state.locating = true;
  control.disabled = true;
  status.textContent = "Waiting for location permission or a location fix…";
  navigator.geolocation.getCurrentPosition(position => {
    state.locating = false;
    if (state.view !== "form" || state.path !== "facility" || state.step !== 1) return;
    const current = screen.querySelector("#location-status");
    const button = screen.querySelector("#capture-location");
    if (button) button.disabled = false;
    if (state.values.latitude !== before.latitude || state.values.longitude !== before.longitude) {
      if (current) current.textContent = "Your manual coordinates were kept. Use current location again if you want to replace them.";
      return;
    }
    state.values.latitude = position.coords.latitude.toFixed(5);
    state.values.longitude = position.coords.longitude.toFixed(5);
    for (const name of ["latitude", "longitude"]) screen.querySelector(`[name="${name}"]`).value = state.values[name];
    if (current) current.textContent = `Coordinates filled. Reported accuracy: about ${Math.ceil(position.coords.accuracy)} metres. Check that this is the facility’s location.`;
    developer();
  }, locationError => {
    state.locating = false;
    if (state.view !== "form" || state.path !== "facility" || state.step !== 1) return;
    const current = screen.querySelector("#location-status");
    const button = screen.querySelector("#capture-location");
    if (button) button.disabled = false;
    if (current) current.textContent = locationError.code === 1 ? "Location permission was not granted. Enter the coordinates manually or enable location permission and retry." : locationError.code === 3 ? "Finding your location took too long. Retry or enter the coordinates manually." : "Your current location is unavailable. Retry or enter the coordinates manually.";
  }, {enableHighAccuracy: true, timeout: 10000, maximumAge: 0});
}
function documentsHtml() {
  return `<div class="e-notice"><p>Documents: PDF, JPEG or PNG, up to 8 MiB each. Research ethics evidence uses PDF.</p><p>Only filenames are shown in this preview; no files are uploaded.</p></div>${documents(
    state.path,
    state.product,
    state.values.services,
  )
    .map(
      (d) =>
        `<div class="e-doc e-field"><label for="doc-${d.kind}">${d.label}</label><input id="doc-${d.kind}" type="file" name="${d.kind}" accept="${d.pdfOnly ? ".pdf" : ".pdf,.jpg,.jpeg,.png"}" aria-describedby="doc-${d.kind}-error"><p class="e-hint" id="file-${d.kind}">${state.files[d.kind] ? esc(state.files[d.kind].name) : "No document attached"}</p><p id="doc-${d.kind}-error" class="e-field-error" hidden></p></div>`,
    )
    .join(
      "",
    )}${state.path !== "researcher" && state.product !== "registry" ? `<div class="e-doc"><details><summary>PMS Data Processing Agreement · version 1.0</summary><p class="e-hint">Effective 27 September 2026 · source text for review only.</p><div id="agreement-content" class="e-terms" role="region" aria-label="PMS agreement" tabindex="0"><p role="status">Loading agreement…</p></div></details><label class="e-check"><input id="authority" type="checkbox" ${state.authority ? "checked" : ""}><span>For this preview, confirm the representative’s authority to accept on behalf of the practice or facility.</span></label><label class="e-check"><input id="agreement-accept" type="checkbox" ${state.accepted ? "checked" : ""}><span>Preview the selection: I have read and agree to the PMS Data Processing Agreement v1.0.</span></label><p class="e-hint">These preview selections do not constitute legal acceptance.</p></div>` : ""}`;
}
function loadAgreement() {
  if (!agreementPromise)
    agreementPromise = fetch("agreement.json")
      .then((r) => {
        if (!r.ok) throw new Error("Agreement unavailable");
        return r.json();
      })
      .catch((error) => {
        agreementPromise = null;
        throw error;
      });
  agreementPromise
    .then((a) => {
      const el = screen.querySelector("#agreement-content");
      if (el)
        el.innerHTML = a.sections
          .map(
            (s) =>
              `<h3>${esc(s.heading)}</h3>${s.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}`,
          )
          .join("");
      state.agreementLoaded = true;
    })
    .catch(() => {
      const el = screen.querySelector("#agreement-content");
      if (el)
        el.innerHTML =
          '<p role="alert">The agreement could not be loaded.</p><button type="button" class="e-plain" data-action="retry-agreement">Retry agreement</button>';
      state.agreementLoaded = false;
    });
}
function reviewHtml() {
  return `<div class="e-review">${stages(state.path)
    .slice(0, 4)
    .map(
      (label, i) =>
        `<section><header><h2>${label}</h2><button type="button" class="e-plain" data-edit="${i}" aria-label="Change ${label.toLowerCase()}">Change</button></header><dl>${fields(
          state.path,
          i,
          { ...state.values, product: state.product },
        )
          .map((f) => {
            let value = state.values[f.name];
            if (f.type === "select") {
              let options =
                f.options || geography.lgas.map((x) => [x.id, x.name]);
              value = options.find((x) => x[0] === value)?.[1] || value;
            }
            return `<dt>${f.label}</dt><dd>${esc(value || "Not provided")}</dd>`;
          })
          .join(
            "",
          )}${i === 2 && state.path === "facility" ? `<dt>Services</dt><dd>${esc(state.values.services.join(", ") || "None declared")}</dd>` : ""}${
          i === 3
            ? documents(state.path, state.product, state.values.services)
                .map(
                  (d) =>
                    `<dt>${d.label}</dt><dd>${esc(state.files[d.kind]?.name || "Attach again")}</dd>`,
                )
                .join("")
            : ""
        }${i === 3 && state.path !== "researcher" && state.product !== "registry" ? "<dt>PMS terms</dt><dd>Version 1.0 · preview selection only</dd>" : ""}</dl></section>`,
    )
    .join(
      "",
    )}</div><div class="e-notice"><strong>${state.product === "both" ? "One facility. Separate product decisions." : "Submission is followed by review."}</strong><p>${state.product === "both" ? "PMS and Registry can have different representatives and approval outcomes." : "We will explain the next step after your application is confirmed."}</p></div>`;
}
function error(message, control = null) {
  const el = document.querySelector("#form-error");
  el.hidden = false;
  el.textContent = message;
  if (control) {
    control.setAttribute("aria-invalid", "true");
    const hint = document.querySelector("#" + control.id + "-error");
    if (hint) {
      hint.textContent = message;
      hint.hidden = false;
    }
    control.focus();
  } else {
    el.tabIndex = -1;
    el.focus();
  }
}
function validateStage() {
  const inputs = [...screen.querySelectorAll("#application-form [required]")];
  for (const input of inputs) {
    if (!input.checkValidity()) {
      error(
        input.validity.valueMissing
          ? "Complete " + input.labels?.[0]?.textContent.toLowerCase() + "."
          : input.validationMessage,
        input,
      );
      return false;
    }
  }
  if (state.step === 3) {
    for (const d of documents(
      state.path,
      state.product,
      state.values.services,
    )) {
      const message = uploadError(state.files[d.kind], d.pdfOnly);
      if (message) {
        error(d.label + ": " + message, screen.querySelector("#doc-" + d.kind));
        return false;
      }
    }
    if (
      state.path !== "researcher" &&
      state.product !== "registry" &&
      (!state.agreementLoaded || !state.accepted || !state.authority)
    ) {
      error(
        "Load and review the agreement, then confirm both preview selections.",
      );
      return false;
    }
  }
  return true;
}
function submit() {
  const missing = firstIncompleteStage(
    state.path,
    { ...state.values, product: state.product },
    state.files,
    state,
  );
  if (missing) {
    state.step = missing.step;
    render();
    error(missing.message);
    return;
  }
  const issue = integrationIssue(state.path);
  if (issue) {
    error(
      "The solo screens are ready for review. Submission is paused until the existing solo integration is verified. See Developer review for the exact mismatch.",
    );
    return;
  }
  state.view = "submitting";
  operation = createPreviewSubmission(
    documents(state.path, state.product, state.values.services).map(
      (d) => d.kind,
    ),
    {
      failAt,
      delay: 450,
      onChange: () => {
        if (operation?.state.confirmed) {
          state.view = "success";
          try {
            sessionStorage.removeItem(draftKey);
          } catch {}
          render();
        } else {
          renderOperation();
          developer();
        }
      },
    },
  );
  render();
  operation.run();
}
function renderOperation() {
  const s = operation?.state || {},
    docs = documents(state.path, state.product, state.values.services);
  screen.innerHTML =
    title(
      "Sending your application",
      s.error
        ? "Your progress is retained. Retry the remaining step."
        : "Keep this page open while the application and documents are confirmed.",
      "Local submission preview",
    ) +
    `<ol class="e-operation" aria-live="polite"><li><strong>Create application</strong><span>${s.requestCreated ? "Complete" : "Waiting"}</span></li>${docs.map((d) => `<li><strong>${d.label}</strong><span>${s.uploadedKinds?.includes(d.kind) ? "Complete" : "Waiting"}</span></li>`).join("")}<li><strong>Confirm submission</strong><span>${s.confirmed ? "Complete" : "Waiting"}</span></li></ol>${s.error ? `<div role="alert" class="e-notice e-error">${esc(s.error)}</div><div class="e-actions">${button("Retry remaining step", "retry-submit", true)}${button("Start a new preview", "new")}</div>` : '<p role="status">Processing this local preview…</p>'}<p class="e-hint">No request or document has been sent to HearIntel.</p>`;
}
function renderSuccess() {
  screen.innerHTML =
    title(
      "Application submitted for review",
      "This preview has reached confirmed submission. Product access is not activated.",
      "Submission preview complete",
    ) +
    `<div class="e-notice"><strong>What happens next</strong><p>${state.path === "researcher" ? "Your research purpose, evidence and requested scope are reviewed." : state.product === "both" ? "Your facility evidence is reviewed. PMS and Registry access are decided separately for their nominated representatives." : "Your evidence and requested " + products[state.product] + " access are reviewed."}</p><p>After approval, follow the activation instructions sent by email.</p></div><div class="e-steps"><div><span class="e-number">01</span><h3>Submitted</h3><p>Application and required documents confirmed.</p></div><div><span class="e-number">02</span><h3>Review</h3><p>No workspace access is granted at this stage.</p></div><div><span class="e-number">03</span><h3>Activate</h3><p>Use your invitation after approval.</p></div></div><div class="e-form-actions"><a class="e-btn" href="index.html">Back to HearIntel</a>${button("Preview another pathway", "new", true)}</div>`;
}
function renderSignin() {
  location.replace("signin.html");
}
function renderInvite() {
  screen.innerHTML =
    title(
      "Join your assigned workspace",
      "Use the invitation sent by your facility administrator. You do not need to register the facility again.",
      "Staff invitation preview",
    ) +
    `<div class="e-review"><section><h2>Fictional invitation example</h2><dl><dt>Product</dt><dd>Clinical PMS</dd><dt>Facility</dt><dd>Demonstration Hearing Centre</dd><dt>Role</dt><dd>Audiologist</dd><dt>Location</dt><dd>Assigned clinical location</dd></dl></section></div><div class="e-options">${choice("I already have a HearIntel account", "Sign in with the exact email that received the invitation.", "invite", "existing")}${choice("This is my first HearIntel account", "Use the password-setup link sent in your invitation email.", "invite", "new")}</div><div id="invite-next" aria-live="polite"></div><p class="e-hint">Your assigned role and facility come from verified access. Contact the administrator if they are incorrect.</p>`;
}
document.addEventListener("input", (e) => {
  if (
    e.target.closest("#application-form") &&
    e.target.name &&
    e.target.type !== "file" &&
    e.target.type !== "checkbox"
  ) {
    state.values[e.target.name] = e.target.value;
    persist();
  }
});
document.addEventListener("change", (e) => {
  if (!e.target.closest("#application-form")) return;
  if (e.target.type === "file") {
    const d = documents(state.path, state.product, state.values.services).find(
        (d) => d.kind === e.target.name,
      ),
      file = e.target.files[0],
      message = uploadError(file, d?.pdfOnly);
    if (message) {
      state.files[e.target.name] = null;
      error(message, e.target);
    } else {
      state.files[e.target.name] = file;
      screen.querySelector("#file-" + e.target.name).textContent = file.name;
      const err = screen.querySelector("#doc-" + e.target.name + "-error");
      err.hidden = true;
      e.target.removeAttribute("aria-invalid");
    }
    return;
  }
  if (e.target.name === "services")
    state.values.services = [
      ...screen.querySelectorAll("[name=services]:checked"),
    ].map((x) => x.value);
  else if (e.target.id === "authority") state.authority = e.target.checked;
  else if (e.target.id === "agreement-accept")
    state.accepted = e.target.checked;
  else if (e.target.name) {
    state.values[e.target.name] = e.target.value;
    if (e.target.name === "stateId") {
      state.values.lgaId = "";
      const old = screen.querySelector("[name=lgaId]");
      const wrapper = old.closest(".e-field");
      wrapper.outerHTML = fieldHtml(
        fields(state.path, state.step).find((f) => f.name === "lgaId"),
      );
    }
  }
  persist();
  developer();
});
document.addEventListener("click", (e) => {
  const product = e.target.closest("[data-product]"),
    path = e.target.closest("[data-path]"),
    relationship = e.target.closest("[data-relationship]"),
    facility = e.target.closest("[data-facility]"),
    edit = e.target.closest("[data-edit]"),
    invite = e.target.closest("[data-invite]");
  if (product) {
    state.product = product.dataset.product;
    state.view = "choose";
    render();
    return;
  }
  if (path) {
    state.path = path.dataset.path;
    if (state.path === "solo") state.product = "pms";
    state.view = state.path === "facility" ? "relationship" : "prepare";
    render();
    return;
  }
  if (relationship) {
    state.relationship = relationship.dataset.relationship;
    state.values.relationshipAcknowledged = false;
    state.values.facilityCode = "";
    if (state.relationship === "new") state.values.facilityName = "";
    render();
    return;
  }
  if (facility) {
    const f = facilityPage("", 0, 12).items.find(
      (f) => f.facility_code === facility.dataset.facility,
    );
    state.values.facilityCode = f.facility_code;
    state.values.facilityName = f.name;
    showFacilities();
    return;
  }
  if (edit) {
    state.step = Number(edit.dataset.edit);
    state.reviewReturn = true;
    render();
    return;
  }
  if (invite) {
    document.querySelector("#invite-next").innerHTML =
      `<div class="e-notice"><strong>${invite.dataset.invite === "existing" ? "Sign in, then verify the invitation" : "Open your password-setup email"}</strong><p>${invite.dataset.invite === "existing" ? "The existing staff acceptance endpoint checks the signed-in recipient before activating the assignment." : "Create your password using the email link. Access is resolved only after the assigned invitation is accepted."}</p><p>This is a walkthrough. No access has been granted.</p></div>`;
    return;
  }
  const action = e.target.closest("[data-action]")?.dataset.action;
  if (!action) return;
  if (action === "change-product") {
    state.product = "";
    state.path = "";
    state.view = "choose";
  }
  if (action === "choose") {
    state.view = "choose";
  }
  if (action === "confirm-relationship") {
    if (!state.relationship)
      return error("Choose whether your facility is new or existing.");
    if (state.relationship === "existing" && !state.values.facilityCode)
      return error("Select the existing facility.");
    if (!document.querySelector("#relationship-ack").checked)
      return error("Confirm your authority to apply before continuing.");
    state.values.relationshipAcknowledged = true;
    state.view = "prepare";
  }
  if (action === "begin") {
    state.view = "form";
    state.step = 0;
    persist();
  }
  if (action === "back-path") {
    state.view = state.path === "facility" ? "relationship" : "choose";
  }
  if (action === "back") {
    if (state.step === 0) state.view = "prepare";
    else state.step--;
    persist();
  }
  if (action === "save") {
    persist();
    state.view = "choose";
  }
  if (action === "resume") {
    try {
      const saved = JSON.parse(sessionStorage.getItem(draftKey));
      Object.assign(state, {
        ...saved,
        view: "form",
        files: {},
        accepted: false,
        authority: false,
        reviewReturn: false,
      });
      if (state.step === 4) state.step = 3;
    } catch {
      return error("This draft could not be opened. Start a new preview.");
    }
  }
  if (action === "discard") {
    sessionStorage.removeItem(draftKey);
  }
  if (action === "page-next") {
    state.offset += 5;
    showFacilities();
    return;
  }
  if (action === "page-prev") {
    state.offset = Math.max(0, state.offset - 5);
    showFacilities();
    return;
  }
  if (action === "retry-agreement") {
    loadAgreement();
    return;
  }
  if (action === "retry-submit") {
    operation.run();
    return;
  }
  if (action === "new") {
    location.href = "access.html";
    return;
  }
  if (action === "invite") {
    state.view = "invite";
  }
  render();
});
document.querySelector("#save-exit").addEventListener("click", () => {
  persist();
  state.view = "choose";
  render();
});
if (state.path) {
  if (state.path === "solo") state.product = "pms";
  if (state.path === "researcher") state.product = "registry";
  state.view = state.path === "facility" ? "relationship" : "prepare";
}
render(false);
