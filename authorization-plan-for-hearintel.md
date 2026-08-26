# HearIntel PMS — Authorization, Organization & Identity Design Brief

> Combined design brief. Diagnostic/analysis phase only — **do not implement, migrate, or modify code** until this has been reviewed and approved.

---

## Table of Contents

**Part 1 — Authorization & Organization Model**
1. Core Authorization Model
2. Organization Model
3. Clinical Workflow
4. Initial Roles
5. Role vs Scope
6. Multi-Branch Clinics
7. University Support
8. Solo Practitioners
9. Device / Session Management
10. Patient Access
11. Workflow States
12. Security and Clinical Governance
13. Deliverables Requested (Diagnostic/Design Document)
14. Implementation Rule

**Part 2 — Identity, Organization & Cross-Organization Access**
1. Important Architectural Distinction
2. Individual User Accounts
3. Organization Invitations
4. Multi-Branch Organizations
5. Cross-Branch Access
6. Global Patient Identity
7. MRN Design
8. Patient Identity vs Clinical Record
9. Cross-Organization Patient Discovery
10. Cross-Organization Access
11. Patient Consent
12. Break-Glass Access
13. Cross-Organization Data Isolation
14. No Duplicate Patient Records
15. Patient Registration Flow
16. Patient Relationship with Organizations
17. Device and Session Management
18. Audit Trail
19. Deliverables Requested (Identity/Access Document)
20. Very Important: Do Not Implement Yet

---

# Part 1 — Authorization & Organization Model

I want you to work on the authorization and organization model for the HearIntel PMS.

**IMPORTANT:** Do NOT immediately start changing the implementation.

First inspect the existing PMS architecture, authentication, user model, database schema, routing, and any existing role/permission logic. Understand what is already there before proposing changes.

The goal is to design a scalable authorization model for the PMS that supports clinics, multiple branches, solo practitioners, hospitals, and universities without creating separate authentication systems for each.

## 1. Core Authorization Model

I want HearIntel authorization to be based on four concepts:

- **IDENTITY** — Who is the user?
- **ORGANIZATION** — Which organization does the user belong to?
- **ROLE** — What is the user allowed to do?
- **SCOPE** — Which branch/location/patients are they allowed to access?

The conceptual model should therefore be:

```
User
→ Organization
→ Role
→ Scope
→ Permissions
```

Do not make authorization primarily device-based.

## 2. Organization Model

The organization should own the HearIntel subscription.

An organization could be:
- Clinic
- Hospital
- University
- Research institution
- Solo practice

Do not create completely separate authorization architectures for each organization type. Instead, use a common Organization model with an organization type where necessary.

A clinic may have multiple branches:

```
Organization
├── Branch A
├── Branch B
└── Branch C
```

A university may have:

```
University
├── Audiology Clinic
├── Teaching / Training
└── Research
```

A solo practitioner should simply be a very small organization:

```
Solo Practice
└── Owner / Audiologist
```

Do not build "solo practitioner mode" as an entirely separate system.

## 3. Clinical Workflow

The initial PMS workflow should support:

```
Patient
→ Registration
→ Appointment
→ Check-in
→ Queue
→ Audiologist
→ Assessment
→ Clinical review
→ Lead Audiologist
→ Sign-off
→ Report / Management
→ Follow-up
```

The person registering a patient should NOT automatically have the same access as the clinician treating that patient.

The workflow should be reflected in authorization and patient visibility.

## 4. Initial Roles

Design the authorization model around at least these roles:

### RECEPTIONIST
Typical permissions:
- Register patients
- Search patients
- Manage demographic/administrative information
- Book appointments
- Check patients in
- Manage queue
- View appointment status

Should generally NOT have access to:
- Clinical assessments
- Audiograms
- Clinical notes
- Diagnosis
- Clinical interpretation
- Management plans

### AUDIOLOGIST
Typical permissions:
- Access assigned/authorized patients
- View relevant patient clinical history
- Perform assessments
- Enter assessment measurements
- View audiograms
- Enter clinical notes
- Record findings
- Create/propose diagnosis where appropriate
- Create management plans
- Complete assessments

### LEAD AUDIOLOGIST
Should have the Audiologist permissions plus:
- Review assessments
- Review clinical findings
- Review patient history
- Approve/sign off clinical records
- Finalize reports
- Oversee clinical workflow
- Reassign/review clinical work where appropriate

### ORGANIZATION ADMIN
Should manage:
- Organization settings
- Users
- Roles
- Branches/locations
- Subscription-related settings where appropriate

Do not assume that every role above needs unrestricted access to every patient.

## 5. Role vs Scope

**This is very important.** Do NOT use roles alone to determine access.

A user can be:
```
Audiologist + Branch A
```
and therefore normally access patients belonging to Branch A.

Another user could be:
```
Lead Audiologist + Organization-wide scope
```
and therefore access patients across all branches.

The authorization model should support scopes such as:
- Branch/location
- Organization-wide

Leave room for future finer-grained scopes if needed.

For example, an organization administrator should be able to determine whether a clinician can access:
- only their assigned patients
- patients within their branch
- patients across the organization

Do not over-engineer this if the current codebase does not need it yet, but the architecture should not make future expansion difficult.

## 6. Multi-Branch Clinics

A clinic with multiple branches should use ONE HearIntel organization/account.

Example:
```
ABC Hearing
├── Lagos
├── Abuja
└── Ibadan
```

Users belong to the organization and can be assigned to one or more branches.

The organization administrator should eventually be able to manage:
- branches
- users
- roles
- access scope

Do NOT create separate authentication systems or separate HearIntel accounts for each branch.

Patients should belong to the organization, while branch/location association should determine operational access where appropriate.

Consider how a patient who visits multiple branches should be handled. We should avoid creating duplicate patient records simply because the patient visits another branch.

## 7. University Support

Universities should use the same fundamental organization architecture.

Example:
```
FUHSI
├── Audiology Clinic
├── Clinical Supervisors
├── Audiologists
├── Students/Trainees
└── Research
```

A student/trainee role may eventually have restricted clinical access and may require supervisor review/sign-off.

Do not implement unnecessary student permissions yet unless the existing product requires them, but make sure the architecture can support this later.

## 8. Solo Practitioners

We have not previously designed for solo practitioners. Support them without creating a separate product architecture.

A solo practitioner can effectively have multiple roles:
```
Owner + Admin + Audiologist + Lead Audiologist
```

The system should allow a single user to perform multiple permitted functions without creating duplicate accounts.

## 9. Device / Session Management

Do NOT make device count the primary authorization mechanism. The product should not conceptually say: *"You can only use HearIntel on three devices."*

Instead, authorization should be based on users, roles, organizations, branches and permissions.

However, we should consider session/security controls to prevent credential sharing and unauthorized access. Design this as something that can eventually support:
- active session management
- device/session visibility
- forced logout
- security alerts
- plan-based limits where genuinely necessary

If device/session limits are appropriate for pricing, treat them as a commercial/security control rather than the underlying authorization model.

Do NOT implement arbitrary limits such as "2 or 3 devices" unless you can justify them from the existing product requirements.

## 10. Patient Access

Think carefully about the difference between:

*"Can this user find this patient?"*

and

*"Can this user access this patient's clinical record?"*

For example:
- A receptionist may need to find a patient in order to book an appointment without being allowed to see the patient's clinical information.
- An audiologist may need access to the complete clinical record.
- A lead audiologist may need organization-wide clinical access.

The authorization model should support this distinction.

## 11. Workflow States

Consider whether the PMS needs explicit patient workflow states such as:
- Registered
- Appointment booked
- Checked in
- Waiting
- With audiologist
- Assessment in progress
- Assessment completed
- Awaiting clinical review
- Reviewed
- Signed off
- Follow-up required
- Completed

These states should interact with role permissions and queues.

For example:
- Receptionist → moves patient into queue
- Audiologist → takes patient from queue and performs assessment
- Lead Audiologist → reviews/signs off

Do not implement arbitrary states without checking how the existing PMS currently works.

## 12. Security and Clinical Governance

Because this is a clinical system, authorization must follow least privilege. A user should receive the minimum access required to perform their role.

Consider:
- role-based access
- organization isolation
- branch isolation
- auditability
- clinical sign-off
- record ownership
- permission changes
- session security
- prevention of unauthorized cross-organization access

Do not expose sensitive clinical information simply because a user belongs to the same organization.

## 13. What I Want From You First

Before modifying code, produce a short diagnostic/design document containing:

**A. Current Authentication Architecture**
- How users currently authenticate
- Current user model
- Current organization model
- Existing roles
- Existing permissions
- Existing session handling
- Existing patient access logic

**B. Current Problems**
Identify what is insufficient about the current architecture.

**C. Proposed Authorization Model**
Show: `User → Organization → Branch → Role → Scope → Permission`

**D. Role-Permission Matrix**
Create a clear matrix showing what each initial role can and cannot do.

**E. Patient Access Model**
Explain:
- who can find a patient
- who can open the clinical record
- who can modify clinical data
- who can sign off
- how branch access works

**F. Organization Model**
Show how the same architecture supports:
- solo practitioner
- clinic
- multi-branch clinic
- hospital
- university

**G. Workflow Model**
Show the relationship between: `Registration → Appointment → Queue → Assessment → Review → Sign-off → Follow-up`

**H. Risks / Open Questions**
Identify anything that cannot yet be decided without clinical/business input. Do NOT invent answers.

## 14. Implementation Rule

After producing the analysis, **WAIT**.

Do not modify the codebase until the authorization model has been reviewed and approved. The purpose of this phase is to make sure we are designing the correct authorization system rather than simply adding roles to the existing code.

- Do not redesign the UI yet.
- Do not introduce unnecessary features.
- Do not remove existing functionality.
- Do not assume that the current architecture is correct simply because it already exists.

Diagnose first, then propose the smallest architecture that can support HearIntel's current PMS while preserving a clean path toward multi-branch clinics, universities, solo practitioners and future enterprise organizations.

---

# Part 2 — Identity, Organization & Cross-Organization Access

**Continuation** from the authorization architecture diagnosed in Part 1.

Do not implement yet.

We now need to extend the model to properly handle:
- individual user accounts
- organization invitations
- multiple branches
- shared patient identity
- a global HearIntel MRN
- cross-branch access
- cross-organization access
- patient consent
- emergency/break-glass access
- auditability

The objective is to design this correctly before implementation.

## 1. Important Architectural Distinction

Keep these concepts separate:

- **AUTHENTICATION** — Who is this person?
- **ORGANIZATION MEMBERSHIP** — Which organization(s) does this person belong to?
- **ROLE** — What can this person do?
- **SCOPE** — Which branch/location or organizational resources can they access?
- **PATIENT IDENTITY** — Which real-world patient is this?
- **CLINICAL DATA AUTHORIZATION** — Which clinical records is this user/organization allowed to access?

Do not collapse these into one permission system.

## 2. Individual User Accounts

The organization owns the subscription and manages its users, but the organization should NOT be represented by one shared login.

Every human user must have an individual account.

Example:
```
ABC Hearing
├── Receptionist A
├── Audiologist A
├── Audiologist B
├── Lead Audiologist
└── Organization Admin
```

Each user should authenticate independently. This is required for:
- accountability
- audit trails
- clinical sign-off
- permission management
- security
- identifying who accessed or modified a record

Do not design the system around shared organization credentials.

## 3. Organization Invitations

The organization administrator should be able to invite users.

Proposed workflow:
```
Organization Admin
→ Settings
→ Team
→ Invite User
→ Enter email
→ Select role
→ Select branch/scope
→ Send invitation
```

The invited user receives a secure email invitation. They accept the invitation and create/authenticate their individual HearIntel account.

The invitation should associate the user with:
- Organization
- Role
- Branch/location where applicable
- Initial scope

Do not create a completely separate authentication system for each organization. The underlying identity system should support users belonging to organizations through memberships.

Investigate whether the planned authentication provider can support this cleanly rather than building unnecessary custom authentication logic.

## 4. Multi-Branch Organizations

A multi-branch organization must use ONE organization identity/subscription.

Example:
```
ABC Hearing
├── Lagos
├── Abuja
└── Ibadan
```

Users can be assigned to one or more branches.

However, branch membership should NOT automatically mean that a completely separate patient database exists for each branch. The organization should have a unified patient population.

## 5. Cross-Branch Access

**IMPORTANT:** Branches belonging to the SAME organization should generally be able to access the organization's patient records without requiring a new patient consent every time the patient moves between branches.

Example: Patient NG-26-01234 visits ABC Hearing — Lagos, then ABC Hearing — Abuja. Abuja should be able to identify and access the patient's relevant clinical record because both branches belong to the same organization, subject to the user's role and permissions.

Do NOT create unnecessary consent barriers between branches belonging to the same organization.

However, do NOT interpret this as *"everyone in the organization can see everything."* Access must still respect:
- user role
- clinical responsibility
- least privilege
- branch/scope where appropriate
- auditability
- organizational policies

Design the authorization model so an organization can eventually choose appropriate internal access policies.

Clearly distinguish:
- **SAME ORGANIZATION** → internal organizational access
- **DIFFERENT ORGANIZATION** → external/cross-organization access

## 6. Global Patient Identity

HearIntel should NOT create a new patient identity every time a patient visits another clinic or organization.

A patient should have ONE persistent HearIntel identity, e.g. `NG-26-01234`.

That identity should remain the same when the patient visits another participating organization. The patient identity should be separate from individual organizations' clinical records.

Conceptually:
```
PATIENT IDENTITY
NG-26-01234
        │
        ├── Organization A clinical records
        │
        ├── Organization B clinical records
        │
        └── Organization C clinical records
```

Do NOT duplicate the patient's core identity simply because the patient receives care at another organization.

## 7. MRN Design

The proposed human-readable MRN format is: **COUNTRY - YEAR - SEQUENTIAL IDENTIFIER** (e.g. `NG-26-01234`).

The MRN should be globally unique within the HearIntel patient identity system.

However: **DO NOT** use the formatted MRN as the database's fundamental primary key. Use an immutable internal patient identifier, such as a UUID.

Conceptually:
```
patient_id = immutable internal identifier
mrn = NG-26-01234
```

The MRN is the human-facing identifier. The internal ID should not depend on the formatting of the MRN.

## 8. Patient Identity vs Clinical Record

This distinction is critical.

- **PATIENT IDENTITY** contains information required to identify the patient, such as appropriate demographic/identity information.
- **CLINICAL RECORD** contains organization-specific clinical information, such as: assessments, audiograms, clinical notes, diagnoses, management plans, reports, uploaded clinical media, follow-up information.

Do not treat the patient identity and the clinical record as the same object. A patient may have ONE HearIntel identity but MULTIPLE organization-specific clinical records.

## 9. Cross-Organization Patient Discovery

A clinic should be able to determine whether a patient already exists in the HearIntel patient identity index.

Example: Clinic B searches `NG-26-01234`. HearIntel can return something equivalent to: *"PATIENT FOUND — Name, MRN, Basic permitted identity information. Patient exists in HearIntel."*

However: **DO NOT** automatically expose the patient's full clinical record from another organization.

The system must distinguish:
*"Patient exists"* from *"This organization is authorized to access the patient's clinical records."*

This distinction must be explicit in both the data model and UI.

## 10. Cross-Organization Access

This is different from cross-branch access.

If Organization A and Organization B are separate organizations, Organization B must NOT automatically gain access to Organization A's clinical records merely because both use HearIntel.

**Default: CROSS-ORGANIZATION CLINICAL ACCESS = DENIED**

The system should support explicit authorization. The initial conceptual flow should be:
```
Organization B identifies patient
→ Patient exists
→ Organization B requests access
→ appropriate authorization/consent mechanism
→ access granted
→ permitted clinical records become accessible
→ access is audited
```

Do not assume that consent means unrestricted access to everything. Design the authorization model so access can eventually be scoped by:
- organization
- record type
- time period
- purpose
- specific clinical data
- duration/expiry

Do not over-engineer the first implementation, but do not design the database in a way that prevents this later.

## 11. Patient Consent

Treat patient consent as an explicit authorization event, not as a generic boolean field.

The system should eventually be capable of recording:
- patient
- requesting organization
- receiving organization
- requesting user
- consent status
- date/time
- purpose
- scope
- expiry/revocation where applicable
- audit information

Do not assume that "consent = true" is sufficient. The architecture must leave room for meaningful consent management.

Do NOT invent legal requirements. Where legal/regulatory requirements are uncertain, mark them as questions requiring legal/compliance review.

## 12. Break-Glass Access

The system should support a controlled emergency access mechanism. Break-glass should NOT simply bypass all authorization without accountability.

Conceptually:
```
User attempts to access restricted patient record
→ Emergency access option
→ User must provide justification/reason
→ System grants temporary emergency access if authorized
→ Access is heavily audited
→ Organization/security/compliance mechanisms can review the event
```

The system should record:
- user
- organization
- patient
- date/time
- reason/justification
- records accessed
- access duration where applicable

Do not assume every role can invoke break-glass. Recommend an initial permission model and clearly identify what requires clinical/governance approval.

## 13. Cross-Organization Data Isolation

This is a critical architectural requirement. The database must prevent accidental cross-organization clinical data exposure.

For example: Organization A must not be able to query Organization B's clinical records simply by changing an organization ID in a request.

Design the authorization/data-access layer so that organization isolation is enforced server-side. Do not rely solely on frontend hiding.

The backend must enforce:
```
User
→ Organization membership
→ Role
→ Scope
→ Patient
→ Authorization
→ Clinical record
```
before returning protected data.

Inspect the current architecture and identify whether this isolation is currently enforced correctly.

## 14. No Duplicate Patient Records

We do NOT want the same patient duplicated across the entire HearIntel database simply because they visit multiple organizations.

However, do not assume that matching on name alone is sufficient. The system needs a patient identity resolution strategy.

Investigate:
- How patient identity is created
- How existing patients are discovered
- How duplicate identities are detected
- What happens when two organizations attempt to register the same person
- How potential matches are presented
- Who is allowed to resolve/merge duplicates
- How merges affect existing clinical records
- How false matches are prevented

Do NOT invent a perfect identity-matching algorithm. Document the recommended initial approach and its limitations.

## 15. Patient Registration Flow

Design the conceptual workflow for a clinic registering a patient:

**NEW PATIENT**
```
Clinic searches identity index
→ no confident match
→ create patient identity
→ HearIntel generates MRN
→ organization creates its clinical relationship/record
```

**EXISTING PATIENT**
```
Clinic searches identity index
→ patient found
→ show permitted identity information
→ determine whether organization already has a relationship/record
→ if same organization, follow internal access rules
→ if different organization, clinical record remains restricted until authorized
```

Do not create another global patient identity simply because another organization encounters the patient.

## 16. Patient Relationship with Organizations

Do not model a patient as simply "belonging" to one clinic. A patient can have relationships with multiple organizations.

Conceptually:
```
Patient
│
├── Relationship → Organization A
│      └── Clinical records
│
├── Relationship → Organization B
│      └── Clinical records
│
└── Relationship → Organization C
       └── Clinical records
```

The patient identity is global. The clinical relationship and clinical records are organization-specific.

## 17. Device and Session Management

Users will access HearIntel from different devices and branches. Do NOT require all users in an organization to use the same device.

- A receptionist can use a desktop.
- An audiologist can use a laptop.
- A lead audiologist can use another computer/tablet.

Users authenticate individually. The organization determines membership and permissions, not the device. Device/session controls should be treated separately from authorization.

Investigate support for:
- active sessions
- session revocation
- device visibility
- forced logout
- suspicious session detection
- appropriate concurrent-session limits

Do not introduce arbitrary "three devices maximum" pricing unless there is a clear business/security reason.

## 18. Audit Trail

Because this is a clinical system, sensitive actions should be auditable.

Consider events such as:
- patient identity created
- patient identity matched
- patient record accessed
- cross-organization access requested
- consent granted
- consent revoked
- break-glass access invoked
- clinical record created
- clinical record modified
- assessment signed off
- user invited
- user role changed
- user removed
- organization/branch access changed

Identify which events should be mandatory in the initial implementation and which can be phased later.

## 19. Produce the Following Document

Before modifying code, produce:

**A. Identity Architecture**
Show the relationship between: User, Organization, Branch, Role, Patient, Patient Identity, Clinical Record.

**B. Authentication Flow**
Show: `Organization Admin → Invite User → Email Invitation → User Account → Authentication → Organization Membership → Role/Scope → PMS`

**C. Patient Identity Flow**
Show: `Patient Search → Existing Identity / New Identity → MRN → Organization Relationship → Clinical Record`

**D. Access Matrix**
Explicitly compare:
- Same organization / same branch
- Same organization / different branch
- Different organization / no consent
- Different organization / consent granted
- Different organization / emergency break-glass

For each scenario specify:
- Can patient be discovered?
- Can basic identity information be seen?
- Can clinical records be accessed?
- What authorization is required?
- What should be audited?

**E. Data Model**
Propose the conceptual entities and relationships required. Do not immediately write migrations.

**F. Security Model**
Explain how server-side authorization prevents unauthorized cross-organization clinical access.

**G. Open Questions**
Clearly identify decisions that require:
- clinical governance input
- product/business decisions
- legal/regulatory review
- further technical investigation

## 20. Very Important: Do Not Implement Yet

- Do not modify the codebase after this analysis.
- Do not create database migrations.
- Do not replace the existing authentication provider.
- Do not add new dependencies unless specifically asked.
- Do not redesign the PMS UI.
- Do not invent regulatory requirements.
- Do not assume that a technical possibility is automatically a product requirement.

First diagnose the existing implementation and produce the proposed Identity + Organization + Authorization architecture.

The design must preserve the principle:

> **ONE PATIENT IDENTITY + ORGANIZATION-SCOPED CLINICAL RECORDS + CONTROLLED CROSS-ORGANIZATION ACCESS + INDIVIDUAL USER ACCOUNTABILITY**

The ultimate goal is to allow a patient to move through the HearIntel ecosystem without creating duplicate identities, while ensuring that clinical data remains private and access is intentional, auditable, and appropriately scoped.