// UI contract snapshot: Gregz-tech/nadr-platform and HearIntel-backend, main, 2026-11-08.
// Preview fixtures never establish identity, authority or production submission.
export const products = {
  pms: "Clinical PMS",
  registry: "HearIntel Registry",
  both: "PMS + Registry",
};
export const fileLimit = 8 * 1024 * 1024;
export const fileTypes = ["application/pdf", "image/jpeg", "image/png"];
const field = (name, label, type = "text", options = {}) => ({
  name,
  label,
  type,
  required: true,
  ...options,
});
export const organizationTypes = [
  ["hospital", "Hospital / health system"],
  ["clinic_network", "Clinic network"],
  ["government_agency", "Government agency"],
  ["university", "University / teaching institution"],
  ["research_institution", "Research institution"],
  ["ngo", "NGO / nonprofit"],
  ["private_provider", "Private healthcare provider"],
  ["professional_body", "Professional body"],
  ["other", "Other"],
];
export const facilityTypes = [
  ["hospital", "Hospital"],
  ["clinic", "Clinic / specialist centre"],
  ["screening_center", "Screening centre"],
  ["regional_referral", "Regional referral centre"],
  ["community", "Community / outreach facility"],
];
export const geography = {
  countries: [{ id: "00000000-0000-4000-8000-000000000001", name: "Nigeria" }],
  states: [
    { id: "00000000-0000-4000-8000-000000000002", name: "Osun" },
    { id: "00000000-0000-4000-8000-000000000003", name: "Lagos" },
  ],
  lgas: [
    {
      id: "00000000-0000-4000-8000-000000000004",
      state_id: "00000000-0000-4000-8000-000000000002",
      name: "Ila",
    },
    {
      id: "00000000-0000-4000-8000-000000000005",
      state_id: "00000000-0000-4000-8000-000000000003",
      name: "Ikeja",
    },
  ],
};
export const facilityExamples = Array.from({ length: 12 }, (_, i) => ({
  facility_code: "DEMO-" + String(i + 1).padStart(3, "0"),
  name: "Demonstration Hearing Centre " + String(i + 1).padStart(2, "0"),
  products: ["registry"],
  state: "Osun",
}));
export const serviceOptions = [
  "Pure Tone Audiometry (PTA)",
  "Tympanometry",
  "OAE Screening",
  "Diagnostic ABR",
  "Cochlear Implant Programme",
  "Hearing Aid Fitting",
];
export function stages(path) {
  return path === "researcher"
    ? [
        "Your identity",
        "Research project",
        "Requested access",
        "Documents",
        "Review",
      ]
    : path === "solo"
      ? [
          "Your identity",
          "Credentials",
          "Your practice",
          "Documents & terms",
          "Review",
        ]
      : [
          "Facility details",
          "Location",
          "Governance & services",
          "Documents & terms",
          "Review",
        ];
}
export function fields(path, step, values = {}) {
  const identity = [
    field("fullName", path === "facility" ? "Lead contact name" : "Full name"),
    field(
      "email",
      path === "researcher" ? "Institutional email" : "Email address",
      "email",
    ),
  ];
  if (path === "facility") {
    if (step === 0)
      return [
        ...identity,
        field("facilityName", "Facility legal name"),
        field("organizationType", "Organization type", "select", {
          options: organizationTypes,
        }),
        field("facilityType", "Facility type", "select", {
          options: facilityTypes,
        }),
        field("ownershipType", "Ownership", "select", {
          options: [
            ["public", "Public"],
            ["private", "Private"],
            ["charity", "Charity / nonprofit"],
            ["government", "Government"],
          ],
        }),
        field("accreditationStatus", "Accreditation status", "select", {
          options: [
            ["accredited", "Accredited / currently licensed"],
            ["provisional", "Provisional / pending full accreditation"],
          ],
        }),
        field("licenseNumber", "Corporate / registration number", "text", {
          max: 100,
        }),
        field(
          "accreditationId",
          "Facility licence / accreditation number",
          "text",
          { max: 100 },
        ),
        ...(values.product === "both"
          ? [
              field(
                "registryAdminEmail",
                "Registry administrator email",
                "email",
              ),
              field("pmsAdminEmail", "PMS administrator email", "email"),
            ]
          : []),
      ];
    if (step === 1) return locationFields(true);
    if (step === 2)
      return [
        field("dpoName", "Data protection officer name"),
        field("dpoPhone", "Data protection officer phone", "tel", { max: 32 }),
      ];
  }
  if (path === "solo") {
    if (step === 0)
      return [...identity, field("phone", "Phone number", "tel", { max: 32 })];
    if (step === 1)
      return [
        field(
          "licenceNumber",
          "Professional licence / registration number",
          "text",
          { max: 100 },
        ),
        field("issuingBody", "Issuing professional body"),
        field("expiryDate", "Credential expiry date", "date", {
          min: new Date().toISOString().slice(0, 10),
        }),
        field("degree", "Highest qualification"),
        field("institution", "Awarding institution"),
      ];
    if (step === 2)
      return [field("practiceName", "Practice name"), ...locationFields(false)];
  }
  if (path === "researcher") {
    if (step === 0)
      return [
        ...identity,
        field("orcidId", "ORCID ID"),
        field("institution", "Institutional affiliation"),
      ];
    if (step === 1)
      return [
        field("projectTitle", "Project title"),
        field("ethicsProtocol", "Ethics protocol number"),
        field("ethicsExpiry", "Ethics approval expiry", "date"),
      ];
    if (step === 2)
      return [
        field("requestedTier", "Requested data tier", "select", {
          options: [
            ["1", "Tier 1 · Aggregated statistics"],
            ["2", "Tier 2 · De-identified individual data"],
            ["3", "Tier 3 · Pseudonymized records"],
          ],
        }),
      ];
  }
  return [];
}
function locationFields(coords) {
  return [
    field("countryId", "Country", "select", {
      options: geography.countries.map((x) => [x.id, x.name]),
    }),
    field("stateId", "State", "select", {
      options: geography.states.map((x) => [x.id, x.name]),
    }),
    field("lgaId", "Local government area", "select"),
    field("address", "Street address", "textarea", { max: 500, wide: true }),
    ...(coords
      ? [
          field("latitude", "Facility latitude", "number", {
            min: -90,
            max: 90,
            step: "any",
          }),
          field("longitude", "Facility longitude", "number", {
            min: -180,
            max: 180,
            step: "any",
          }),
        ]
      : []),
  ];
}
export function documents(path, product, services = []) {
  if (path === "solo")
    return [
      {
        kind: "good_standing_certificate",
        label: "Certificate of good standing",
      },
    ];
  if (path === "researcher")
    return [
      {
        kind: "ethics_approval",
        label: "Ethics approval certificate",
        pdfOnly: true,
      },
    ];
  return [
    {
      kind: "accreditation_certificate",
      label: "Facility accreditation certificate",
    },
    ...(product !== "pms"
      ? [
          {
            kind: "data_contribution_agreement",
            label: "Signed data-contribution agreement",
          },
        ]
      : []),
    ...(product !== "registry" && services.length
      ? [{ kind: "calibration_logs", label: "Equipment calibration logs" }]
      : []),
  ];
}
const trim = (value) => String(value || "").trim();
const email = (value) => trim(value).toLowerCase();
const name = (list, id) => list.find((x) => x.id === id)?.name || "";
export function buildPayload(path, v) {
  const parts = trim(v.fullName).split(/\s+/),
    first_name = parts.shift() || "",
    last_name = parts.join(" ") || "Applicant";
  const shared = { email: email(v.email), first_name, last_name };
  const location = {
    country: name(geography.countries, v.countryId),
    country_id: v.countryId,
    state: name(geography.states, v.stateId),
    state_id: v.stateId,
    lga: name(geography.lgas, v.lgaId),
    lga_id: v.lgaId,
    address: trim(v.address),
  };
  const acceptance = {
    version: "1.0",
    accepted: true,
    authority_confirmed: true,
  };
  if (path === "researcher")
    return {
      ...shared,
      request_kind: "registry_access",
      organization_name: trim(v.institution),
      application_data: {
        applicant_type: "researcher",
        orcid_id: trim(v.orcidId),
        ethics: {
          project_title: trim(v.projectTitle),
          protocol_number: trim(v.ethicsProtocol),
          expiry_date: v.ethicsExpiry,
        },
        data_governance: { requested_tier: Number(v.requestedTier) },
      },
    };
  if (path === "solo")
    return {
      ...shared,
      phone: trim(v.phone),
      request_kind: "solo_practice_onboarding",
      organization_name: trim(v.practiceName),
      requested_role_code: "solo_practitioner",
      application_data: {
        applicant_type: "solo_practitioner",
        practice: {
          name: trim(v.practiceName),
          country_id: v.countryId,
          state_id: v.stateId,
          lga_id: v.lgaId,
          address: trim(v.address),
        },
        professional_credentials: {
          licence_number: trim(v.licenceNumber),
          issuing_body: trim(v.issuingBody),
          expiry_date: v.expiryDate,
        },
        education: {
          degree: trim(v.degree),
          institution: trim(v.institution),
          subspecialties: [],
        },
        pms_agreement_acceptance: acceptance,
      },
    };
  const payload = {
    ...shared,
    request_kind:
      v.product === "both"
        ? "facility_both_onboarding"
        : v.product === "pms"
          ? "facility_pms_onboarding"
          : "facility_registry_onboarding",
    organization_name: trim(v.facilityName),
    application_data: {
      facility_relationship: {
        mode: v.relationship,
        acknowledged: true,
        ...(v.relationship === "existing"
          ? { facility_code: v.facilityCode }
          : {}),
      },
      organization_type: v.organizationType,
      facility_type: v.facilityType,
      ownership_type: v.ownershipType,
      accreditation_status: v.accreditationStatus,
      license_number: trim(v.licenseNumber),
      accreditation_id: trim(v.accreditationId),
      location: {
        ...location,
        latitude: trim(v.latitude),
        longitude: trim(v.longitude),
      },
      governance: { dpo_name: trim(v.dpoName), dpo_phone: trim(v.dpoPhone) },
      services: v.services || [],
      ...(v.product !== "registry"
        ? { pms_agreement_acceptance: acceptance }
        : {}),
      ...(v.product === "both"
        ? {
            representatives: {
              registry_admin_email: email(v.registryAdminEmail),
              pms_admin_email: email(v.pmsAdminEmail),
            },
          }
        : {}),
    },
  };
  if (v.product !== "both")
    payload.requested_role_code =
      v.product === "registry" ? "facility_registry_admin" : "facility_admin";
  return payload;
}
export function integrationIssue(path) {
  return path === "solo"
    ? "The live solo form sends solo_practice_onboarding. The reviewed backend account-request enum does not accept it. Do not substitute pms_access without developer verification."
    : null;
}
export function firstIncompleteStage(
  path,
  values,
  files,
  { accepted = false, authority = false, agreementLoaded = false } = {},
) {
  for (let step = 0; step < 3; step++) {
    for (const f of fields(path, step, values)) {
      const value = String(values[f.name] ?? "").trim();
      if (f.required && !value)
        return { step, message: "Complete " + f.label.toLowerCase() + "." };
      if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return {
          step,
          message: "Enter a valid " + f.label.toLowerCase() + ".",
        };
      if (
        f.type === "number" &&
        (!Number.isFinite(Number(value)) ||
          Number(value) < f.min ||
          Number(value) > f.max)
      )
        return { step, message: "Check " + f.label.toLowerCase() + "." };
      if (f.options && !f.options.some((x) => x[0] === value))
        return {
          step,
          message: "Select a valid " + f.label.toLowerCase() + ".",
        };
      if (f.type === "date" && f.min && value < f.min)
        return {
          step,
          message: "Enter a current " + f.label.toLowerCase() + ".",
        };
    }
  }
  if (
    path !== "researcher" &&
    !geography.lgas.some(
      (x) => x.id === values.lgaId && x.state_id === values.stateId,
    )
  )
    return {
      step: path === "facility" ? 1 : 2,
      message: "Select the local government area for your state.",
    };
  for (const d of documents(path, values.product, values.services)) {
    const message = uploadError(files[d.kind], d.pdfOnly);
    if (message) return { step: 3, message: d.label + ": " + message };
  }
  if (
    path !== "researcher" &&
    values.product !== "registry" &&
    (!accepted || !authority || !agreementLoaded)
  )
    return {
      step: 3,
      message: "Review the PMS agreement and confirm both preview selections.",
    };
  return null;
}
export function facilityPage(query, offset = 0, pageSize = 5) {
  const matches = facilityExamples.filter(
    (x) =>
      x.name.toLowerCase().includes(query.toLowerCase()) ||
      x.facility_code.toLowerCase().includes(query.toLowerCase()),
  );
  return {
    items: matches.slice(offset, offset + pageSize),
    total: matches.length,
    offset,
    pageSize,
  };
}
export function uploadError(file, pdfOnly = false) {
  if (!file) return "Attach this document to continue.";
  if (
    !fileTypes.includes(file.type) ||
    (pdfOnly && file.type !== "application/pdf")
  )
    return pdfOnly
      ? "Choose a PDF document."
      : "Choose a PDF, JPEG or PNG document.";
  if (file.size < 5 || file.size > fileLimit)
    return "Choose a document from 5 bytes up to 8 MiB.";
  return "";
}
export function previewDestination(access) {
  return access === "both"
    ? "chooser"
    : access === "pms"
      ? "pms"
      : access === "registry-contributor"
        ? "registry-upload"
        : access === "registry-analyst"
          ? "registry-dashboard"
          : "unassigned";
}
