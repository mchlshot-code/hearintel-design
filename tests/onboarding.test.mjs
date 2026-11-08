import test from "node:test";
import assert from "node:assert/strict";
import {
  buildPayload,
  documents,
  uploadError,
  fileLimit,
  facilityPage,
  integrationIssue,
  previewDestination,
  firstIncompleteStage,
} from "../landing_page_prototype/onboarding-contract.mjs";
import { createPreviewSubmission } from "../landing_page_prototype/preview-submission.mjs";
const values = {
  fullName: "Adewale Example",
  email: "EXAMPLE@EXAMPLE.COM",
  product: "both",
  relationship: "new",
  services: ["Tympanometry"],
  registryAdminEmail: "REGISTRY@EXAMPLE.COM",
  pmsAdminEmail: "PMS@EXAMPLE.COM",
};
test("combined facility keeps one institutional request and independent representatives", () => {
  const p = buildPayload("facility", values);
  assert.equal(p.request_kind, "facility_both_onboarding");
  assert.equal(p.email, "example@example.com");
  assert.equal(
    p.application_data.representatives.registry_admin_email,
    "registry@example.com",
  );
  assert.equal(
    p.application_data.representatives.pms_admin_email,
    "pms@example.com",
  );
  assert.equal(p.requested_role_code, undefined);
});
test("Registry evidence follows completion contract without imposing PMS clickwrap", () => {
  const p = buildPayload("facility", { ...values, product: "registry" });
  assert.equal(p.application_data.pms_agreement_acceptance, undefined);
  assert.deepEqual(
    documents("facility", "registry", ["PTA"]).map((x) => x.kind),
    ["accreditation_certificate", "data_contribution_agreement"],
  );
  assert.equal(p.requested_role_code, "facility_registry_admin");
});
test("calibration evidence is conditional on active PMS services", () => {
  assert.deepEqual(
    documents("facility", "pms", []).map((x) => x.kind),
    ["accreditation_certificate"],
  );
  assert.deepEqual(
    documents("facility", "both", ["PTA"]).map((x) => x.kind),
    [
      "accreditation_certificate",
      "data_contribution_agreement",
      "calibration_logs",
    ],
  );
});
test("failed upload retries the retained request; duplicate clicks cannot create extra requests", async () => {
  const o = createPreviewSubmission(
    ["accreditation_certificate", "calibration_logs"],
    { failAt: "upload" },
  );
  await Promise.all([o.run(), o.run()]);
  assert.equal(o.state.requestCount, 1);
  assert.equal(o.state.confirmed, false);
  assert.match(o.state.error, /retained/);
  await o.run();
  assert.equal(o.state.requestCount, 1);
  assert.equal(o.state.confirmed, true);
  assert.deepEqual(o.state.uploadedKinds, [
    "accreditation_certificate",
    "calibration_logs",
  ]);
  await o.run();
  assert.equal(o.state.completeCount, 1);
});
test("failed confirmation does not upload files or create the application again", async () => {
  const o = createPreviewSubmission(["ethics_approval"], {
    failAt: "complete",
  });
  await o.run();
  assert.deepEqual(o.state.uploadedKinds, ["ethics_approval"]);
  assert.equal(o.state.confirmed, false);
  await o.run();
  assert.equal(o.state.confirmed, true);
  assert.equal(o.state.requestCount, 1);
  assert.equal(o.state.completeCount, 2);
});
test("document bounds and accepted MIME types match source contracts", () => {
  assert.equal(uploadError({ type: "application/pdf", size: fileLimit }), "");
  assert.match(
    uploadError({ type: "application/pdf", size: fileLimit + 1 }),
    /8 MiB/,
  );
  assert.match(uploadError({ type: "image/jpeg", size: 512 }, true), /PDF/);
  assert.match(
    uploadError({ type: "text/plain", size: 512 }),
    /PDF, JPEG or PNG/,
  );
});
test("preview facility pages stay bounded and preserve search results across navigation", () => {
  const p1 = facilityPage("", 0),
    p2 = facilityPage("", 5),
    last = facilityPage("", 10);
  assert.equal(p1.items.length, 5);
  assert.equal(p2.items.length, 5);
  assert.equal(last.items.length, 2);
  assert.notEqual(p1.items[0].facility_code, p2.items[0].facility_code);
  assert.equal(facilityPage("not found").total, 0);
});
test("solo request mismatch remains explicitly unresolved; access routing distinguishes Registry capability", () => {
  assert.match(integrationIssue("solo"), /does not accept/);
  assert.equal(integrationIssue("facility"), null);
  assert.equal(previewDestination("registry-contributor"), "registry-upload");
  assert.equal(previewDestination("registry-analyst"), "registry-dashboard");
  assert.equal(previewDestination("both"), "chooser");
  assert.equal(previewDestination("none"), "unassigned");
});

test("review revalidates new evidence after services are edited", () => {
  const v = {
    ...values,
    fullName: "Example Person",
    email: "example@example.com",
    facilityName: "Demo",
    organizationType: "private_provider",
    facilityType: "clinic",
    ownershipType: "private",
    accreditationStatus: "accredited",
    licenseNumber: "DEMO",
    accreditationId: "DEMO",
    countryId: "00000000-0000-4000-8000-000000000001",
    stateId: "00000000-0000-4000-8000-000000000002",
    lgaId: "00000000-0000-4000-8000-000000000004",
    address: "Demo",
    latitude: "7",
    longitude: "4",
    dpoName: "Example",
    dpoPhone: "08000000000",
    product: "pms",
  };
  const issue = firstIncompleteStage(
    "facility",
    v,
    { accreditation_certificate: { type: "application/pdf", size: 100 } },
    { accepted: true, authority: true, agreementLoaded: true },
  );
  assert.equal(issue.step, 3);
  assert.match(issue.message, /calibration/);
});
