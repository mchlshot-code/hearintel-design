// HearIntel PMS Master Engine & Universal UI Coordinator

var PMS_ROLE_SOLO = 'solo';
var PMS_LEGACY_ROLE_SOLO_PRACTITIONER = 'solo_practitioner';

var PMS_AUTH_DEFAULT_CONTEXT = {
  identityName: 'Dr. Chika Okafor, Au.D.',
  organizationName: 'Lagos Central Hearing Clinic',
  organizationType: 'Clinic',
  role: 'lead_audiologist',
  roleLabel: 'Lead Audiologist',
  scopeType: 'organization',
  scopeLabel: 'Organization-wide',
  branchName: 'All Branches',
  branchIds: ['lagos-central', 'lekki-annex'],
  assignedPatientIds: ['amaia', 'david', 'emeka'],
  permissions: [
    'dashboard.view',
    'patients.view',
    'patients.register',
    'patients.demographics',
    'appointments.view',
    'appointments.manage',
    'schedule.view',
    'schedule.manage',
    'queue.manage',
    'clinical.view',
    'clinical.write',
    'clinical.review',
    'clinical.override',
    'reports.sign',
    'rehab.manage',
    'settings.view',
    'settings.manage',
    'staff.manage',
    'branches.manage',
    'finance.manage'
  ]
};

var PMS_AUTH_PRESETS = {
  receptionist: {
    identityName: 'Chioma Okoro',
    organizationName: 'Lagos Central Hearing Clinic',
    organizationType: 'Clinic',
    role: 'receptionist',
    roleLabel: 'Front Desk Officer',
    scopeType: 'branch',
    scopeLabel: 'Branch only',
    branchName: 'Lagos Central',
    branchIds: ['lagos-central'],
    assignedPatientIds: [],
    permissions: [
      'dashboard.view',
      'patients.register',
      'patients.demographics',
      'appointments.view',
      'appointments.manage',
      'queue.manage'
    ]
  },
  audiologist: {
    identityName: 'Amina Bello, Au.D.',
    organizationName: 'Lagos Central Hearing Clinic',
    organizationType: 'Clinic',
    role: 'audiologist',
    roleLabel: 'Audiologist',
    scopeType: 'assigned_patients',
    scopeLabel: 'Assigned patients',
    branchName: 'Lagos Central',
    branchIds: ['lagos-central'],
    assignedPatientIds: ['amaia', 'emeka'],
    permissions: [
      'dashboard.view',
      'patients.view',
      'clinical.view',
      'clinical.write',
      'rehab.manage'
    ]
  },
  lead: PMS_AUTH_DEFAULT_CONTEXT,
  admin: {
    identityName: 'Dr. Tunde Salako',
    organizationName: 'Lagos Central Hearing Clinic',
    organizationType: 'Clinic',
    role: 'organization_admin',
    roleLabel: 'Organization Admin',
    scopeType: 'organization',
    scopeLabel: 'Organization-wide',
    branchName: 'All Branches',
    branchIds: ['lagos-central', 'lekki-annex', 'ikorodu-outreach'],
    assignedPatientIds: [],
    permissions: [
      'dashboard.view',
      'patients.view',
      'patients.register',
      'patients.demographics',
      'appointments.view',
      'finance.manage',
      'settings.manage',
      'staff.manage',
      'branches.manage',
    
    ]
  },
  solo: {
    identityName: 'Ola Martins',
    organizationName: 'Ola Martins Hearing Practice',
    organizationType: 'Solo Practice',
    role: PMS_ROLE_SOLO,
    roleLabel: 'Solo Practitioner',
    scopeType: 'organization',
    scopeLabel: 'Organization-wide',
    branchName: 'Main Practice',
    branchIds: ['solo-main'],
    assignedPatientIds: [],
    permissions: [
      'dashboard.view',
      'patients.view',
      'patients.register',
      'patients.demographics',
      'appointments.view',
      'appointments.manage',
      'schedule.view',
      'schedule.manage',
      'queue.manage',
      'clinical.view',
      'clinical.write',
      'clinical.review',
      'reports.sign',
      'rehab.manage',
      'settings.view',
      'settings.manage'
    ]
  },
  super_admin: {
    identityName: 'HearIntel Super Admin',
    organizationName: 'HearIntel Network',
    organizationType: 'Platform',
    role: 'super_admin',
    roleLabel: 'Super Admin',
    scopeType: 'platform',
    scopeLabel: 'Platform governance',
    branchName: 'All Organizations',
    branchIds: [],
    assignedPatientIds: [],
    permissions: [
      'dashboard.view',
      'patients.view',
      'appointments.view',
      'settings.manage',
      'staff.manage',
      'branches.manage',
          'platform.manage'
    ]
  }
};

var PMS_ROUTE_PERMISSIONS = {
  dashboard: ['dashboard.view'],
  appointments: ['appointments.view', 'appointments.manage', 'schedule.view', 'schedule.manage'],
  schedule: ['appointments.view', 'appointments.manage', 'schedule.view', 'schedule.manage'],
  patients: ['patients.view', 'patients.register', 'patients.demographics'],
  registry: ['patients.view', 'patients.register', 'patients.demographics'],
  profile: ['patients.view', 'patients.demographics'],
  assessment: ['clinical.view', 'clinical.write'],
  history: ['clinical.view', 'clinical.write'],
  otoscopy: ['clinical.view', 'clinical.write'],
  pta: ['clinical.view', 'clinical.write'],
  immittance: ['clinical.view', 'clinical.write'],
  speech: ['clinical.view', 'clinical.write'],
  electrophysiology: ['clinical.view', 'clinical.write'],
  conclusion: ['clinical.view', 'clinical.write', 'clinical.review'],
  screening: ['clinical.write', 'clinical.view'],
  media: ['clinical.view', 'clinical.write'],
  settings: ['settings.manage', 'staff.manage', 'branches.manage']
};

function getStoredAuthContext() {
  try {
    var raw = localStorage.getItem('hearintel_pms_auth_context');
    return raw ? JSON.parse(raw) : null;
  } catch(e) {
    return null;
  }
}

function getPmsAuthContext() {
  var stored = getStoredAuthContext();
  return normalizePmsAuthContext(Object.assign({}, PMS_AUTH_DEFAULT_CONTEXT, stored || {}));
}

function normalizePmsAuthContext(context) {
  if (context.role === PMS_LEGACY_ROLE_SOLO_PRACTITIONER) context.role = PMS_ROLE_SOLO;
  return context;
}

function savePmsAuthContext(context) {
  localStorage.setItem('hearintel_pms_auth_context', JSON.stringify(Object.assign({}, getPmsAuthContext(), context)));
}

function setPmsAuthPreset(presetKey) {
  var preset = PMS_AUTH_PRESETS[presetKey];
  if (!preset) return;
  savePmsAuthContext(preset);
  notify('Access context switched to ' + preset.roleLabel + '.');
  setTimeout(function() { window.location.reload(); }, 450);
}

function hasPmsPermission(permission) {
  var ctx = getPmsAuthContext();
  return (ctx.permissions || []).indexOf(permission) !== -1;
}

function canAccessPmsArea(area) {
  var ctx = getPmsAuthContext();
  if (ctx.role === 'lead_audiologist' || ctx.role === 'lead') return true;
  var required = PMS_ROUTE_PERMISSIONS[area] || [];
  if (!required.length) return true;
  return required.some(function(permission) { return hasPmsPermission(permission); });
}

function getPatientBranchId(patient) {
  var facility = ((patient && patient.facility) || '').toLowerCase();
  if (facility.indexOf('lekki') !== -1) return 'lekki-annex';
  if (facility.indexOf('ikorodu') !== -1) return 'ikorodu-outreach';
  return 'lagos-central';
}

function canAccessPatientClinicalRecord(patient, area) {
  var ctx = getPmsAuthContext();
  if (!patient) return false;
  if (ctx.role === 'lead_audiologist' || ctx.role === 'lead') return true;
  if (hasPmsPermission('clinical.review') && (ctx.scopeType === 'organization' || ctx.scopeType === 'platform')) return true;
  if (!hasPmsPermission('clinical.view') && !hasPmsPermission('clinical.write')) return false;
  if (ctx.scopeType === 'organization' || ctx.scopeType === 'platform') return true;
  if (ctx.scopeType === 'assigned_patients') return (ctx.assignedPatientIds || []).indexOf(patient.id) !== -1;
  return (ctx.branchIds || []).indexOf(getPatientBranchId(patient)) !== -1 && area === 'screening';
}

function getPatientAccessState(patient, area) {
  var ctx = getPmsAuthContext();
  if (ctx.role === 'lead_audiologist' || ctx.role === 'lead') {
    return {
      label: 'Clinical record authorized',
      badgeClass: 'success',
      clinicalAllowed: true,
      identityVisible: true,
      actionLabel: area === 'profile' ? 'Open Record' : 'Start Assessment',
      reason: 'Lead Audiologist has universal clinical and administrative oversight.'
    };
  }
  var canFind = hasPmsPermission('patients.view') || hasPmsPermission('patients.register') || hasPmsPermission('patients.demographics');
  var canSeeIdentity = canFind || hasPmsPermission('clinical.view') || hasPmsPermission('clinical.write');
  var clinicalAllowed = canAccessPatientClinicalRecord(patient, area);
  var isAssigned = patient && (ctx.assignedPatientIds || []).indexOf(patient.id) !== -1;
  var sameBranch = patient && (ctx.branchIds || []).indexOf(getPatientBranchId(patient)) !== -1;

  if (!canSeeIdentity) {
    return {
      label: 'Access request required',
      badgeClass: 'danger',
      clinicalAllowed: false,
      identityVisible: false,
      actionLabel: 'Request Access',
      reason: 'This role cannot search patient identity records.'
    };
  }

  if (clinicalAllowed) {
    return {
      label: 'Clinical record authorized',
      badgeClass: 'success',
      clinicalAllowed: true,
      identityVisible: true,
      actionLabel: area === 'profile' ? 'Open Record' : 'Start Assessment',
      reason: isAssigned ? 'Assigned patient within clinical scope.' : 'Role and organization scope permit clinical access.'
    };
  }

  if (hasPmsPermission('patients.demographics') || hasPmsPermission('patients.register')) {
    return {
      label: 'Basic identity visible',
      badgeClass: 'warning',
      clinicalAllowed: false,
      identityVisible: true,
      actionLabel: 'View Identity',
      reason: sameBranch ? 'Administrative access only; clinical data remains restricted.' : 'Patient exists, but clinical record requires role, scope, consent, or access request.'
    };
  }

  return {
    label: 'Patient exists',
    badgeClass: 'neutral',
    clinicalAllowed: false,
    identityVisible: true,
    actionLabel: 'Request Access',
    reason: 'Identity can be discovered, but the clinical record is closed.'
  };
}

function canAccessGovernance() {
  return false;
}

function authLockedNavHtml(label, title) {
  return '<div class="nav-item disabled" title="' + (title || 'Restricted by current role and scope') + '">'
    + '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>'
    + '<span class="nav-label">' + label + '</span>'
    + '</div>';
}

function renderAuthDenied(areaLabel) {
  var ctx = getPmsAuthContext();
  return '<div class="auth-denied-panel">'
    + '<div class="auth-denied-icon"><i data-lucide="shield-alert"></i></div>'
    + '<h2>' + areaLabel + ' is outside this demo role</h2>'
    + '<p>' + ctx.roleLabel + ' access is limited to ' + ctx.scopeLabel.toLowerCase() + '. Authorization is determined by organization membership, role, scope, patient relationship, consent, workflow state, and audit policy.</p>'
    + '<a class="btn primary" href="00-dashboard.html">Return to Worklist</a>'
    + '</div>';
}

function renderPatientLimitedView(patient, areaLabel) {
  var state = getPatientAccessState(patient, areaLabel);
  var name = state.identityVisible ? (patient.fullName || patient.name) : 'Restricted patient';
  var mrn = state.identityVisible ? patient.mrn : 'Hidden';
  var phone = state.identityVisible ? (patient.phone || 'Not recorded') : 'Hidden';
  return '<div class="auth-denied-panel">'
    + '<div class="auth-denied-icon"><i data-lucide="shield-alert"></i></div>'
    + '<h2>' + state.label + '</h2>'
    + '<p>' + state.reason + '</p>'
    + '<div class="auth-limited-card">'
      + '<div><span>Patient</span><strong>' + name + '</strong></div>'
      + '<div><span>Global MRN</span><strong>' + mrn + '</strong></div>'
      + '<div><span>Phone</span><strong>' + phone + '</strong></div>'
      + '<div><span>Clinical Data</span><strong>Locked</strong></div>'
    + '</div>'
    + '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">'
      + '<button class="btn" onclick="notify(\'Access request created for governance review.\')">Request Access</button>'
      + '<a class="btn primary" href="01-registry.html">Return to Registry</a>'
    + '</div>'
    + '</div>';
}

// ── UI Utilities ──────────────────────────────────────────────────────────────

/**
 * Renders a standardized empty state component.
 * @param {string} icon  - SVG path or HTML entity (e.g. '&#9776;')
 * @param {string} title - Short headline
 * @param {string} body  - Descriptive sentence
 * @param {string|null} cta - Button label text (null = no button)
 * @param {string|null} ctaFn - onclick handler string for the CTA button
 */
function renderEmptyState(icon, title, body, cta, ctaFn) {
  var ctaHtml = cta
    ? '<button class="btn primary" onclick="' + (ctaFn || '') + '">' + cta + '</button>'
    : '';
  return '<div class="empty-state">'
    + '<div class="empty-state-icon">' + icon + '</div>'
    + '<div class="empty-state-title">' + title + '</div>'
    + '<div class="empty-state-body">' + body + '</div>'
    + ctaHtml
    + '</div>';
}

/**
 * Returns a colored initials avatar span for a patient name.
 * @param {string} name - Full patient name
 * @param {number} size - Diameter in px (default 32)
 */
function patientAvatarHTML(name, size) {
  var sz = size || 32;
  var initials = name.split(' ').map(function(n){ return n[0]; }).join('').substring(0,2).toUpperCase();
  var colors = ['#0F766E','#0369A1','#7C3AED','#B45309','#BE123C','#047857','#1D4ED8'];
  var bg = colors[name.charCodeAt(0) % colors.length];
  var fs = Math.round(sz * 0.37);
  return '<span class="patient-avatar" style="width:' + sz + 'px;height:' + sz + 'px;background:' + bg + ';font-size:' + fs + 'px;">' + initials + '</span>';
}



function getActiveTheme() {
  return localStorage.getItem('hearintel_theme') || 'precision';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('hearintel_theme', theme);
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
  notify('Theme: ' + (theme === 'precision' ? 'Precision Clinical' : (theme === 'layered' ? 'Layered Modern' : 'Editorial Nordic')));
}

document.documentElement.setAttribute('data-theme', getActiveTheme());

function getActivePatientId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('patient') || 'amaia';
}

function notify(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(window.__hearintelToast);
  window.__hearintelToast = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}


function openNewPatientModal() {
  var modal = document.getElementById('newPatientModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'newPatientModal';
    modal.className = 'modal-backdrop';
    modal.onclick = function(e) { if (e.target === modal) closeModal('newPatientModal'); };
    document.body.appendChild(modal);
  }
  modal.innerHTML = ''
    + '<div class="modal-dialog" style="max-width:540px;">'
    +   '<div class="modal-header" style="padding:18px 24px;border-bottom:1px solid var(--border-light);display:flex;justify-content:space-between;align-items:center;">'
    +     '<div>'
    +       '<h2 class="modal-title" style="font-size:17px;font-weight:700;letter-spacing:-0.02em;color:var(--text-primary);">Register New Patient</h2>'
    +       '<p style="font-size:12px;color:var(--text-secondary);margin-top:2px;">Enter clinical demographics to create a permanent medical record.</p>'
    +     '</div>'
    +     '<button class="btn ghost" onclick="closeModal(\'newPatientModal\')" style="min-height:30px;min-width:30px;padding:0;display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--text-secondary);" title="Close">✕</button>'
    +   '</div>'
    +   '<div class="modal-body" style="padding:22px 24px;display:flex;flex-direction:column;gap:14px;">'
    +     '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">'
    +       '<div>'
    +         '<label style="font-size:11.5px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:5px;">First Name *</label>'
    +         '<input type="text" id="npFirstName" placeholder="e.g. Samuel" style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius);font-size:13.5px;background:var(--surface);color:var(--text-primary);box-shadow:inset 0 1px 2px rgba(0,0,0,0.02);">'
    +       '</div>'
    +       '<div>'
    +         '<label style="font-size:11.5px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:5px;">Last Name *</label>'
    +         '<input type="text" id="npLastName" placeholder="e.g. Adeleke" style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius);font-size:13.5px;background:var(--surface);color:var(--text-primary);box-shadow:inset 0 1px 2px rgba(0,0,0,0.02);">'
    +       '</div>'
    +     '</div>'
    +     '<div style="display:grid;grid-template-columns:1.2fr 1fr 1.2fr;gap:12px;">'
    +       '<div>'
    +         '<label style="font-size:11.5px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:5px;">Date of Birth *</label>'
    +         '<input type="date" id="npDOB" placeholder="YYYY-MM-DD" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius);font-size:13px;background:var(--surface);color:var(--text-primary);box-shadow:inset 0 1px 2px rgba(0,0,0,0.02);">'
    +       '</div>'
    +       '<div>'
    +         '<label style="font-size:11.5px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:5px;">Sex *</label>'
    +         '<select id="npSex" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius);font-size:13px;background:var(--surface);color:var(--text-primary);">'
    +           '<option value="Male">Male</option>'
    +           '<option value="Female" selected>Female</option>'
    +         '</select>'
    +       '</div>'
    +       '<div>'
    +         '<label style="font-size:11.5px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:5px;">Phone</label>'
    +         '<input type="tel" id="npPhone" placeholder="+234 800 000 0000" style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius);font-size:13px;background:var(--surface);color:var(--text-primary);box-shadow:inset 0 1px 2px rgba(0,0,0,0.02);">'
    +       '</div>'
    +     '</div>'
    +     '<div>'
    +       '<label style="font-size:11.5px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:5px;">Primary Presenting Complaint</label>'
    +       '<input type="text" id="npComplaint" placeholder="e.g. Bilateral hearing loss, difficulty understanding speech in noise..." style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius);font-size:13.5px;background:var(--surface);color:var(--text-primary);box-shadow:inset 0 1px 2px rgba(0,0,0,0.02);">'
    +     '</div>'
    +     '<div>'
    +       '<label style="font-size:11.5px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:5px;">Referral / Intake Source</label>'
    +       '<select id="npReferral" style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius);font-size:13.5px;background:var(--surface);color:var(--text-primary);">'
    +         '<option>Self-referred / Walk-in</option>'
    +         '<option>Referral / Specialist Physician</option>'
    +         '<option>Occupational Health / Workplace Screening</option>'
    +         '<option>School Hearing Health Program</option>'
    +         '<option>Hospital Transfer</option>'
    +       '</select>'
    +     '</div>'
    +     '<div style="background:var(--bg-subtle);padding:10px 12px;border-radius:var(--radius);border:1px solid var(--border);">'
    +       '<label style="font-size:11.5px;font-weight:700;color:var(--teal-700);text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:6px;">Clinical Entry Workflow</label>'
    +       '<div style="display:flex;gap:12px;font-size:12.5px;">'
    +         '<label style="display:flex;align-items:center;gap:6px;cursor:pointer;"><input type="radio" name="npWorkflow" value="diagnostic" checked> Full Diagnostic Assessment</label>'
    +         '<label style="display:flex;align-items:center;gap:6px;cursor:pointer;"><input type="radio" name="npWorkflow" value="screening"> Rapid Hearing Screening </label>'
    +       '</div>'
    +     '</div>'
    +   '</div>'
    +   '<div class="modal-footer" style="padding:16px 24px;display:flex;justify-content:flex-end;gap:10px;border-top:1px solid var(--border-light);background:var(--bg-subtle);">'
    +     '<button class="btn" onclick="closeModal(\'newPatientModal\')" style="min-height:36px;padding:0 16px;">Cancel</button>'
    +     '<button class="btn primary" onclick="submitNewPatient()" style="min-height:36px;padding:0 18px;font-weight:600;">Register Patient →</button>'
    +   '</div>'
    + '</div>';
  modal.classList.add('active');
  setTimeout(function(){ var f = document.getElementById('npFirstName'); if(f) f.focus(); }, 50);
}

function submitNewPatient() {
  var first = (document.getElementById('npFirstName') || {}).value || '';
  var last  = (document.getElementById('npLastName')  || {}).value || '';
  var dob   = (document.getElementById('npDOB')       || {}).value || '';
  var sex   = (document.getElementById('npSex')       || {}).value || 'Female';
  var phone = (document.getElementById('npPhone')     || {}).value || '+234 800 000 0000';
  var complaint = (document.getElementById('npComplaint') || {}).value || 'Diagnostic Audiology Assessment Required';

  if (!first.trim() || !last.trim()) { 
    notify('Please enter both first and last name.'); 
    return; 
  }
  if (!dob) { 
    notify('Date of birth is required.'); 
    return; 
  }

  var cleanFirst = first.trim();
  var cleanLast = last.trim();
  var newId = (cleanFirst + '-' + cleanLast).toLowerCase().replace(/[^a-z0-9]/g, '');
  var mrnNum = Math.floor(1000000 + Math.random() * 9000000);
  var newMrn = 'LCC-26-' + mrnNum;

  var birthYear = new Date(dob).getFullYear();
  var currentYear = new Date().getFullYear();
  var age = isNaN(birthYear) ? 45 : (currentYear - birthYear);

  var newPatientObj = {
    id: newId,
    name: cleanFirst + ' ' + cleanLast.charAt(0).toUpperCase() + '.',
    fullName: cleanFirst + ' ' + cleanLast,
    mrn: newMrn,
    age: age,
    gender: sex,
    dob: dob,
    phone: phone,
    primaryDiagnosis: complaint,
    status: 'Intake Completed',
    statusType: 'neutral',
    facility: 'Lagos Central Clinic',
    lastEncounter: 'Today',
    nextRecall: 'Pending',
    pathwayLabel: 'Routine Assessment',
    alerts: [],
    assessments: [],
    carePlan: [
      {
        id: 'cp-' + Date.now(),
        title: 'Initial Audiological Diagnostic Evaluation',
        category: 'Assessment',
        status: 'Pending Assessment',
        badgeClass: 'neutral',
        details: 'Patient registered. Case history intake and comprehensive diagnostic battery required.',
        nextStep: 'Start diagnostic encounter'
      }
    ]
  };

  if (window.HearIntelDB && window.HearIntelDB.savePatient) {
    window.HearIntelDB.savePatient(newPatientObj);
  }

  const wfEl = document.querySelector('input[name="npWorkflow"]:checked');
  const workflow = wfEl ? wfEl.value : 'diagnostic';

  if (workflow === 'screening') {
    newPatientObj.status = 'Screening Pending';
    newPatientObj.statusType = 'warning';
    newPatientObj.pathwayLabel = 'Rapid Screening Protocol';
  }

  closeModal('newPatientModal');

  if (workflow === 'screening') {
    notify('Patient registered for Rapid Screening: ' + newPatientObj.name + '. Launching Screening Module...');
    setTimeout(function() {
      window.location.href = '13-workspace-screening.html?patient=' + newId;
    }, 350);
  } else {
    notify('Patient registered: ' + newPatientObj.name + '. Opening patient record...');
    setTimeout(function() {
      window.location.href = '02-profile.html?patient=' + newId;
    }, 350);
  }
}

// ── Clinical Referral Modal ──
function openReferralModal(patientId) {
  var pid = patientId || getActivePatientId();
  var patient = (window.HearIntelDB && window.HearIntelDB.getPatient(pid)) || { name: 'Patient Record', mrn: 'LCC-26-00000' };
  
  var modal = document.getElementById('referralModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'referralModal';
    modal.className = 'modal-backdrop';
    modal.onclick = function(e) { if (e.target === modal) closeModal('referralModal'); };
    document.body.appendChild(modal);
  }

  modal.innerHTML = ''
    + '<div class="modal-dialog" style="max-width:560px;">'
    +   '<div class="modal-header" style="padding:18px 24px;border-bottom:1px solid var(--border-light);display:flex;justify-content:space-between;align-items:center;">'
    +     '<div>'
    +       '<h2 class="modal-title" style="font-size:17px;font-weight:700;letter-spacing:-0.02em;color:var(--text-primary);">Create Clinical Referral</h2>'
    +       '<div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">Patient: <strong>' + patient.name + '</strong> (' + patient.mrn + ')</div>'
    +     '</div>'
    +     '<button class="btn ghost" onclick="closeModal(\'referralModal\')" style="min-height:30px;min-width:30px;padding:0;display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--text-secondary);" title="Close">✕</button>'
    +   '</div>'
    +   '<div class="modal-body" style="padding:22px 24px;display:flex;flex-direction:column;gap:14px;">'
    +     '<div>'
    +       '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">'
    +         '<label style="font-size:11.5px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em;">Referral Destination / Specialty *</label>'
    +         '<span style="font-size:11px;color:var(--text-tertiary);">Select or type custom specialty</span>'
    +       '</div>'
    +       '<input list="refTargetList" id="refTarget" placeholder="Select from suggestions or type specialty..." style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius);font-size:13.5px;background:var(--surface);color:var(--text-primary);box-shadow:inset 0 1px 2px rgba(0,0,0,0.02);">'
    +       '<datalist id="refTargetList">'
    +         '<option value="Otolaryngology / Specialist Clinic (LUTH)">'
    +         '<option value="Cochlear Implant Multi-Disciplinary Team">'
    +         '<option value="Vestibular & Balance Assessment Unit">'
    +         '<option value="Speech-Language Pathology Clinic">'
    +         '<option value="Pediatric Audiology Specialist">'
    +         '<option value="Neurology & Neuro-Otology Dept">'
    +         '<option value="Private ENT Surgical Associates">'
    +       '</datalist>'
    +     '</div>'
    +     '<div>'
    +       '<label style="font-size:11.5px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:5px;">Clinical Indication *</label>'
    +       '<input type="text" id="refIndication" placeholder="e.g. Asymmetric sensorineural hearing loss, progressive decline, or red-flag clearance..." style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius);font-size:13.5px;background:var(--surface);color:var(--text-primary);box-shadow:inset 0 1px 2px rgba(0,0,0,0.02);">'
    +     '</div>'
    +     '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">'
    +       '<div>'
    +         '<label style="font-size:11.5px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:5px;">Priority</label>'
    +         '<select id="refPriority" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius);font-size:13px;background:var(--surface);color:var(--text-primary);">'
    +           '<option>Urgent (< 2 weeks)</option>'
    +           '<option selected>Standard Routine</option>'
    +           '<option>Immediate / Same-Day</option>'
    +         '</select>'
    +       '</div>'
    +       '<div>'
    +         '<label style="font-size:11.5px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:5px;">Attach Records</label>'
    +         '<select id="refAttach" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius);font-size:13px;background:var(--surface);color:var(--text-primary);">'
    +           '<option>Latest Audiogram + Tympanometry</option>'
    +           '<option selected>Complete Longitudinal Record</option>'
    +           '<option>Summary Diagnostic Report Only</option>'
    +         '</select>'
    +       '</div>'
    +     '</div>'
    +     '<div>'
    +       '<label style="font-size:11.5px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:5px;">Clinician Referral Notes</label>'
    +       '<textarea id="refNotes" rows="3" placeholder="Enter clinical rationale, test findings summary, or specific questions for the specialist..." style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius);font-size:13px;background:var(--surface);color:var(--text-primary);font-family:inherit;line-height:1.45;"></textarea>'
    +     '</div>'
    +   '</div>'
    +   '<div class="modal-footer" style="padding:16px 24px;display:flex;justify-content:flex-end;gap:10px;border-top:1px solid var(--border-light);background:var(--bg-subtle);">'
    +     '<button class="btn" onclick="closeModal(\'referralModal\')" style="min-height:36px;padding:0 16px;">Cancel</button>'
    +     '<button class="btn primary" onclick="submitReferral(\'' + pid + '\')" style="min-height:36px;padding:0 18px;font-weight:600;">Dispatch Referral →</button>'
    +   '</div>'
    + '</div>';
    
  modal.classList.add('active');
}

function submitReferral(patientId) {
  var pid = patientId || getActivePatientId();
  var target = ((document.getElementById('refTarget') || {}).value || 'Specialist Clinic').trim();
  var ind = ((document.getElementById('refIndication') || {}).value || 'Specialist Evaluation').trim();
  var prio = ((document.getElementById('refPriority') || {}).value || 'Standard Routine').trim();
  var attach = ((document.getElementById('refAttach') || {}).value || 'Latest Audiogram').trim();
  var notes = ((document.getElementById('refNotes') || {}).value || '').trim();

  if (!target) {
    notify('Please select or enter a referral destination.');
    return;
  }

  if (window.HearIntelDB && window.HearIntelDB.addCarePlanItem) {
    window.HearIntelDB.addCarePlanItem(pid, {
      title: 'Referral: ' + target,
      category: 'Specialist Referral',
      status: 'Dispatched (' + prio + ')',
      badgeClass: 'neutral',
      details: ind + '. ' + (notes ? 'Notes: ' + notes : '') + ' [Attached: ' + attach + ']',
      nextStep: 'Consultation appointment with ' + target
    });
  }

  if (window.HearIntelDB && window.HearIntelDB.addMedia) {
    var safeName = target.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 24);
    window.HearIntelDB.addMedia(pid, {
      name: 'Referral_Letter_' + safeName + '.pdf',
      type: 'Referral Letter (PDF)',
      tag: 'Clinical Referral',
      size: '280 KB'
    });
  }

  if (window.HearIntelDB && window.HearIntelDB.getPatient) {
    var p = window.HearIntelDB.getPatient(pid);
    if (p) {
      p.status = 'Referral Dispatched';
      window.HearIntelDB.savePatient(p);
    }
  }

  closeModal('referralModal');
  notify('Referral dispatched to ' + target + '. Letter added to Media & Documents.');

  if (typeof renderProfile === 'function') {
    renderProfile();
  }
}

// ── Care Plan / Scheduled Recall Modal ──
function openAddCarePlanModal(patientId) {
  var pid = patientId || getActivePatientId();
  var patient = (window.HearIntelDB && window.HearIntelDB.getPatient(pid)) || { name: 'Patient Record', mrn: 'LCC-26-00000' };

  var modal = document.getElementById('addCarePlanModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'addCarePlanModal';
    modal.className = 'modal-backdrop';
    modal.onclick = function(e) { if (e.target === modal) closeModal('addCarePlanModal'); };
    document.body.appendChild(modal);
  }

  var today = new Date();
  today.setDate(today.getDate() + 21);
  var defaultDate = today.toISOString().split('T')[0];
  var clinName = (window.HearIntelDB && window.HearIntelDB.currentClinician) ? window.HearIntelDB.currentClinician.name : 'Dr. Chika Okafor, Au.D.';

  modal.innerHTML = ''
    + '<div class="modal-dialog" style="max-width:540px;">'
    +   '<div class="modal-header" style="padding:16px 20px;border-bottom:1px solid var(--border-light);display:flex;justify-content:space-between;align-items:center;">'
    +     '<div>'
    +       '<h2 class="modal-title" style="font-size:16px;font-weight:700;">Update Care Plan & Scheduled Recall</h2>'
    +       '<div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">Patient: <strong>' + patient.name + '</strong> (' + patient.mrn + ')</div>'
    +     '</div>'
    +     '<button class="btn" onclick="closeModal(\'addCarePlanModal\')" style="min-height:28px;padding:0 10px;">✕</button>'
    +   '</div>'
    +   '<div class="modal-body" style="padding:20px;display:flex;flex-direction:column;gap:14px;">'
    +     '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">'
    +       '<div>'
    +         '<label style="font-size:12px;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:4px;">Care Plan Objective *</label>'
    +         '<select id="cpCategory" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius);font-size:13.5px;background:var(--surface);color:var(--text-primary);">'
    +           '<option>Hearing Aid Verification & REM</option>'
    +           '<option>Aural Rehabilitation & Counseling</option>'
    +           '<option>Annual Diagnostic Audiometry</option>'
    +           '<option>Tympanometry & Middle Ear Follow-up</option>'
    +           '<option>Specialist Referral Follow-up</option>'
    +         '</select>'
    +       '</div>'
    +       '<div>'
    +         '<label style="font-size:12px;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:4px;">Next Recall Date *</label>'
    +         '<input type="date" id="cpDate" value="' + defaultDate + '" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius);font-size:13.5px;background:var(--surface);color:var(--text-primary);">'
    +       '</div>'
    +     '</div>'
    +     '<div>'
    +       '<label style="font-size:12px;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:4px;">Action Item / Protocol Details</label>'
    +       '<input type="text" id="cpDetails" placeholder="e.g. 3-Week post-fit Real Ear Measurement (REM) verification and data logging review" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius);font-size:13.5px;background:var(--surface);color:var(--text-primary);">'
    +     '</div>'
    +     '<div>'
    +       '<label style="font-size:12px;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:4px;">Assigned Practitioner</label>'
    +       '<input type="text" id="cpPractitioner" value="' + clinName + '" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius);font-size:13.5px;background:var(--surface);color:var(--text-primary);">'
    +     '</div>'
    +   '</div>'
    +   '<div class="modal-footer" style="padding:14px 20px;display:flex;justify-content:flex-end;gap:8px;border-top:1px solid var(--border-light);">'
    +     '<button class="btn" onclick="closeModal(\'addCarePlanModal\')">Cancel</button>'
    +     '<button class="btn primary" onclick="submitCarePlan()">Save & Update Recall</button>'
    +   '</div>'
    + '</div>';

  modal.classList.add('active');
}

function submitCarePlan() {
  var cat = (document.getElementById('cpCategory') || {}).value || 'Care Plan Follow-up';
  var d = (document.getElementById('cpDate') || {}).value || '';
  var det = (document.getElementById('cpDetails') || {}).value || cat;

  var recallTextEl = document.getElementById('profNextRecallText');
  var recallReasonEl = document.getElementById('profNextRecallReason');
  if (recallTextEl && d) {
    var parts = d.split('-');
    var formattedDate = parts[2] + ' ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(parts[1],10)-1] + ' ' + parts[0];
    recallTextEl.textContent = formattedDate;
  }
  if (recallReasonEl) {
    recallReasonEl.textContent = det;
  }

  closeModal('addCarePlanModal');
  notify('Care plan and recall schedule updated.');
}

// ── Global Command-K Patient Lookup / Disambiguation Modal ──
function openPatientLookupModal() {
  let modal = document.getElementById('globalPatientLookupModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'globalPatientLookupModal';
    modal.className = 'modal-backdrop';
    document.body.appendChild(modal);
  }

  const patientCount = window.HearIntelDB ? window.HearIntelDB.getAllPatients().length : 3;

  modal.innerHTML = `
    <div class="modal-dialog lookup-modal-dialog">
      <div class="lookup-search-header">
        <span style="color:var(--teal-600);font-weight:700;">🔍</span>
        <input class="lookup-search-input" id="cmdKInput" placeholder="Search patient name, MRN, phone, or diagnosis..." oninput="filterLookupResults(this.value)" autofocus>
        <span class="kbd-badge">ESC</span>
      </div>
      <div class="lookup-results-list" id="cmdKResultsList">
        <!-- Dynamic Results -->
      </div>
      <div style="padding:8px 18px;background:var(--bg-subtle);border-top:1px solid var(--border-light);font-size:11.5px;color:var(--text-secondary);display:flex;justify-content:space-between;">
        <span>Press <strong>↵</strong> to select · <strong>↑↓</strong> to navigate</span>
        <span>${patientCount} clinical records loaded</span>
      </div>
    </div>
  `;

  modal.classList.add('active');
  filterLookupResults('');
  setTimeout(() => {
    const input = document.getElementById('cmdKInput');
    if (input) input.focus();
  }, 50);
}

function filterLookupResults(query) {
  const q = (query || '').toLowerCase().trim();
  const patients = window.HearIntelDB ? window.HearIntelDB.getAllPatients() : [];
  const list = document.getElementById('cmdKResultsList');
  if (!list) return;

  const matches = patients.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.mrn.toLowerCase().includes(q) ||
    (p.phone && p.phone.toLowerCase().includes(q)) ||
    (p.primaryDiagnosis && p.primaryDiagnosis.toLowerCase().includes(q))
  );

  if (matches.length === 0) {
    list.innerHTML = `<div style="padding:36px 20px;text-align:center;color:var(--text-secondary);font-size:13.5px;">No matching patient records found for "<strong>${query}</strong>".</div>`;
    return;
  }

  list.innerHTML = matches.map(p => {
    const accessState = getPatientAccessState(p, 'profile');
    const clinicalHref = accessState.clinicalAllowed ? `03-start-encounter.html?patient=${p.id}` : '#';
    const rowClick = accessState.identityVisible ? `location.href='02-profile.html?patient=${p.id}'` : `notify('Access request created for governance review.')`;
    const actionClick = accessState.clinicalAllowed ? 'event.stopPropagation();' : "event.preventDefault();event.stopPropagation();notify('Access request created for governance review.');";
    return `
    <div class="lookup-result-row" onclick="${rowClick}" title="${accessState.reason}">
      <div style="flex:1;min-width:0;padding-right:20px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:4px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <strong style="font-size:14.5px;color:var(--text-primary);letter-spacing:-0.01em;">${p.name}</strong>
            <span style="font-family:monospace;font-size:11.5px;color:var(--text-secondary);letter-spacing:0.02em;">${p.mrn}</span>
            <span class="badge ${accessState.badgeClass}">${accessState.label}</span>
          </div>
          <span style="font-size:12px;color:var(--text-secondary);white-space:nowrap;">${p.age} yrs · ${p.gender}</span>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:12px;color:var(--text-secondary);">
          <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:440px;">${accessState.clinicalAllowed ? (p.primaryDiagnosis || 'Audiological Assessment Required') : accessState.reason}</span>
          <span style="font-family:monospace;font-size:11.5px;color:var(--text-tertiary);white-space:nowrap;">${p.phone || '+234 800 000 0000'}</span>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
        <a class="btn ${accessState.clinicalAllowed ? 'primary' : ''}" style="min-height:30px;padding:0 12px;font-size:12px;font-weight:600;" href="${clinicalHref}" onclick="${actionClick}">${accessState.actionLabel}</a>
      </div>
    </div>
  `;
  }).join('');
}

// Global Keyboard Listener for "/" or "Ctrl+K" / "Cmd+K"
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal('globalPatientLookupModal');
    closeModal('globalPatientSwitcherModal');
    closeModal('newPatientModal');
    closeModal('referralModal');
    closeModal('addCarePlanModal');
    closeReportModal();
  } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openPatientLookupModal();
  } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    e.preventDefault();
    openPatientLookupModal();
  }
});

// ── Master Shell Generator ──
function renderRoleSwitcherHtml(authContext) {
  var r = authContext.role || '';
  var isLead = r === 'lead_audiologist' || r === 'lead';
  var isRec  = r === 'receptionist' || r === 'front_desk';
  var isAud  = r === 'audiologist';
  var isAdmin = r === 'organization_admin' || r === 'org_admin';
  var isSolo = r === PMS_ROLE_SOLO;
  var isSuper = r === 'super_admin';

  var chevronSvg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="%2338BDF8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

  return '<div class="auth-context-card">'
    + '<div class="auth-context-label" style="font-size:10px;text-transform:uppercase;letter-spacing:0.06em;color:rgba(255,255,255,0.45);margin-bottom:3px;">Signed in as</div>'
    + '<div class="auth-context-name" style="font-weight:700;font-size:13px;color:#FFFFFF;line-height:1.25;">' + authContext.identityName + '</div>'
    + '<div style="margin-top:5px;">'
    +   '<select onchange="setPmsAuthPreset(this.value)" style="display:inline-flex;align-items:center;border-radius:999px;padding:3px 20px 3px 9px;background:rgba(14,165,233,0.22);color:#38BDF8;border:1px solid rgba(56,189,248,0.5);font-size:10.5px;font-weight:700;letter-spacing:0.02em;cursor:pointer;outline:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;background-image:url(\'' + chevronSvg + '\');background-repeat:no-repeat;background-position:right 7px center;" title="Switch role context">'
    +     '<option value="lead" style="background:#0F172A;color:#FFFFFF;"' + (isLead ? ' selected' : '') + '>Lead Audiologist</option>'
    +     '<option value="receptionist" style="background:#0F172A;color:#FFFFFF;"' + (isRec ? ' selected' : '') + '>Front Desk Officer</option>'
    +     '<option value="audiologist" style="background:#0F172A;color:#FFFFFF;"' + (isAud ? ' selected' : '') + '>Audiologist</option>'
    +     '<option value="admin" style="background:#0F172A;color:#FFFFFF;"' + (isAdmin ? ' selected' : '') + '>Organization Admin</option>'
    +     '<option value="solo" style="background:#0F172A;color:#FFFFFF;"' + (isSolo ? ' selected' : '') + '>Solo Practitioner</option>'
    +     '<option value="super_admin" style="background:#0F172A;color:#FFFFFF;"' + (isSuper ? ' selected' : '') + '>Super Admin</option>'
    +   '</select>'
    + '</div>'
    + '<div class="auth-context-scope" style="font-size:10.5px;color:rgba(255,255,255,0.55);margin-top:5px;">' + authContext.scopeLabel + ' &middot; ' + authContext.branchName + '</div>'
    + '</div>';
}

function patientShell(active) {
  const patientId = getActivePatientId();
  const patient = (window.HearIntelDB && window.HearIntelDB.getPatient(patientId)) || { name: 'Amaia O.', mrn: 'LCC-26-01248', age: 46, gender: 'Female' };
  const currentTheme = getActiveTheme();
  const authContext = getPmsAuthContext();

  const isRegistry   = active === 'patients' || active === 'registry';
  const isProfile    = active === 'profile';
  const isAssessment = ['assessment','history','otoscopy','pta','immittance','speech','conclusion','electrophysiology'].includes(active);
  const showPatientSub = isRegistry || isProfile || isAssessment || active === 'media';
  const assessHref = '03-assessment-hub.html?patient=' + patientId;

  const canClinical = hasPmsPermission('clinical.view') || hasPmsPermission('clinical.write');
  const isFrontDesk = authContext.role === 'receptionist' || authContext.role === 'front_desk';
  const showPatientRecordLink = !isFrontDesk;

  const patientSub = (showPatientSub && canAccessPmsArea('patients'))
    ? '<div class="nav-sub">'
    +   '<a class="nav-sub-item ' + (isRegistry  ? 'active' : '') + '" href="01-registry.html">Registry</a>'
    +   (showPatientRecordLink ? '<a class="nav-sub-item ' + (isProfile   ? 'active' : '') + '" href="02-profile.html?patient=' + patientId + '">Patient Record</a>' : '')
    +   (canClinical ? '<a class="nav-sub-item ' + (isAssessment ? 'active' : '') + '" href="' + assessHref + '">Assessment</a>' : '')
    + '</div>'
    : '';

  const assessBlock = (patientId && patientId !== '' && canClinical)
    ? '<div class="sidebar-assessment-block">'
    +   '<div class="sidebar-assessment-label">Current Patient</div>'
    +   '<div class="sidebar-assessment-patient">' + patient.name + '</div>'
    +   '<a class="sidebar-assessment-link" href="' + assessHref + '">Resume session &#8594;</a>'
    + '</div>'
    : '';

  const html = [
    '<aside class="sidebar">',
      '<div class="brand">',
        '<div style="margin-bottom:12px;"><div style="display:inline-flex;align-items:center;padding:2px 4px;"><div style="color:#FFFFFF;font-size:22px;font-weight:800;letter-spacing:-0.03em;font-family:var(--font-heading);">Clinical<span style="color:var(--brand);"> PMS</span></div></div></div>',
        '<div class="brand-sub">Practice Management</div>',
      '</div>',
      renderRoleSwitcherHtml(authContext),
      '<nav class="nav-group">',
        '<div class="nav-section">Clinical Ops</div>',
        canAccessPmsArea('dashboard') ? '<a class="nav-item ' + (active === 'dashboard' ? 'active' : '') + '" href="00-dashboard.html" title="Dashboard">'
        + '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg></span>'
        + '<span class="nav-label">Dashboard</span>'
        + '</a>' : '',
        canAccessPmsArea('appointments') ? '<a class="nav-item ' + (active === 'appointments' ? 'active' : '') + '" href="01-appointments.html" title="Appointments & Clinic Schedule">'
        + '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg></span>'
        + '<span class="nav-label">Appointments</span>'
        + '</a>' : '',
        canAccessPmsArea('patients') ? '<a class="nav-item ' + (showPatientSub ? 'active' : '') + '" href="01-registry.html" title="Patients">'
        + '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>'
        + '<span class="nav-label">Patients</span>'
        + '</a>' : '',
        patientSub,
        canAccessPmsArea('screening') ? '<a class="nav-item ' + (active === 'screening' ? 'active' : '') + '" href="13-workspace-screening.html?patient=' + patientId + '" title="Hearing Screening">'
        + '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg></span>'
        + '<span class="nav-label">Screening</span>'
        + '</a>' : '',
        canAccessPmsArea('media') ? '<a class="nav-item ' + (active === 'media' ? 'active' : '') + '" href="10-media.html?patient=' + patientId + '" title="Clinical Media">'
        + '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg></span>'
        + '<span class="nav-label">Clinical Media</span>'
        + '</a>' : '',
        canAccessPmsArea('settings') ? '<a class="nav-item ' + (active === 'settings' ? 'active' : '') + '" href="11-settings.html" title="Settings">'
        + '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83-2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span>'
        + '<span class="nav-label">Settings</span>'
        + '</a>' : '',
      '</nav>',
      assessBlock ? '<div class="sidebar-divider"></div>' : '',
      assessBlock,
      '<div class="sidebar-divider"></div>',
      '<div class="sidebar-footer" onclick="openPatientLookupModal()" title="Search or switch patient">',
        '<div class="sidebar-footer-row">',
          '<span class="sidebar-footer-name">' + patient.name + '</span>',
          '<span class="sidebar-footer-switch">Switch</span>',
        '</div>',
        '<div class="sidebar-footer-meta">' + patient.age + 'y &middot; ' + patient.gender + ' &middot; ' + patient.mrn + '</div>',
'</div>',
    '</aside>'
  ].join('');
  return html;
}


// ── CLINICAL MODULE DEFINITIONS & REASSESSMENT ARCHITECTURE ──
const MODULE_NAMES = {
  'history': 'Case History Intake',
  'otoscopy': 'Otoscopy Examination',
  'pta': 'Pure Tone Audiometry (PTA)',
  'immittance': 'Immittance & Tympanometry',
  'speech': 'Speech Audiometry',
  'electrophysiology': 'Electrophysiology (ABR/OAE)',
  'conclusion': 'Diagnosis & Care Plan'
};

const MODULE_SHORT_NAMES = {
  'history': 'History',
  'otoscopy': 'Otoscopy',
  'pta': 'PTA',
  'immittance': 'Immittance',
  'speech': 'Speech',
  'electrophysiology': 'E-Physiology',
  'conclusion': 'Management'
};

function getCurrentClinicalDate() {
  const d = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function getModuleStatus(patient, moduleKey, isActive) {
  if (!patient) return { status: 'not-started', icon: '○', label: 'Not Started', date: '' };

  const latestAssess = (patient.assessments && patient.assessments[0]) || null;
  const testInstances = (patient.testInstances && patient.testInstances[moduleKey]) || [];
  
  // Check red flag status
  const hasRedFlag = (sessionStorage.getItem('red_flag_' + patient.id) === 'true') || 
                     (sessionStorage.getItem('rf_active_' + patient.id) === 'true');

  if (moduleKey === 'history') {
    if (hasRedFlag && !isGateOverridden('history', patient.id)) {
      return { status: 'attention', icon: '!', label: 'Needs Attention', date: 'Flagged' };
    }
    if (latestAssess || testInstances.length > 0) {
      const d = testInstances[0]?.date || latestAssess?.date || getCurrentClinicalDate();
      return { status: 'done', icon: '✓', label: 'Done', date: d };
    }
  }

  if (moduleKey === 'otoscopy') {
    if (latestAssess?.otoscopy || testInstances.length > 0) {
      const d = testInstances[0]?.date || latestAssess?.date || getCurrentClinicalDate();
      return { status: 'done', icon: '✓', label: 'Done', date: d };
    }
  }

  if (moduleKey === 'pta') {
    if (latestAssess?.ptaRight !== undefined || testInstances.length > 0) {
      const d = testInstances[0]?.date || latestAssess?.date || getCurrentClinicalDate();
      return { status: 'done', icon: '✓', label: 'Done', date: d };
    }
  }

  if (moduleKey === 'immittance') {
    if (latestAssess?.tymp || testInstances.length > 0) {
      const d = testInstances[0]?.date || latestAssess?.date || getCurrentClinicalDate();
      return { status: 'done', icon: '✓', label: 'Done', date: d };
    }
  }

  if (moduleKey === 'speech') {
    if (latestAssess?.speech || testInstances.length > 0) {
      const d = testInstances[0]?.date || latestAssess?.date || getCurrentClinicalDate();
      return { status: 'done', icon: '✓', label: 'Done', date: d };
    }
  }

  if (moduleKey === 'electrophysiology') {
    if (testInstances.length > 0 || (patient.media && patient.media.some(m => m.category === 'Electrophysiology'))) {
      const d = testInstances[0]?.date || getCurrentClinicalDate();
      return { status: 'done', icon: '✓', label: 'Done', date: d };
    }
  }

  if (moduleKey === 'conclusion') {
    if (latestAssess?.recommendations || patient.carePlan?.length > 0 || testInstances.length > 0) {
      const d = testInstances[0]?.date || latestAssess?.date || getCurrentClinicalDate();
      return { status: 'done', icon: '✓', label: 'Done', date: d };
    }
  }

  if (isActive) {
    return { status: 'in-progress', icon: '●', label: 'In Progress', date: 'Active' };
  }

  return { status: 'not-started', icon: '○', label: 'Not Started', date: '' };
}

function isGateOverridden(moduleKey, patientId) {
  return sessionStorage.getItem('safety_override_' + patientId + '_' + moduleKey) === 'true';
}

function overrideClinicalGate(moduleKey) {
  const patientId = getActivePatientId();
  sessionStorage.setItem('safety_override_' + patientId + '_' + moduleKey, 'true');
  const gateEl = document.getElementById('clinicalSafetyGate');
  if (gateEl) {
    gateEl.style.transition = 'opacity 180ms ease, transform 180ms ease';
    gateEl.style.opacity = '0';
    gateEl.style.transform = 'translateY(-4px)';
    setTimeout(() => {
      gateEl.outerHTML = `
        <div class="alert-strip info" style="margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;">
          <span style="font-size:12px;color:var(--text-secondary);">
            ✓ <strong>Clinical Gate Overridden:</strong> Attending audiologist authorized continuation of ${MODULE_SHORT_NAMES[moduleKey] || moduleKey.toUpperCase()}.
          </span>
          <span style="font-size:11px;font-family:var(--font-mono);color:var(--text-tertiary);">Override Logged</span>
        </div>
      `;
    }, 180);
  }
  notify(`Clinical safety gate overridden for ${MODULE_SHORT_NAMES[moduleKey] || moduleKey}. Authorized by clinician.`);
}

function renderClinicalSafetyGate(moduleKey, patientId) {
  if (!['pta', 'immittance', 'speech'].includes(moduleKey)) return '';
  if (isGateOverridden(moduleKey, patientId)) return '';

  const hasRedFlag = (sessionStorage.getItem('red_flag_' + patientId) === 'true') ||
                     (sessionStorage.getItem('rf_active_' + patientId) === 'true');

  if (!hasRedFlag) return '';

  return `
    <div class="alert-strip danger clinical-safety-gate" id="clinicalSafetyGate" style="margin-bottom:14px;">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap;">
        <div style="flex:1;min-width:240px;">
          <div style="font-weight:700;font-size:12.5px;margin-bottom:3px;color:var(--status-alert-text);display:flex;align-items:center;gap:6px;">
            <span>⚠</span> Clinical Safety Warning: Unresolved Medical Red Flag
          </div>
          <div style="font-size:12px;line-height:1.5;color:var(--text-primary);">
            Case history indicates acute symptoms (e.g. sudden onset / pain / drainage) requiring otologic clearance prior to diagnostic acoustic stimulation.
          </div>
          <div style="font-size:11px;color:var(--text-secondary);margin-top:4px;">
            <strong>Prerequisite Missing:</strong> Formal Medical Red Flag Clearance from ENT or supervising physician.
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <a class="btn" href="04-workspace-history.html?patient=${patientId}" style="font-size:11.5px;padding:5px 10px;">Review History</a>
          <button class="btn" style="padding:5px 12px;font-size:11.5px;background:var(--surface);border:1px solid var(--border);color:var(--status-alert-text);font-weight:600;" onclick="overrideClinicalGate('${moduleKey}')">
            Authorized Override
          </button>
        </div>
      </div>
    </div>
  `;
}

function getTestInstances(moduleKey, patientId) {
  const patient = (window.HearIntelDB && window.HearIntelDB.getPatient(patientId));
  if (!patient) return [];
  if (!patient.testInstances) patient.testInstances = {};
  
  const today = getCurrentClinicalDate();
  const shortName = MODULE_SHORT_NAMES[moduleKey] || moduleKey.toUpperCase();

  if (!patient.testInstances[moduleKey]) {
    patient.testInstances[moduleKey] = [
      {
        id: moduleKey + '-inst-1',
        instanceNumber: 1,
        name: `${shortName} — Baseline (${today})`,
        date: today,
        clinician: 'Dr. Chika Okafor, Au.D.',
        status: 'completed',
        isDefaultName: true
      }
    ];
    if (window.HearIntelDB && window.HearIntelDB.savePatient) {
      window.HearIntelDB.savePatient(patient);
    }
  } else {
    // Dynamically migrate any hardcoded legacy dates in default instance names
    let changed = false;
    patient.testInstances[moduleKey].forEach(inst => {
      if (inst.date === '20 May 2026' || inst.date === '7 Sep 2026') {
        inst.date = today;
        changed = true;
      }
      if (inst.isDefaultName || (inst.name && (inst.name.includes('20 May 2026') || inst.name.includes('7 Sep 2026')))) {
        inst.name = inst.instanceNumber === 1 
          ? `${shortName} — Baseline (${inst.date})`
          : `${shortName} — Reassessment ${inst.instanceNumber} — ${inst.date}`;
        changed = true;
      }
    });
    if (changed && window.HearIntelDB && window.HearIntelDB.savePatient) {
      window.HearIntelDB.savePatient(patient);
    }
  }
  return patient.testInstances[moduleKey];
}

function getActiveInstanceIndex(moduleKey, patientId) {
  const key = 'active_inst_' + patientId + '_' + moduleKey;
  const idx = sessionStorage.getItem(key);
  return idx !== null ? parseInt(idx, 10) : 0;
}

function setActiveInstanceIndex(moduleKey, patientId, index) {
  const key = 'active_inst_' + patientId + '_' + moduleKey;
  sessionStorage.setItem(key, index.toString());
}

function handleReassess(moduleKey) {
  const patientId = getActivePatientId();
  const patient = (window.HearIntelDB && window.HearIntelDB.getPatient(patientId));
  const instances = getTestInstances(moduleKey, patientId);
  const nextNum = instances.length + 1;
  const shortName = MODULE_SHORT_NAMES[moduleKey] || moduleKey.toUpperCase();
  const today = getCurrentClinicalDate();
  const defaultName = `${shortName} — Reassessment ${nextNum} — ${today}`;

  const newInstance = {
    id: `${moduleKey}-inst-${nextNum}`,
    instanceNumber: nextNum,
    name: defaultName,
    date: today,
    clinician: 'Dr. Chika Okafor, Au.D.',
    status: 'in-progress',
    isDefaultName: true
  };

  instances.push(newInstance);
  if (patient) {
    patient.testInstances[moduleKey] = instances;
    if (window.HearIntelDB && window.HearIntelDB.savePatient) {
      window.HearIntelDB.savePatient(patient);
    }
  }
  setActiveInstanceIndex(moduleKey, patientId, instances.length - 1);
  notify(`Reassessment initiated: ${defaultName}. Prior results preserved in history.`);
  if (typeof location !== 'undefined' && location.reload) {
    location.reload();
  }
}

function handleHubReassess(moduleKey, targetUrl) {
  const patientId = getActivePatientId();
  const patient = (window.HearIntelDB && window.HearIntelDB.getPatient(patientId));
  const instances = getTestInstances(moduleKey, patientId);
  const nextNum = instances.length + 1;
  const shortName = MODULE_SHORT_NAMES[moduleKey] || moduleKey.toUpperCase();
  const today = getCurrentClinicalDate();
  const defaultName = `${shortName} — Reassessment ${nextNum} — ${today}`;

  const newInstance = {
    id: `${moduleKey}-inst-${nextNum}`,
    instanceNumber: nextNum,
    name: defaultName,
    date: today,
    clinician: 'Dr. Chika Okafor, Au.D.',
    status: 'in-progress',
    isDefaultName: true
  };

  instances.push(newInstance);
  if (patient) {
    if (!patient.testInstances) patient.testInstances = {};
    patient.testInstances[moduleKey] = instances;
    if (window.HearIntelDB && window.HearIntelDB.savePatient) {
      window.HearIntelDB.savePatient(patient);
    }
  }
  setActiveInstanceIndex(moduleKey, patientId, instances.length - 1);
  notify(`Reassessment initiated for ${MODULE_NAMES[moduleKey] || shortName}.`);
  setTimeout(() => {
    location.href = targetUrl;
  }, 250);
}


function saveInstanceName(moduleKey, inputEl) {
  const patientId = getActivePatientId();
  const patient = (window.HearIntelDB && window.HearIntelDB.getPatient(patientId));
  const instances = getTestInstances(moduleKey, patientId);
  const activeIdx = getActiveInstanceIndex(moduleKey, patientId);
  const currentInst = instances[activeIdx];
  if (!currentInst) return;

  const val = inputEl.value.trim();
  const shortName = MODULE_SHORT_NAMES[moduleKey] || moduleKey.toUpperCase();
  const fallback = currentInst.instanceNumber === 1 
    ? `${shortName} — ${currentInst.date}` 
    : `${shortName} — Reassessment ${currentInst.instanceNumber} — ${currentInst.date}`;

  if (val) {
    currentInst.name = val;
    currentInst.isDefaultName = false;
  } else {
    currentInst.name = fallback;
    currentInst.isDefaultName = true;
    inputEl.value = fallback;
  }
  if (patient) {
    patient.testInstances[moduleKey] = instances;
    if (window.HearIntelDB && window.HearIntelDB.savePatient) {
      window.HearIntelDB.savePatient(patient);
    }
  }
  notify(`Instance title saved: "${currentInst.name}"`);
}

function switchTestInstance(moduleKey, targetIndex) {
  const patientId = getActivePatientId();
  setActiveInstanceIndex(moduleKey, patientId, parseInt(targetIndex, 10));
  notify(`Switched to test instance #${parseInt(targetIndex, 10) + 1}.`);
  location.reload();
}

function renderTestInstanceStrip(moduleKey, patientId) {
  const instances = getTestInstances(moduleKey, patientId);
  const activeIdx = getActiveInstanceIndex(moduleKey, patientId);
  const currentInst = instances[activeIdx] || instances[0];
  const shortName = MODULE_SHORT_NAMES[moduleKey] || moduleKey.toUpperCase();
  const isRepeat = instances.length > 1;

  const defaultPlaceholder = currentInst.instanceNumber === 1 
    ? `${shortName} — ${currentInst.date}` 
    : `${shortName} — Reassessment ${currentInst.instanceNumber} — ${currentInst.date}`;

  const displayVal = currentInst.name || defaultPlaceholder;

  return `
    <div class="test-instance-strip">
      <div class="test-instance-group">
        <label class="test-instance-label" for="testInstanceInput">
          Instance:
        </label>
        <input type="text" id="testInstanceInput" class="test-instance-input"
          value="${displayVal}" 
          placeholder="${defaultPlaceholder}" 
          onblur="saveInstanceName('${moduleKey}', this)"
          title="Optional custom name for this test instance">
        <span style="font-size:11px;color:var(--text-tertiary);font-family:var(--font-sans);">(Optional label)</span>
      </div>

      <div class="test-instance-actions">
        ${isRepeat ? `
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="font-size:11px;color:var(--text-secondary);font-weight:500;">Run:</span>
            <select onchange="switchTestInstance('${moduleKey}', this.value)" style="font-size:11.5px;padding:3px 8px;border:1px solid var(--border);border-radius:var(--radius-xs);background:var(--surface);color:var(--text-primary);cursor:pointer;">
              ${instances.map((inst, i) => `
                <option value="${i}" ${i === activeIdx ? 'selected' : ''}>
                  #${inst.instanceNumber}: ${inst.name}
                </option>
              `).join('')}
            </select>
          </div>
        ` : ''}
        <button class="btn-reassess" onclick="handleReassess('${moduleKey}')" title="Run another test instance without overwriting prior result">
          + Reassess
        </button>
      </div>
    </div>
  `;
}


function workspaceShell(active, content) {
  const patientId = getActivePatientId();
  const patient = (window.HearIntelDB && window.HearIntelDB.getPatient(patientId)) || { name: 'Amaia O.', mrn: 'LCC-26-01248', age: 46, gender: 'Female' };
  const currentTheme = getActiveTheme();
  const authContext = getPmsAuthContext();
  const patientAccess = getPatientAccessState(patient, active);
  const workspaceAllowed = canAccessPmsArea(active) && patientAccess.clinicalAllowed;
  const assessHref = '03-assessment-hub.html?patient=' + patientId;

  // Unconditional, decoupled navigation steps
  const steps = [
    ['04-workspace-history.html?patient=' + patientId, 'History',          '1', active === 'history', 'history'],
    ['05-workspace-otoscopy.html?patient=' + patientId, 'Otoscopy',         '2', active === 'otoscopy', 'otoscopy'],
    ['06-workspace-pta.html?patient=' + patientId,      'Pure Tone (PTA)',  '3', active === 'pta', 'pta'],
    ['07-workspace-immittance.html?patient=' + patientId,'Immittance',      '4', active === 'immittance', 'immittance'],
    ['08-workspace-speech.html?patient=' + patientId,   'Speech',           '5', active === 'speech', 'speech'],
    ['12-workspace-electrophysiology.html?patient=' + patientId, 'E-Physiology', '6', active === 'electrophysiology', 'electrophysiology'],
    ['09-conclusion.html?patient=' + patientId,         'Management',       '7', active === 'conclusion', 'conclusion'],
  ];

  const canClinical = hasPmsPermission('clinical.view') || hasPmsPermission('clinical.write');
  const sidebarHtml = [
    '<aside class="sidebar">',
      '<div class="brand">',
        '<div style="margin-bottom:12px;"><div style="display:inline-flex;align-items:center;padding:2px 4px;"><div style="color:#FFFFFF;font-size:22px;font-weight:800;letter-spacing:-0.03em;font-family:var(--font-heading);">Clinical<span style="color:var(--brand);"> PMS</span></div></div></div>',
        '<div class="brand-sub">Assessment</div>',
      '</div>',
      renderRoleSwitcherHtml(authContext),
      '<nav class="nav-group">',
        '<div class="nav-section">Clinical Ops</div>',
        canAccessPmsArea('dashboard') ? '<a class="nav-item" href="00-dashboard.html" title="Dashboard">'
        + '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg></span>'
        + '<span class="nav-label">Dashboard</span>'
        + '</a>' : '',
        canAccessPmsArea('appointments') ? '<a class="nav-item" href="01-appointments.html" title="Appointments & Clinic Schedule">'
        + '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg></span>'
        + '<span class="nav-label">Appointments</span>'
        + '</a>' : '',
        canAccessPmsArea('patients') ? '<a class="nav-item active" href="01-registry.html" title="Patients">'
        + '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>'
        + '<span class="nav-label">Patients</span>'
        + '</a>' : '',
        canAccessPmsArea('patients') ? ('<div class="nav-sub">'
          + '<a class="nav-sub-item" href="01-registry.html">Registry</a>'
          + ((authContext.role !== 'receptionist' && authContext.role !== 'front_desk') ? '<a class="nav-sub-item" href="02-profile.html?patient=' + patientId + '">Patient Record</a>' : '')
          + (canClinical ? '<a class="nav-sub-item active" href="' + assessHref + '">Assessment</a>' : '')
          + '</div>') : '',
        canAccessPmsArea('screening') ? '<a class="nav-item ' + (active === 'screening' ? 'active' : '') + '" href="13-workspace-screening.html?patient=' + patientId + '" title="Screening">'
        + '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg></span>'
        + '<span class="nav-label">Screening</span>'
        + '</a>' : '',
        canAccessPmsArea('media') ? '<a class="nav-item" href="10-media.html?patient=' + patientId + '" title="Clinical Media">'
        + '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg></span>'
        + '<span class="nav-label">Clinical Media</span>'
        + '</a>' : '',
        canAccessPmsArea('settings') ? '<a class="nav-item" href="11-settings.html" title="Settings">'
        + '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83-2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span>'
        + '<span class="nav-label">Settings</span>'
        + '</a>' : '',
      '</nav>',
      canClinical ? ('<div class="sidebar-divider"></div>'
        + '<div class="sidebar-assessment-block">'
        +   '<div class="sidebar-assessment-label">Current Patient</div>'
        +   '<div class="sidebar-assessment-patient">' + patient.name + '</div>'
        +   '<a class="sidebar-assessment-link" href="02-profile.html?patient=' + patientId + '">&#8592; Back to Record</a>'
        + '</div>') : '',
      '<div class="sidebar-divider"></div>',
      '<div class="sidebar-footer" onclick="openPatientLookupModal()" title="Search or switch patient">',
        '<div class="sidebar-footer-row">',
          '<span class="sidebar-footer-name">' + patient.name + '</span>',
          '<span class="sidebar-footer-switch">Switch</span>',
        '</div>',
        '<div class="sidebar-footer-meta">' + patient.age + 'y &middot; ' + patient.gender + ' &middot; ' + patient.mrn + '</div>',
      '</div>',
    '</aside>'
  ].join('');

  const safetyGateHtml = renderClinicalSafetyGate(active, patientId);
  const instanceStripHtml = renderTestInstanceStrip(active, patientId);

  const workspaceHtml = [
    '<div class="workspace-main">',
      '<header class="encounter-header">',
        '<div style="display:flex;align-items:center;gap:14px;">',
          '<a class="btn" href="03-assessment-hub.html?patient=' + patientId + '" style="background:rgba(255,255,255,0.08);color:#FFFFFF;border:1px solid rgba(255,255,255,0.18);display:inline-flex;align-items:center;gap:6px;padding:4px 10px;font-size:11.5px;text-decoration:none;border-radius:var(--radius-sm);" title="Return to Assessment Overview Hub">',
            '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
            'Assessment Overview',
          '</a>',
          '<div>',
            '<div class="encounter-title">Active Clinical Diagnostic Assessment</div>',
            '<div class="encounter-patient">' + patient.name + ' &middot; ' + patient.mrn + ' &middot; Consultation Room 1</div>',
          '</div>',
        '</div>',
        '<div class="encounter-actions">',
          '<a class="btn" href="02-profile.html?patient=' + patientId + '" style="background:rgba(255,255,255,0.08);color:#FFFFFF;border:1px solid rgba(255,255,255,0.15);">Exit Session</a>',
        '</div>',
      '</header>',
      '<nav class="steps-nav">',
        steps.map(function(s) {
          const statusInfo = getModuleStatus(patient, s[4], s[3]);
          const statusClass = statusInfo.status;
          return '<a class="step-item ' + (s[3] ? 'active ' : '') + statusClass + '" href="' + s[0] + '">' +
                   '<span class="step-num">' + s[2] + '</span>' +
                   '<div class="step-content">' +
                     '<span class="step-label">' + s[1] + '</span>' +
                     '<span class="step-meta">' +
                       '<span class="step-status-badge ' + statusClass + '">' + statusInfo.icon + '</span> ' +
                       '<span>' + (statusInfo.date ? statusInfo.date : statusInfo.label) + '</span>' +
                     '</span>' +
                   '</div>' +
                 '</a>';
        }).join(''),
      '</nav>',
      '<div class="workspace-body">',
        workspaceAllowed ? safetyGateHtml : '',
        workspaceAllowed ? instanceStripHtml : '',
        workspaceAllowed ? content : renderPatientLimitedView(patient, MODULE_SHORT_NAMES[active] || 'Assessment'),
      '</div>',
    '</div>'
  ].join('');

  return sidebarHtml + workspaceHtml;
}


// ── Universal Shell Initializer ──
document.addEventListener('DOMContentLoaded', function() {
  var shellHolders = document.querySelectorAll('[data-shell]');
  shellHolders.forEach(function(holder) {
    var activePage = holder.getAttribute('data-shell');
    holder.outerHTML = patientShell(activePage);
    if (!canAccessPmsArea(activePage)) {
      var main = document.querySelector('main.main');
      if (main) {
        main.innerHTML = '<section class="page">' + renderAuthDenied(activePage.charAt(0).toUpperCase() + activePage.slice(1)) + '</section>';
      }
    } else if (['profile', 'assessment', 'media'].indexOf(activePage) !== -1) {
      var patient = window.HearIntelDB ? window.HearIntelDB.getPatient(getActivePatientId()) : null;
      var patientAccess = getPatientAccessState(patient, activePage);
      if (!patientAccess.clinicalAllowed && activePage !== 'profile') {
        var protectedMain = document.querySelector('main.main');
        if (protectedMain) {
          protectedMain.innerHTML = '<section class="page">' + renderPatientLimitedView(patient, activePage) + '</section>';
        }
      } else if (!patientAccess.clinicalAllowed && activePage === 'profile') {
        var profileMain = document.querySelector('main.main');
        if (profileMain) {
          profileMain.innerHTML = '<section class="page">' + renderPatientLimitedView(patient, 'Patient Record') + '</section>';
        }
      }
    }
  });

  var wsHolders = document.querySelectorAll('[data-workspace-page]');
  wsHolders.forEach(function(holder) {
    var pageKey = holder.getAttribute('data-workspace-page');
    var innerContent = holder.innerHTML;
    holder.outerHTML = workspaceShell(pageKey, innerContent);
  });

  document.documentElement.setAttribute('data-theme', getActiveTheme());
});

// ── MASTER CLINICAL REPORT ENGINE (LONGITUDINAL EMR & AUDIENCE SYSTEM) ──
let currentReportPatientId = 'amaia';
let currentReportType = 'full';
let currentReportTimeframe = 'all'; // 'all', '12m', '6m', 'latest'
let reportMode = 'longitudinal'; // 'longitudinal' | 'single_encounter'
let currentEncounterId = null;

function openReportModal(patientId, reportType = 'full') {
  currentReportPatientId = patientId || getActivePatientId() || 'amaia';
  currentReportType = reportType || 'full';
  currentReportTimeframe = 'all';
  reportMode = 'longitudinal';
  currentEncounterId = null;

  let modal = document.getElementById('reportExportModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'reportExportModal';
    modal.className = 'report-modal-backdrop';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="report-modal-window">
      <!-- Top Administrative Controls Bar -->
      <div class="report-modal-header">
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:8px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
            <strong style="font-size:14px;color:#FFFFFF;white-space:nowrap;">Clinical EMR Report</strong>
          </div>
          
          <select id="reportTypeSelector" onchange="switchReportView(this.value)" style="padding:6px 12px;font-size:12.5px;font-weight:600;background:#1E293B;color:#F8FAFC;border:1px solid rgba(255,255,255,0.2);border-radius:4px;cursor:pointer;">
            <option value="full" ${currentReportType === 'full' ? 'selected' : ''}>Full Longitudinal Clinical Journey (Complete EMR Record)</option>
            <option value="ent_referral" ${currentReportType === 'ent_referral' ? 'selected' : ''}>Specialist ENT / Medical Referral Synthesis</option>
            <option value="audiology_battery" ${currentReportType === 'audiology_battery' ? 'selected' : ''}>Diagnostic Audiology Battery &amp; Quantitative Data Only</option>
            <option value="patient_summary" ${currentReportType === 'patient_summary' ? 'selected' : ''}>Patient &amp; Family Care Plan / Aural Rehab Summary</option>
            <option value="screening" ${currentReportType === 'screening' ? 'selected' : ''}>Hearing Health Screening Report</option>
          </select>

          <select id="reportTimeframeSelector" onchange="switchReportTimeframe(this.value)" style="padding:6px 12px;font-size:12.5px;font-weight:600;background:#1E293B;color:#F8FAFC;border:1px solid rgba(255,255,255,0.2);border-radius:4px;cursor:pointer;">
            <option value="all" ${currentReportTimeframe === 'all' ? 'selected' : ''}>All Historical Encounters</option>
            <option value="12m" ${currentReportTimeframe === '12m' ? 'selected' : ''}>Past 12 Months</option>
            <option value="6m" ${currentReportTimeframe === '6m' ? 'selected' : ''}>Past 6 Months</option>
            <option value="latest" ${currentReportTimeframe === 'latest' ? 'selected' : ''}>Latest Evaluation Only</option>
          </select>
        </div>

        <div style="display:flex;align-items:center;gap:10px;">
          <button class="btn ghost" style="min-height:28px;padding:0 8px;font-size:16px;color:rgba(255,255,255,0.7);" onclick="closeReportModal()" title="Close">✕</button>
        </div>
      </div>

      <!-- Quick-Jump Document Navigation Bar (Populated dynamically) -->
      <div id="reportNavJumpBar" style="background:#0F172A;border-bottom:1px solid rgba(255,255,255,0.08);padding:7px 20px;display:flex;gap:6px;overflow-x:auto;font-size:11px;white-space:nowrap;">
        <!-- Generated by renderReportContent -->
      </div>

      <!-- Scrollable Document Desk Background -->
      <div class="report-modal-body" id="reportModalBodyContainer">
        <div class="report-paper" id="reportPaperContent">
          <!-- Live generated report content -->
        </div>
      </div>

      <!-- Bottom Action Footer -->
      <div class="report-modal-header" style="background:#0F172A;border-top:1px solid rgba(255,255,255,0.08);border-bottom:none;justify-content:space-between;">
        <div style="font-size:11.5px;color:rgba(255,255,255,0.6);display:flex;align-items:center;gap:6px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Clinical EMR System &middot; A4 Multi-Page Compliant
        </div>
        <div style="display:flex;gap:10px;">
          <button class="btn" onclick="saveReportToMedia()" style="background:rgba(255,255,255,0.08);color:#FFFFFF;border:1px solid rgba(255,255,255,0.15);font-size:12px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save to Patient Documents
          </button>
          <button class="btn primary" onclick="printReportDocument()" style="background:#0891B2;color:#FFFFFF;border:none;box-shadow:0 2px 8px rgba(8,145,178,0.4);font-size:12px;font-weight:600;">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
            Download / Print PDF
          </button>
        </div>
      </div>
    </div>
  `;

  renderReportContent();
  setupReportScrollSpy();
  modal.style.display = 'flex';
}

function closeReportModal() {
  const modal = document.getElementById('reportExportModal');
  if (modal) {
    modal.style.display = 'none';
    reportMode = 'longitudinal';
  }
}

function switchReportView(type) {
  currentReportType = type;
  renderReportContent();
}

function switchReportTimeframe(tf) {
  currentReportTimeframe = tf;
  renderReportContent();
}

// ── Interactive Jump Scroll with Active Color State ──
function reportScrollTo(sectionId, el) {
  const container = document.getElementById('reportModalBodyContainer');
  const target = document.getElementById(sectionId);
  
  if (el) {
    document.querySelectorAll('.report-nav-item').forEach(item => {
      item.classList.remove('active');
      item.style.color = '#94A3B8';
      item.style.background = 'transparent';
      item.style.borderColor = 'transparent';
      item.style.fontWeight = '500';
    });
    el.classList.add('active');
    el.style.color = '#38BDF8';
    el.style.background = 'rgba(56, 189, 248, 0.18)';
    el.style.borderColor = 'rgba(56, 189, 248, 0.35)';
    el.style.fontWeight = '700';
  }

  if (container && target) {
    const offset = target.offsetTop - 15;
    container.scrollTo({ top: offset, behavior: 'smooth' });
  }
}

function setupReportScrollSpy() {
  const container = document.getElementById('reportModalBodyContainer');
  if (!container) return;

  container.onscroll = function() {
    const sections = container.querySelectorAll('.report-section[id]');
    let activeSecId = null;
    const cScroll = container.scrollTop;

    sections.forEach(sec => {
      if (sec.offsetTop - 60 <= cScroll) {
        activeSecId = sec.id;
      }
    });

    if (activeSecId) {
      document.querySelectorAll('.report-nav-item').forEach(item => {
        if (item.dataset.sec === activeSecId) {
          item.classList.add('active');
          item.style.color = '#38BDF8';
          item.style.background = 'rgba(56, 189, 248, 0.18)';
          item.style.borderColor = 'rgba(56, 189, 248, 0.35)';
          item.style.fontWeight = '700';
        } else {
          item.classList.remove('active');
          item.style.color = '#94A3B8';
          item.style.background = 'transparent';
          item.style.borderColor = 'transparent';
          item.style.fontWeight = '500';
        }
      });
    }
  };
}

// ── MASTER SVG AUDIOGRAM GENERATOR ──
function generateReportAudiogramSvg(currentThresholds, baselineThresholds = null) {
  const freqs = [125, 250, 500, 1000, 2000, 3000, 4000, 6000, 8000];
  const dBs = [-10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

  const width = 640;
  const height = 300;
  const pL = 50;
  const pR = 30;
  const pT = 30;
  const pB = 35;

  const plotW = width - pL - pR;
  const plotH = height - pT - pB;

  const getX = (f) => {
    const idx = freqs.indexOf(f);
    if (idx !== -1) return pL + (idx / (freqs.length - 1)) * plotW;
    const minL = Math.log10(125);
    const maxL = Math.log10(8000);
    return pL + ((Math.log10(f) - minL) / (maxL - minL)) * plotW;
  };

  const getY = (db) => pT + ((db - (-10)) / (120 - (-10))) * plotH;

  let svg = `<svg viewBox="0 0 ${width} ${height}" style="width:100%;max-width:${width}px;background:#FFFFFF;border:1px solid #CBD5E1;border-radius:4px;font-family:'DM Sans',sans-serif;">`;

  // Shaded Normal Hearing Zone
  const normY1 = getY(0);
  const normY2 = getY(20);
  svg += `<rect x="${pL}" y="${normY1}" width="${plotW}" height="${normY2 - normY1}" fill="#F0FDF4" opacity="0.8"/>`;
  svg += `<text x="${pL + 8}" y="${normY2 - 4}" font-size="9" fill="#16A34A" font-weight="600">Normal Hearing Range (&le;20 dB HL)</text>`;

  // Horizontal Grid
  dBs.forEach(db => {
    const y = getY(db);
    const isMajor = db === 0 || db === 20 || db === 40 || db === 70 || db === 90;
    svg += `<line x1="${pL}" y1="${y}" x2="${pL + plotW}" y2="${y}" stroke="${isMajor ? '#94A3B8' : '#E2E8F0'}" stroke-width="${isMajor ? 1 : 0.75}" stroke-dasharray="${db === 20 ? '4 2' : 'none'}"/>`;
    svg += `<text x="${pL - 8}" y="${y + 3.5}" font-size="9.5" font-weight="${isMajor ? 700 : 500}" fill="#475569" text-anchor="end">${db}</text>`;
  });

  // Vertical Grid
  freqs.forEach(f => {
    const x = getX(f);
    const isInter = f === 3000 || f === 6000;
    svg += `<line x1="${x}" y1="${pT}" x2="${x}" y2="${pT + plotH}" stroke="${isInter ? '#CBD5E1' : '#94A3B8'}" stroke-width="${isInter ? 0.75 : 1}" stroke-dasharray="${isInter ? '3 3' : 'none'}"/>`;
    svg += `<text x="${x}" y="${pT - 8}" font-size="10" font-weight="${isInter ? 500 : 700}" fill="#1E293B" text-anchor="middle">${f >= 1000 ? (f/1000)+'k' : f}</text>`;
  });

  // Axes
  svg += `<text x="${pL + plotW / 2}" y="${pT - 18}" font-size="10" font-weight="700" fill="#64748B" text-anchor="middle">Frequency (Hz)</text>`;
  svg += `<text x="${pL - 32}" y="${pT + plotH / 2}" font-size="10" font-weight="700" fill="#64748B" text-anchor="middle" transform="rotate(-90 ${pL - 32} ${pT + plotH / 2})">Hearing Level (dB HL)</text>`;

  // Baseline Overlay
  if (baselineThresholds) {
    if (baselineThresholds.acR) {
      let ptsR = [];
      Object.keys(baselineThresholds.acR).map(Number).sort((a,b)=>a-b).forEach(f => {
        const v = baselineThresholds.acR[f];
        if (v != null) ptsR.push(`${getX(f)},${getY(v)}`);
      });
      if (ptsR.length > 1) svg += `<polyline points="${ptsR.join(' ')}" fill="none" stroke="#FCA5A5" stroke-width="1.5" stroke-dasharray="4 3"/>`;
    }
    if (baselineThresholds.acL) {
      let ptsL = [];
      Object.keys(baselineThresholds.acL).map(Number).sort((a,b)=>a-b).forEach(f => {
        const v = baselineThresholds.acL[f];
        if (v != null) ptsL.push(`${getX(f)},${getY(v)}`);
      });
      if (ptsL.length > 1) svg += `<polyline points="${ptsL.join(' ')}" fill="none" stroke="#93C5FD" stroke-width="1.5" stroke-dasharray="4 3"/>`;
    }
  }

  // Right Ear AC (Red 'O')
  if (currentThresholds && currentThresholds.acR) {
    let pts = [];
    const fSorted = Object.keys(currentThresholds.acR).map(Number).sort((a,b)=>a-b);
    fSorted.forEach(f => {
      const val = currentThresholds.acR[f];
      if (val != null) pts.push(`${getX(f)},${getY(val)}`);
    });
    if (pts.length > 1) svg += `<polyline points="${pts.join(' ')}" fill="none" stroke="#DC2626" stroke-width="2.2"/>`;
    fSorted.forEach(f => {
      const val = currentThresholds.acR[f];
      if (val != null) svg += `<circle cx="${getX(f)}" cy="${getY(val)}" r="4.5" fill="#FFFFFF" stroke="#DC2626" stroke-width="2.2"/>`;
    });
  }

  // Right Ear BC (Red '<')
  if (currentThresholds && currentThresholds.bcR) {
    Object.keys(currentThresholds.bcR).map(Number).forEach(f => {
      const val = currentThresholds.bcR[f];
      if (val != null) {
        const cx = getX(f) - 6;
        const cy = getY(val);
        svg += `<path d="M${cx+4} ${cy-5} L${cx-2} ${cy} L${cx+4} ${cy+5}" fill="none" stroke="#DC2626" stroke-width="2"/>`;
      }
    });
  }

  // Left Ear AC (Blue 'X')
  if (currentThresholds && currentThresholds.acL) {
    let pts = [];
    const fSorted = Object.keys(currentThresholds.acL).map(Number).sort((a,b)=>a-b);
    fSorted.forEach(f => {
      const val = currentThresholds.acL[f];
      if (val != null) pts.push(`${getX(f)},${getY(val)}`);
    });
    if (pts.length > 1) svg += `<polyline points="${pts.join(' ')}" fill="none" stroke="#2563EB" stroke-width="2.2"/>`;
    fSorted.forEach(f => {
      const val = currentThresholds.acL[f];
      if (val != null) {
        const cx = getX(f);
        const cy = getY(val);
        svg += `<line x1="${cx-4}" y1="${cy-4}" x2="${cx+4}" y2="${cy+4}" stroke="#2563EB" stroke-width="2.2"/>`;
        svg += `<line x1="${cx+4}" y1="${cy-4}" x2="${cx-4}" y2="${cy+4}" stroke="#2563EB" stroke-width="2.2"/>`;
      }
    });
  }

  // Left Ear BC (Blue '>')
  if (currentThresholds && currentThresholds.bcL) {
    Object.keys(currentThresholds.bcL).map(Number).forEach(f => {
      const val = currentThresholds.bcL[f];
      if (val != null) {
        const cx = getX(f) + 6;
        const cy = getY(val);
        svg += `<path d="M${cx-4} ${cy-5} L${cx+2} ${cy} L${cx-4} ${cy+5}" fill="none" stroke="#2563EB" stroke-width="2"/>`;
      }
    });
  }

  // Legend
  const legY = height - 12;
  svg += `
    <g transform="translate(${pL}, ${legY})">
      <circle cx="5" cy="0" r="3.5" fill="#FFFFFF" stroke="#DC2626" stroke-width="1.8"/>
      <text x="13" y="3.5" font-size="10" font-weight="600" fill="#DC2626">Right AC (O)</text>
      <path d="M85 -4 L81 0 L85 4" fill="none" stroke="#DC2626" stroke-width="1.8"/>
      <text x="91" y="3.5" font-size="10" font-weight="600" fill="#DC2626">Right BC (&lt;)</text>
      <line x1="160" y1="-3.5" x2="167" y2="3.5" stroke="#2563EB" stroke-width="1.8"/>
      <line x1="167" y1="-3.5" x2="160" y2="3.5" stroke="#2563EB" stroke-width="1.8"/>
      <text x="173" y="3.5" font-size="10" font-weight="600" fill="#2563EB">Left AC (X)</text>
      <path d="M245 -4 L249 0 L245 4" fill="none" stroke="#2563EB" stroke-width="1.8"/>
      <text x="255" y="3.5" font-size="10" font-weight="600" fill="#2563EB">Left BC (&gt;)</text>
      ${baselineThresholds ? `
        <line x1="335" y1="0" x2="355" y2="0" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="3 2"/>
        <text x="360" y="3.5" font-size="10" font-weight="600" fill="#64748B">Baseline Overlay</text>
      ` : ''}
    </g>
  `;

  svg += `</svg>`;
  return svg;
}

// ── COMPREHENSIVE MULTI-AUDIENCE REPORT RENDERER ──
function renderReportContent() {
  if (reportMode === 'single_encounter') {
    renderSingleEncounterReport();
    return;
  }

  const paper = document.getElementById('reportPaperContent');
  const jumpBar = document.getElementById('reportNavJumpBar');
  if (!paper) return;

  const patient = window.HearIntelDB ? window.HearIntelDB.getPatient(currentReportPatientId) : null;
  if (!patient) {
    paper.innerHTML = '<div style="padding:40px;text-align:center;color:#64748B;">No patient record loaded.</div>';
    return;
  }

  const fullName  = patient.fullName || patient.name || 'Not Recorded';
  const mrn       = patient.mrn || 'Not Recorded';
  const dob       = patient.dob || 'Not Recorded';
  const age       = patient.age != null ? patient.age : 'Not Recorded';
  const gender    = patient.gender || 'Not Recorded';
  const phone     = patient.phone || 'Not Recorded';
  const insurance = patient.insurance || 'Private / Self-Pay';
  const referral  = patient.referral || 'Self-Referred';
  const clinician = patient.assignedClinician || 'Dr. Chika Okafor, Au.D.';
  const clinic    = patient.facility || patient.clinic || 'Lagos Central Hearing Clinic';
  const diag      = patient.primaryDiagnosis || 'Audiological Assessment Required';
  const lang      = patient.primaryLanguage || 'English';
  const license   = (window.HearIntelDB && window.HearIntelDB.currentClinician) ? window.HearIntelDB.currentClinician.license : 'MLSCN-AUD-2024-0891';

  // ── Timeframe Filtering ──
  const allEncounters = (patient.assessments || []).slice();
  let filteredEncs = allEncounters;
  const now = new Date();

  if (currentReportTimeframe === '12m') {
    const cutoff = new Date(now); cutoff.setFullYear(cutoff.getFullYear() - 1);
    filteredEncs = allEncounters.filter(e => new Date(e.date) >= cutoff || isNaN(new Date(e.date)));
  } else if (currentReportTimeframe === '6m') {
    const cutoff = new Date(now); cutoff.setMonth(cutoff.getMonth() - 6);
    filteredEncs = allEncounters.filter(e => new Date(e.date) >= cutoff || isNaN(new Date(e.date)));
  } else if (currentReportTimeframe === 'latest') {
    filteredEncs = allEncounters.length > 0 ? [allEncounters[0]] : [];
  }

  const latestEnc   = filteredEncs.length > 0 ? filteredEncs[0] : (allEncounters[0] || null);
  const baselineEnc = filteredEncs.length > 1 ? filteredEncs[filteredEncs.length - 1] : (allEncounters.length > 1 ? allEncounters[allEncounters.length - 1] : null);

  const reportGenDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const dateRangeStr  = baselineEnc ? `${baselineEnc.date} &ndash; ${latestEnc.date}` : (latestEnc ? latestEnc.date : reportGenDate);

  // ── Dynamic Jump Bar Links & Content based on Report Type ──
  let navItems = [];
  let headerTitle = '';
  let headerBadge = '';
  let bodyHtml = '';

  const gv = (th, track, f) => (th && th[track] && th[track][f] != null) ? th[track][f] : '-';

  if (currentReportType === 'full') {
    headerTitle = 'LONGITUDINAL CLINICAL JOURNEY &amp; COMPLETE EMR RECORD';
    headerBadge = '<span style="background:#0F766E;color:#FFFFFF;padding:3px 8px;border-radius:3px;font-size:10px;font-weight:700;">Complete Longitudinal Record</span>';

    navItems = [
      { id: 'sec-summary', label: '1. Summary' },
      { id: 'sec-timeline', label: '2. Timeline' },
      { id: 'sec-results', label: '3. Measurements' },
      { id: 'sec-audiogram', label: '4. Audiogram' },
      { id: 'sec-longitudinal', label: '5. Shift & Delta' },
      { id: 'sec-diagnoses', label: '6. Diagnoses' },
      { id: 'sec-careplan', label: '7. Care Plan' },
      { id: 'sec-media', label: '8. Media' },
      { id: 'sec-conclusion', label: '9. Conclusion' }
    ];

    // Summary
    bodyHtml += `
      <div class="report-section" id="sec-summary">
        <div class="report-section-title"><span>1. Comprehensive Clinical Synthesis &amp; Case Summary</span></div>
        <div class="report-box" style="line-height:1.6;">
          <div style="font-size:12.5px;color:#0F172A;margin-bottom:8px;">${patient.clinicalNote || 'Patient has undergone standardized clinical audiological evaluation.'}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px;padding-top:8px;border-top:1px solid #E2E8F0;font-size:11.5px;">
            <div><strong>Primary Diagnosis:</strong><div style="color:#0891B2;font-weight:700;">${diag}</div></div>
            <div><strong>Care Pathway:</strong><div style="color:#059669;font-weight:600;">${patient.pathwayLabel || 'Active Surveillance'} (${patient.status || 'Active'})</div></div>
          </div>
          <div style="margin-top:8px;padding:6px 10px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:4px;font-size:11.5px;color:#92400E;">
            <strong>Clinical Alerts:</strong> ${(patient.alerts && patient.alerts.length > 0) ? patient.alerts.join(' &middot; ') : 'No critical alerts.'}
          </div>
        </div>
      </div>
    `;

    // Timeline
    if (filteredEncs.length > 0) {
      bodyHtml += `
        <div class="report-section" id="sec-timeline">
          <div class="report-section-title"><span>2. Longitudinal Assessment Timeline (${filteredEncs.length} Recorded Visits)</span></div>
          <table class="report-table">
            <thead><tr><th>Date</th><th>Type</th><th>Clinician</th><th>Purpose</th><th>PTA (R/L)</th><th>Diagnosis</th><th>Action</th></tr></thead>
            <tbody>
              ${filteredEncs.map(e => `
                <tr>
                  <td style="font-weight:700;white-space:nowrap;">${e.date}</td>
                  <td><strong>${e.type}</strong></td>
                  <td>${e.clinician}</td>
                  <td>${e.reason || 'Diagnostic'}</td>
                  <td><span class="report-ear-r">${Math.round(e.ptaRight||0)} dB</span> / <span class="report-ear-l">${Math.round(e.ptaLeft||0)} dB</span></td>
                  <td>${e.diagnosis || 'SNHL'}</td>
                  <td><button style="font-size:10.5px;padding:2px 7px;background:#0891B2;color:#fff;border:none;border-radius:3px;cursor:pointer;" onclick="openAssessmentReport('${currentReportPatientId}','${e.id}')">Encounter Report</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    // Measurements
    if (latestEnc) {
      const th = latestEnc.thresholds || {};
      const tymp = latestEnc.tympanometry || {};
      const speech = latestEnc.speech || {};
      bodyHtml += `
        <div class="report-section" id="sec-results">
          <div class="report-section-title"><span>3. Detailed Quantitative Assessment Data (${latestEnc.date})</span></div>
          <table class="report-table">
            <thead><tr><th style="text-align:left;">Ear / Modality</th><th>250Hz</th><th>500Hz</th><th>1000Hz</th><th>2000Hz</th><th>3000Hz</th><th>4000Hz</th><th>6000Hz</th><th>8000Hz</th><th>4-Freq PTA</th></tr></thead>
            <tbody>
              <tr><td style="text-align:left;" class="report-ear-r">Right AC (O)</td><td>${gv(th,'acR',250)}</td><td>${gv(th,'acR',500)}</td><td>${gv(th,'acR',1000)}</td><td>${gv(th,'acR',2000)}</td><td>${gv(th,'acR',3000)}</td><td>${gv(th,'acR',4000)}</td><td>${gv(th,'acR',6000)}</td><td>${gv(th,'acR',8000)}</td><td><strong class="report-ear-r">${Math.round(latestEnc.ptaRight||0)} dB</strong></td></tr>
              <tr><td style="text-align:left;" class="report-ear-r">Right BC (&lt;)</td><td>-</td><td>${gv(th,'bcR',500)}</td><td>${gv(th,'bcR',1000)}</td><td>${gv(th,'bcR',2000)}</td><td>-</td><td>${gv(th,'bcR',4000)}</td><td>-</td><td>-</td><td>-</td></tr>
              <tr><td style="text-align:left;" class="report-ear-l">Left AC (X)</td><td>${gv(th,'acL',250)}</td><td>${gv(th,'acL',500)}</td><td>${gv(th,'acL',1000)}</td><td>${gv(th,'acL',2000)}</td><td>${gv(th,'acL',3000)}</td><td>${gv(th,'acL',4000)}</td><td>${gv(th,'acL',6000)}</td><td>${gv(th,'acL',8000)}</td><td><strong class="report-ear-l">${Math.round(latestEnc.ptaLeft||0)} dB</strong></td></tr>
              <tr><td style="text-align:left;" class="report-ear-l">Left BC (&gt;)</td><td>-</td><td>${gv(th,'bcL',500)}</td><td>${gv(th,'bcL',1000)}</td><td>${gv(th,'bcL',2000)}</td><td>-</td><td>${gv(th,'bcL',4000)}</td><td>-</td><td>-</td><td>-</td></tr>
            </tbody>
          </table>
          <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:12px;margin-top:10px;">
            <div class="report-box">
              <strong style="color:#0891B2;display:block;margin-bottom:4px;font-size:11.5px;">Immittance Battery</strong>
              <div style="font-size:11.5px;">
                <div>AD: <strong>${tymp.right ? tymp.right.type : 'NR'}</strong> (${tymp.right ? tymp.right.pres + ' daPa' : 'NR'}, ${tymp.right ? tymp.right.comp + ' mL' : 'NR'}) · Reflex: ${tymp.ipsi1kR || 'NR'}</div>
                <div>AS: <strong>${tymp.left ? tymp.left.type : 'NR'}</strong> (${tymp.left ? tymp.left.pres + ' daPa' : 'NR'}, ${tymp.left ? tymp.left.comp + ' mL' : 'NR'}) · Reflex: ${tymp.ipsi1kL || 'NR'}</div>
              </div>
            </div>
            <div class="report-box">
              <strong style="color:#0891B2;display:block;margin-bottom:4px;font-size:11.5px;">Speech Audiometry</strong>
              <div style="font-size:11.5px;">
                <div>SRT: <span class="report-ear-r">${speech.right?speech.right.srt+' dB':'-'}</span> / <span class="report-ear-l">${speech.left?speech.left.srt+' dB':'-'}</span></div>
                <div>WRS: <span class="report-ear-r">${speech.right?speech.right.wrs+'%':'-'}</span> / <span class="report-ear-l">${speech.left?speech.left.wrs+'%':'-'}</span></div>
                <div>Rollover: ${speech.rollover || 'Normal'} · QuickSIN: ${speech.quicksin || 'Normal'}</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Audiogram
    if (latestEnc) {
      const curTh = latestEnc.thresholds || {};
      const baseTh = baselineEnc ? (baselineEnc.thresholds || null) : null;
      bodyHtml += `
        <div class="report-section" id="sec-audiogram">
          <div class="report-section-title"><span>4. Pure Tone Audiogram &amp; Longitudinal Comparison</span></div>
          <div style="display:flex;justify-content:center;margin:8px 0;">${generateReportAudiogramSvg(curTh, baseTh)}</div>
        </div>
      `;
    }

    // Delta
    if (filteredEncs.length > 1 && baselineEnc && latestEnc) {
      bodyHtml += `
        <div class="report-section" id="sec-longitudinal">
          <div class="report-section-title"><span>5. Longitudinal Progression &amp; Significant Threshold Shift (STS)</span></div>
          <div class="report-box" style="font-size:11.5px;line-height:1.7;">
            <div>Progression evaluated between <strong>${baselineEnc.date}</strong> (Baseline) and <strong>${latestEnc.date}</strong> (Current).</div>
            <div>Right PTA Shift: <strong>${((latestEnc.ptaRight||0) - (baselineEnc.ptaRight||0)).toFixed(1)} dB</strong> &middot; Left PTA Shift: <strong>${((latestEnc.ptaLeft||0) - (baselineEnc.ptaLeft||0)).toFixed(1)} dB</strong></div>
          </div>
        </div>
      `;
    }

    // Diagnoses
    bodyHtml += `
      <div class="report-section" id="sec-diagnoses">
        <div class="report-section-title"><span>6. Diagnoses &amp; Clinical History</span></div>
        <table class="report-table">
          <thead><tr><th>Code</th><th>Diagnosis</th><th>First Recorded</th><th>Status</th><th>Notes</th></tr></thead>
          <tbody>
            ${(patient.diagnosesHistory || []).map(d => `
              <tr><td style="font-weight:700;color:#0891B2;">${d.code}</td><td><strong>${d.title}</strong></td><td>${d.date}</td><td>${d.status}</td><td>${d.notes}</td></tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Care Plan
    bodyHtml += `
      <div class="report-section" id="sec-careplan">
        <div class="report-section-title"><span>7. Management History &amp; Active Care Plan</span></div>
        <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:10px;">
          <div class="report-box"><strong style="color:#64748B;">Completed</strong><div style="font-size:11.5px;margin-top:4px;">Diagnostic intake and initial baseline mapping.</div></div>
          <div class="report-box"><strong style="color:#0891B2;">Active</strong><div style="font-size:11.5px;margin-top:4px;">${patient.pathwayLabel || 'Active Surveillance'}</div></div>
          <div class="report-box"><strong style="color:#DC2626;">Next Actions</strong><div style="font-size:11.5px;margin-top:4px;">Scheduled recall: ${patient.nextRecall || 'Pending'}</div></div>
        </div>
      </div>
    `;

    // Media
    bodyHtml += `
      <div class="report-section" id="sec-media">
        <div class="report-section-title"><span>8. Clinical Media &amp; Documents</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          ${(patient.media || []).map(m => `
            <div style="background:#F8FAFC;border:1px solid #CBD5E1;border-radius:4px;padding:6px 10px;font-size:11px;display:flex;justify-content:space-between;">
              <div><strong>${m.name}</strong><div style="color:#64748B;font-size:10px;">${m.type} (${m.size})</div></div>
              <span style="font-size:9.5px;font-weight:700;background:#E2E8F0;padding:2px 6px;border-radius:3px;">${m.tag||'Verified'}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Conclusion
    bodyHtml += `
      <div class="report-section" id="sec-conclusion" style="border-bottom:none;">
        <div class="report-section-title"><span>9. Clinical Conclusion &amp; Actionable Next Steps</span></div>
        <div class="report-box" style="font-size:12px;line-height:1.6;">
          <div><strong>Diagnostic Impression:</strong> ${diag}.</div>
          <div style="margin-top:4px;color:#0F766E;font-weight:700;">Scheduled Recall: ${patient.nextRecall || 'Pending'} &mdash; ${patient.recallReason || 'Review'}</div>
        </div>
      </div>
    `;

  } else if (currentReportType === 'ent_referral') {
    headerTitle = 'SPECIALIST ENT &amp; OTOLARYNGOLOGY MEDICAL REFERRAL SYNTHESIS';
    headerBadge = '<span style="background:#DC2626;color:#FFFFFF;padding:3px 8px;border-radius:3px;font-size:10px;font-weight:700;">Medical Specialist Referral</span>';

    navItems = [
      { id: 'sec-ent-indication', label: '1. Referral Indication' },
      { id: 'sec-ent-otoscopy', label: '2. Otoscopy Findings' },
      { id: 'sec-ent-audiometry', label: '3. Audiometry & Asymmetry' },
      { id: 'sec-ent-audiogram', label: '4. Vector Audiogram' },
      { id: 'sec-ent-ephys', label: '5. Electrophysiology' },
      { id: 'sec-ent-directives', label: '6. Directives & Next Steps' }
    ];

    bodyHtml += `
      <div class="report-section" id="sec-ent-indication">
        <div class="report-section-title"><span>1. Clinical Indication &amp; Referral Priority</span></div>
        <div class="report-box" style="font-size:12px;line-height:1.6;">
          <div style="color:#DC2626;font-weight:700;font-size:13px;margin-bottom:4px;">Urgent ENT / Neuro-Otology Consultation Indicated</div>
          <div><strong>Primary Indication:</strong> ${patient.primaryDiagnosis || 'Asymmetric hearing loss and otologic symptoms.'}</div>
          <div style="margin-top:4px;"><strong>Attending Clinician Summary:</strong> ${patient.clinicalNote || 'Patient requires specialist ENT clearance and medical evaluation.'}</div>
        </div>
      </div>

      <div class="report-section" id="sec-ent-otoscopy">
        <div class="report-section-title"><span>2. Physical Otoscopy &amp; Middle Ear Clearance</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div class="report-box"><strong class="report-ear-r">Right Ear (AD)</strong><div style="font-size:11.5px;margin-top:4px;">${latestEnc && latestEnc.otoscopy ? latestEnc.otoscopy.right : 'Clear external auditory canal, intact tympanic membrane.'}</div></div>
          <div class="report-box"><strong class="report-ear-l">Left Ear (AS)</strong><div style="font-size:11.5px;margin-top:4px;">${latestEnc && latestEnc.otoscopy ? latestEnc.otoscopy.left : 'Clear canal, intact TM with sharp cone of light.'}</div></div>
        </div>
      </div>

      <div class="report-section" id="sec-ent-audiometry">
        <div class="report-section-title"><span>3. Audiometric Asymmetry &amp; Threshold Data</span></div>
        <div class="report-box" style="font-size:12px;line-height:1.6;">
          <div>Pure Tone Average: <strong class="report-ear-r">Right: ${latestEnc ? Math.round(latestEnc.ptaRight||0) : 30} dB</strong> &middot; <strong class="report-ear-l">Left: ${latestEnc ? Math.round(latestEnc.ptaLeft||0) : 36} dB</strong></div>
          <div style="margin-top:2px;">Air-Bone Gap: <strong>${patient.airBoneGap || '<10 dB (Sensorineural)'}</strong></div>
        </div>
      </div>

      <div class="report-section" id="sec-ent-audiogram">
        <div class="report-section-title"><span>4. Dual-Ear Calibrated Vector Audiogram</span></div>
        <div style="display:flex;justify-content:center;margin:8px 0;">${generateReportAudiogramSvg(latestEnc ? latestEnc.thresholds : null, null)}</div>
      </div>

      <div class="report-section" id="sec-ent-ephys">
        <div class="report-section-title"><span>5. Electrophysiology / Retrocochlear Workup</span></div>
        <div class="report-box" style="font-size:12px;line-height:1.6;">
          <div>${latestEnc && latestEnc.electrophysiology ? latestEnc.electrophysiology.pattern : 'Auditory Brainstem Response (ABR) Wave I-V latencies within normal limits.'}</div>
        </div>
      </div>

      <div class="report-section" id="sec-ent-directives" style="border-bottom:none;">
        <div class="report-section-title"><span>6. Requested Consultant Actions &amp; Directives</span></div>
        <div class="report-box" style="font-size:12px;line-height:1.6;">
          <div>1. Otolaryngology clinical examination and diagnostic review.</div>
          <div>2. Magnetic Resonance Imaging (MRI IAC / Cerebellopontine Angle) if unilateral retrocochlear symptoms persist.</div>
          <div>3. Return to Audiology for post-medical management follow-up.</div>
        </div>
      </div>
    `;

  } else if (currentReportType === 'audiology_battery') {
    headerTitle = 'DIAGNOSTIC AUDIOLOGY BATTERY &amp; QUANTITATIVE TEST DATA';
    headerBadge = '<span style="background:#0369A1;color:#FFFFFF;padding:3px 8px;border-radius:3px;font-size:10px;font-weight:700;">Objective Battery Data</span>';

    navItems = [
      { id: 'sec-bat-standards', label: '1. Standards' },
      { id: 'sec-bat-thresholds', label: '2. Thresholds' },
      { id: 'sec-bat-audiogram', label: '3. Audiogram' },
      { id: 'sec-bat-immittance', label: '4. Immittance' },
      { id: 'sec-bat-speech', label: '5. Speech Battery' },
      { id: 'sec-bat-ephys', label: '6. E-Physiology' }
    ];

    const th = (latestEnc && latestEnc.thresholds) ? latestEnc.thresholds : {};
    const tymp = (latestEnc && latestEnc.tympanometry) ? latestEnc.tympanometry : {};
    const speech = (latestEnc && latestEnc.speech) ? latestEnc.speech : {};
    const ephys = (latestEnc && latestEnc.electrophysiology) ? latestEnc.electrophysiology : {};

    bodyHtml += `
      <div class="report-section" id="sec-bat-standards">
        <div class="report-section-title"><span>1. Testing Suite &amp; Calibration Standards</span></div>
        <div class="report-box" style="font-size:11.5px;line-height:1.6;">
          <div>Facility: <strong>${clinic} &middot; Consultation Room 1</strong></div>
          <div>Standards: <strong>ANSI S3.6-2018 / ISO 8253-1:2010 Calibrated</strong></div>
        </div>
      </div>

      <div class="report-section" id="sec-bat-thresholds">
        <div class="report-section-title"><span>2. Quantitative Pure Tone Threshold Matrix (dB HL)</span></div>
        <table class="report-table">
          <thead><tr><th>Track</th><th>250Hz</th><th>500Hz</th><th>1000Hz</th><th>2000Hz</th><th>3000Hz</th><th>4000Hz</th><th>6000Hz</th><th>8000Hz</th><th>PTA</th></tr></thead>
          <tbody>
            <tr><td class="report-ear-r">Right AC</td><td>${gv(th,'acR',250)}</td><td>${gv(th,'acR',500)}</td><td>${gv(th,'acR',1000)}</td><td>${gv(th,'acR',2000)}</td><td>${gv(th,'acR',3000)}</td><td>${gv(th,'acR',4000)}</td><td>${gv(th,'acR',6000)}</td><td>${gv(th,'acR',8000)}</td><td>${Math.round(latestEnc?latestEnc.ptaRight||0:30)}</td></tr>
            <tr><td class="report-ear-r">Right BC</td><td>-</td><td>${gv(th,'bcR',500)}</td><td>${gv(th,'bcR',1000)}</td><td>${gv(th,'bcR',2000)}</td><td>-</td><td>${gv(th,'bcR',4000)}</td><td>-</td><td>-</td><td>-</td></tr>
            <tr><td class="report-ear-l">Left AC</td><td>${gv(th,'acL',250)}</td><td>${gv(th,'acL',500)}</td><td>${gv(th,'acL',1000)}</td><td>${gv(th,'acL',2000)}</td><td>${gv(th,'acL',3000)}</td><td>${gv(th,'acL',4000)}</td><td>${gv(th,'acL',6000)}</td><td>${gv(th,'acL',8000)}</td><td>${Math.round(latestEnc?latestEnc.ptaLeft||0:36)}</td></tr>
            <tr><td class="report-ear-l">Left BC</td><td>-</td><td>${gv(th,'bcL',500)}</td><td>${gv(th,'bcL',1000)}</td><td>${gv(th,'bcL',2000)}</td><td>-</td><td>${gv(th,'bcL',4000)}</td><td>-</td><td>-</td><td>-</td></tr>
          </tbody>
        </table>
      </div>

      <div class="report-section" id="sec-bat-audiogram">
        <div class="report-section-title"><span>3. Audiogram Graphic</span></div>
        <div style="display:flex;justify-content:center;margin:8px 0;">${generateReportAudiogramSvg(th, null)}</div>
      </div>

      <div class="report-section" id="sec-bat-immittance">
        <div class="report-section-title"><span>4. Immittance &amp; Acoustic Reflex Data</span></div>
        <table class="report-table">
          <thead><tr><th>Ear</th><th>Type</th><th>Peak Pressure</th><th>Compliance</th><th>ECV</th><th>Reflex 1kHz</th></tr></thead>
          <tbody>
            <tr><td class="report-ear-r">AD</td><td>${tymp.right?tymp.right.type:'Type A'}</td><td>${tymp.right?tymp.right.pres+' daPa':'-20 daPa'}</td><td>${tymp.right?tymp.right.comp+' mL':'0.78 mL'}</td><td>${tymp.right?tymp.right.ecv+' mL':'1.15 mL'}</td><td>${tymp.ipsi1kR||'85 dB'}</td></tr>
            <tr><td class="report-ear-l">AS</td><td>${tymp.left?tymp.left.type:'Type A'}</td><td>${tymp.left?tymp.left.pres+' daPa':'-30 daPa'}</td><td>${tymp.left?tymp.left.comp+' mL':'0.72 mL'}</td><td>${tymp.left?tymp.left.ecv+' mL':'1.08 mL'}</td><td>${tymp.ipsi1kL||'90 dB'}</td></tr>
          </tbody>
        </table>
      </div>

      <div class="report-section" id="sec-bat-speech">
        <div class="report-section-title"><span>5. Speech Discrimination Battery</span></div>
        <div class="report-box" style="font-size:12px;line-height:1.6;">
          <div>SRT: <strong class="report-ear-r">${speech.right?speech.right.srt:30} dB (AD)</strong> &middot; <strong class="report-ear-l">${speech.left?speech.left.srt:35} dB (AS)</strong></div>
          <div>WRS: <strong class="report-ear-r">${speech.right?speech.right.wrs:88}% (AD)</strong> &middot; <strong class="report-ear-l">${speech.left?speech.left.wrs:76}% (AS)</strong></div>
          <div>QuickSIN Loss: <strong>${speech.quicksin || '+4.5 dB'}</strong></div>
        </div>
      </div>

      <div class="report-section" id="sec-bat-ephys" style="border-bottom:none;">
        <div class="report-section-title"><span>6. Electrophysiology Latency Traces</span></div>
        <div class="report-box" style="font-size:12px;line-height:1.6;">
          <div>ABR Wave I-V Interpeak Interval: <strong>${ephys.abrR ? ephys.abrR.interval : '4.00 ms (Normal)'}</strong></div>
          <div>DPOAE Status: <strong>${ephys.abrR ? ephys.abrR.oae : 'Pass (1k-3k Hz)'}</strong></div>
        </div>
      </div>
    `;

  } else if (currentReportType === 'patient_summary') {
    headerTitle = 'PATIENT &amp; FAMILY HEARING HEALTH &amp; CARE PLAN GUIDE';
    headerBadge = '<span style="background:#059669;color:#FFFFFF;padding:3px 8px;border-radius:3px;font-size:10px;font-weight:700;">Patient &amp; Family Guide</span>';

    navItems = [
      { id: 'sec-pat-overview', label: '1. What Test Means' },
      { id: 'sec-pat-audiogram', label: '2. Your Audiogram' },
      { id: 'sec-pat-technology', label: '3. Hearing Technology' },
      { id: 'sec-pat-strategies', label: '4. Communication Tips' },
      { id: 'sec-pat-nextsteps', label: '5. Next Steps' }
    ];

    bodyHtml += `
      <div class="report-section" id="sec-pat-overview">
        <div class="report-section-title"><span>1. Understanding Your Hearing Assessment</span></div>
        <div class="report-box" style="font-size:12.5px;line-height:1.65;">
          <p style="margin-bottom:6px;">Hello <strong>${fullName}</strong>, your audiological evaluation showed that your hearing is normal in low tones (deep sounds), with a mild-to-moderate drop in higher pitches (like soft consonants: <em>s, f, th</em>).</p>
          <p style="margin:0;">This explains why you can often hear that someone is speaking, but find it tricky to catch every word clearly when in crowded rooms or noisy family gatherings.</p>
        </div>
      </div>

      <div class="report-section" id="sec-pat-audiogram">
        <div class="report-section-title"><span>2. Your Hearing Chart (Audiogram)</span></div>
        <div style="display:flex;justify-content:center;margin:8px 0;">${generateReportAudiogramSvg(latestEnc ? latestEnc.thresholds : null, null)}</div>
        <div style="font-size:11.5px;color:#64748B;text-align:center;">The green shaded zone shows normal hearing. Symbols lower on the chart represent sounds needing more volume.</div>
      </div>

      <div class="report-section" id="sec-pat-technology">
        <div class="report-section-title"><span>3. Your Prescribed Hearing Technology</span></div>
        <div class="report-box" style="font-size:12px;line-height:1.6;">
          <div>Active Devices: <strong>${(patient.devices && patient.devices.length>0) ? patient.devices.map(d=>d.brand+' '+d.model).join(' & ') : 'Digital Amplification Prescribed'}</strong></div>
          <div style="margin-top:4px;">Daily Wear: <strong>Aim for 8–10 hours daily</strong> to help your brain adapt comfortably to soft environmental sounds.</div>
        </div>
      </div>

      <div class="report-section" id="sec-pat-strategies">
        <div class="report-section-title"><span>4. Everyday Communication Tips for You and Your Family</span></div>
        <div class="report-box" style="font-size:12px;line-height:1.65;">
          <div>&bull; <strong>Face the speaker:</strong> Lip reading and facial cues give 30% extra clarity.</div>
          <div>&bull; <strong>Good lighting:</strong> Ensure you can clearly see the person talking.</div>
          <div>&bull; <strong>Reduce noise:</strong> Turn down background TV/radio when having important conversations.</div>
        </div>
      </div>

      <div class="report-section" id="sec-pat-nextsteps" style="border-bottom:none;">
        <div class="report-section-title"><span>5. Your Upcoming Appointments &amp; Support</span></div>
        <div class="report-box" style="font-size:12px;line-height:1.6;">
          <div style="color:#0F766E;font-weight:700;">Next Scheduled Visit: ${patient.nextRecall || '3-Week Follow-up'}</div>
          <div>Need assistance between visits? Contact our clinic at <strong>${phone}</strong> or visit ${clinic}.</div>
        </div>
      </div>
    `;

  } else if (currentReportType === 'screening') {
    headerTitle = 'HEARING HEALTH SCREENING RECORD &amp; TRIAGE CERTIFICATE';
    headerBadge = '<span style="background:#0F766E;color:#FFFFFF;padding:3px 8px;border-radius:3px;font-size:10px;font-weight:700;">Screening Certificate</span>';

    navItems = [
      { id: 'sec-scr-triage', label: '1. Otoscopy' },
      { id: 'sec-scr-sweep', label: '2. Sweep Screening' },
      { id: 'sec-scr-outcome', label: '3. Outcome' }
    ];

    bodyHtml += `
      <div class="report-section" id="sec-scr-triage">
        <div class="report-section-title"><span>1. Otoscopic &amp; Physical Clearance</span></div>
        <div class="report-box" style="font-size:12px;line-height:1.6;">
          <div>Right Ear (AD): <strong>Clear / TM Intact (Pass)</strong></div>
          <div>Left Ear (AS): <strong>Clear / TM Intact (Pass)</strong></div>
        </div>
      </div>

      <div class="report-section" id="sec-scr-sweep">
        <div class="report-section-title"><span>2. Pure Tone Sweep Screening Results (25 dB HL Protocol)</span></div>
        <table class="report-table">
          <thead><tr><th>Ear</th><th>1000 Hz</th><th>2000 Hz</th><th>4000 Hz</th><th>Screening Result</th></tr></thead>
          <tbody>
            <tr><td class="report-ear-r">Right Ear (AD)</td><td>Pass</td><td>Pass</td><td>Pass</td><td><strong style="color:#16A34A;">PASS (Normal)</strong></td></tr>
            <tr><td class="report-ear-l">Left Ear (AS)</td><td>Pass</td><td>Pass</td><td>Pass</td><td><strong style="color:#16A34A;">PASS (Normal)</strong></td></tr>
          </tbody>
        </table>
      </div>

      <div class="report-section" id="sec-scr-outcome" style="border-bottom:none;">
        <div class="report-section-title"><span>3. Overall Determination &amp; Recommendation</span></div>
        <div class="report-box" style="font-size:12px;line-height:1.6;">
          <div style="font-weight:700;color:#16A34A;font-size:13px;">Screening Result: PASS BILATERALLY</div>
          <div style="margin-top:4px;">No significant hearing threshold elevation detected. Routine annual screening recommended.</div>
        </div>
      </div>
    `;
  }

  // ── Render Dynamic Jump Bar ──
  if (jumpBar) {
    jumpBar.innerHTML = `
      <span style="color:rgba(255,255,255,0.4);display:flex;align-items:center;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">Jump to:</span>
      ${navItems.map((n, i) => `
        <a href="javascript:void(0)" 
           data-sec="${n.id}"
           class="report-nav-item ${i===0?'active':''}" 
           onclick="reportScrollTo('${n.id}', this)" 
           style="color:${i===0?'#38BDF8':'#94A3B8'};padding:3px 8px;border-radius:4px;background:${i===0?'rgba(56,189,248,0.18)':'transparent'};border:1px solid ${i===0?'rgba(56,189,248,0.35)':'transparent'};font-weight:${i===0?'700':'500'};cursor:pointer;text-decoration:none;transition:all 120ms ease;">
           ${n.label}
        </a>
      `).join('')}
    `;
  }

  // ── Standard Master Report Header Block ──
  const headerHtml = `
    <div class="report-header-block" id="sec-header">
      <div>
        <div style="font-size:18px;font-weight:800;letter-spacing:-0.02em;color:#0891B2;">HearIntel Audiological Medical Center</div>
        <div style="font-size:11.5px;color:#64748B;margin-top:2px;">Specialist Hearing Healthcare &middot; ${clinic}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:13px;font-weight:700;color:#0F172A;display:flex;align-items:center;justify-content:flex-end;gap:6px;">
          ${headerTitle} ${headerBadge}
        </div>
        <div style="font-size:11px;color:#64748B;margin-top:2px;">Reporting Window: <strong>${dateRangeStr}</strong> &middot; Generated: ${reportGenDate}</div>
      </div>
    </div>

    <div class="report-meta-grid">
      <div><strong>Patient Full Name</strong><span>${fullName}</span></div>
      <div><strong>Patient MRN / ID</strong><span>${mrn}</span></div>
      <div><strong>Date of Birth / Age</strong><span>${dob} ${age !== 'Not Recorded' ? '(' + age + ' yrs)' : ''}</span></div>
      <div><strong>Gender / Language</strong><span>${gender} &middot; ${lang}</span></div>
      <div><strong>Contact</strong><span>${phone}</span></div>
      <div><strong>Insurance / Coverage</strong><span>${insurance}</span></div>
      <div><strong>Referring Source</strong><span>${referral}</span></div>
      <div><strong>Attending Audiologist</strong><span>${clinician} (${license})</span></div>
    </div>
  `;

  // ── Standard Master Report Footer Block ──
  const footerHtml = `
    <div class="report-signature-block" id="sec-signoff">
      <div>
        <div class="sig-line"></div>
        <div style="font-size:12px;font-weight:700;color:#0F172A;">${clinician}</div>
        <div style="font-size:11px;color:#64748B;">Lead Clinical Audiologist &middot; Reg #${license}</div>
        <div style="font-size:10px;color:#94A3B8;margin-top:2px;">Digital Authentication: SHA-256 Verified</div>
      </div>
      <div style="text-align:right;">
        <div class="sig-line"></div>
        <div style="font-size:12px;font-weight:700;color:#0F172A;">Electronic Clinical Verification</div>
        <div style="font-size:11px;color:#64748B;">Clinical Practice Management Engine v3.5</div>
        <div style="font-size:10px;color:#94A3B8;margin-top:2px;">Confidential Medical Record &middot; ${reportGenDate}</div>
      </div>
    </div>
  `;

  paper.innerHTML = headerHtml + bodyHtml + footerHtml;
}

// ── PER-ASSESSMENT SINGLE ENCOUNTER REPORT ──
function openAssessmentReport(patientId, encounterId) {
  currentReportPatientId = patientId || getActivePatientId();
  currentEncounterId     = encounterId;
  reportMode             = 'single_encounter';

  let modal = document.getElementById('reportExportModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'reportExportModal';
    modal.className = 'report-modal-backdrop';
    document.body.appendChild(modal);
  }

  const patient = window.HearIntelDB ? window.HearIntelDB.getPatient(currentReportPatientId) : null;
  const enc     = patient && patient.assessments ? patient.assessments.find(a => a.id === encounterId) : null;
  const encDate = enc ? enc.date : 'N/A';

  modal.innerHTML = `
    <div class="report-modal-window">
      <div class="report-modal-header">
        <div style="display:flex;align-items:center;gap:12px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          <strong style="font-size:14px;color:#FFFFFF;">Single Encounter Diagnostic Report &mdash; ${encDate}</strong>
        </div>
        <button class="btn ghost" style="min-height:28px;padding:0 8px;font-size:16px;color:rgba(255,255,255,0.7);" onclick="closeReportModal()" title="Close">&#x2715;</button>
      </div>

      <div id="reportNavJumpBar" style="background:#0F172A;border-bottom:1px solid rgba(255,255,255,0.08);padding:7px 20px;display:flex;gap:6px;overflow-x:auto;font-size:11px;white-space:nowrap;">
        <span style="color:rgba(255,255,255,0.4);display:flex;align-items:center;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">Encounter Scope:</span>
        <span style="color:#38BDF8;padding:2px 8px;border-radius:4px;background:rgba(56,189,248,0.15);font-weight:700;">Visit #${enc ? enc.number || 1 : 1} (${encDate})</span>
      </div>

      <div class="report-modal-body" id="reportModalBodyContainer">
        <div class="report-paper" id="reportPaperContent"></div>
      </div>

      <div class="report-modal-header" style="background:#0F172A;border-top:1px solid rgba(255,255,255,0.08);border-bottom:none;justify-content:flex-end;">
        <div style="display:flex;gap:10px;">
          <button class="btn primary" onclick="printReportDocument()" style="background:#0891B2;color:#FFFFFF;border:none;font-size:12px;font-weight:600;">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
            Download / Print PDF
          </button>
        </div>
      </div>
    </div>
  `;

  renderSingleEncounterReport();
  modal.style.display = 'flex';
}

function renderSingleEncounterReport() {
  const paper = document.getElementById('reportPaperContent');
  if (!paper) return;

  const patient = window.HearIntelDB ? window.HearIntelDB.getPatient(currentReportPatientId) : null;
  if (!patient) {
    paper.innerHTML = '<div style="padding:40px;text-align:center;color:#64748B;">No patient record loaded.</div>';
    return;
  }

  const enc = patient.assessments ? patient.assessments.find(a => a.id === currentEncounterId) : null;
  if (!enc) {
    paper.innerHTML = '<div style="padding:40px;text-align:center;color:#64748B;">Encounter data not found.</div>';
    return;
  }

  const fullName  = patient.fullName || patient.name || 'Not Recorded';
  const mrn       = patient.mrn || 'Not Recorded';
  const dob       = patient.dob || 'Not Recorded';
  const age       = patient.age != null ? patient.age : 'Not Recorded';
  const gender    = patient.gender || 'Not Recorded';
  const clinician = enc.clinician || patient.assignedClinician || 'Dr. Chika Okafor, Au.D.';
  const clinic    = enc.facility || patient.facility || 'Lagos Central Clinic';
  const license   = (window.HearIntelDB && window.HearIntelDB.currentClinician) ? window.HearIntelDB.currentClinician.license : 'MLSCN-AUD-2024-0891';
  const reportGenDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const th     = enc.thresholds || {};
  const tymp   = enc.tympanometry || {};
  const speech = enc.speech || {};
  const ephys  = enc.electrophysiology || {};
  const hist   = enc.history || {};
  const oto    = enc.otoscopy || {};

  const gv = (track, f) => (th[track] && th[track][f] != null) ? th[track][f] : '-';
  const ptaR = enc.ptaRight != null ? Math.round(enc.ptaRight) + ' dB HL' : 'NR';
  const ptaL = enc.ptaLeft  != null ? Math.round(enc.ptaLeft)  + ' dB HL' : 'NR';

  const audiogramSvg = generateReportAudiogramSvg(th, null);

  const html = `
    <div class="report-header-block">
      <div>
        <div style="font-size:18px;font-weight:800;letter-spacing:-0.02em;color:#0891B2;">HearIntel Audiological Medical Center</div>
        <div style="font-size:11.5px;color:#64748B;margin-top:2px;">Specialist Hearing Healthcare &middot; ${clinic}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:13.5px;font-weight:700;color:#0F172A;">SINGLE ENCOUNTER DIAGNOSTIC REPORT</div>
        <div style="font-size:11px;color:#64748B;margin-top:2px;">Encounter Date: <strong>${enc.date}</strong> &middot; Generated: ${reportGenDate}</div>
      </div>
    </div>

    <div class="report-meta-grid">
      <div><strong>Patient Full Name</strong><span>${fullName}</span></div>
      <div><strong>MRN / ID</strong><span>${mrn}</span></div>
      <div><strong>Date of Birth / Age</strong><span>${dob} ${age !== 'Not Recorded' ? '(' + age + ' yrs)' : ''}</span></div>
      <div><strong>Gender</strong><span>${gender}</span></div>
      <div><strong>Encounter Type</strong><span>${enc.type || 'Diagnostic Evaluation'}</span></div>
      <div><strong>Clinical Reason</strong><span>${enc.reason || 'Diagnostic Assessment'}</span></div>
      <div><strong>Attending Clinician</strong><span>${clinician} (${license})</span></div>
      <div><strong>Facility Suite</strong><span>${clinic}</span></div>
    </div>

    <div class="report-section">
      <div class="report-section-title"><span>1. Case History &amp; Presenting Complaint</span></div>
      <div class="report-box" style="font-size:12px;line-height:1.7;">
        <div><strong>Presenting Complaint:</strong> ${hist.complaint || 'Diagnostic audiological evaluation indicated.'}</div>
        <div><strong>Red Flag Symptoms:</strong> ${hist.redFlags || 'Negative for medical red flags.'}</div>
        <div><strong>Otologic History:</strong> ${hist.otologic || 'No ototoxic drug exposure.'}</div>
      </div>
    </div>

    ${(oto.right || oto.left) ? `
    <div class="report-section">
      <div class="report-section-title"><span>2. Otoscopy Findings</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div class="report-box"><strong class="report-ear-r">Right Ear (AD)</strong><div style="font-size:11.5px;margin-top:4px;">${oto.right || 'Clear canal, intact TM.'}</div></div>
        <div class="report-box"><strong class="report-ear-l">Left Ear (AS)</strong><div style="font-size:11.5px;margin-top:4px;">${oto.left || 'Clear canal, intact TM.'}</div></div>
      </div>
    </div>` : ''}

    <div class="report-section">
      <div class="report-section-title"><span>3. Pure Tone Threshold Data</span></div>
      <table class="report-table">
        <thead>
          <tr><th style="text-align:left;">Ear / Modality</th><th>250Hz</th><th>500Hz</th><th>1000Hz</th><th>2000Hz</th><th>3000Hz</th><th>4000Hz</th><th>6000Hz</th><th>8000Hz</th><th>4-Freq PTA</th></tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align:left;" class="report-ear-r">Right AC (O)</td>
            <td>${gv('acR',250)}</td><td>${gv('acR',500)}</td><td>${gv('acR',1000)}</td><td>${gv('acR',2000)}</td><td>${gv('acR',3000)}</td><td>${gv('acR',4000)}</td><td>${gv('acR',6000)}</td><td>${gv('acR',8000)}</td>
            <td><strong class="report-ear-r">${ptaR}</strong></td>
          </tr>
          <tr>
            <td style="text-align:left;" class="report-ear-r">Right BC (&lt;)</td>
            <td>-</td><td>${gv('bcR',500)}</td><td>${gv('bcR',1000)}</td><td>${gv('bcR',2000)}</td><td>-</td><td>${gv('bcR',4000)}</td><td>-</td><td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td style="text-align:left;" class="report-ear-l">Left AC (X)</td>
            <td>${gv('acL',250)}</td><td>${gv('acL',500)}</td><td>${gv('acL',1000)}</td><td>${gv('acL',2000)}</td><td>${gv('acL',3000)}</td><td>${gv('acL',4000)}</td><td>${gv('acL',6000)}</td><td>${gv('acL',8000)}</td>
            <td><strong class="report-ear-l">${ptaL}</strong></td>
          </tr>
          <tr>
            <td style="text-align:left;" class="report-ear-l">Left BC (&gt;)</td>
            <td>-</td><td>${gv('bcL',500)}</td><td>${gv('bcL',1000)}</td><td>${gv('bcL',2000)}</td><td>-</td><td>${gv('bcL',4000)}</td><td>-</td><td>-</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="report-section">
      <div class="report-section-title"><span>4. Audiogram</span><span style="font-size:11px;font-weight:600;color:#64748B;">ISO 8253-1</span></div>
      <div style="display:flex;justify-content:center;margin:8px 0;">${audiogramSvg}</div>
    </div>

    <div class="report-section">
      <div class="report-section-title"><span>5. Immittance &amp; Speech Battery</span></div>
      <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:12px;">
        <div class="report-box">
          <strong style="color:#0891B2;display:block;margin-bottom:4px;font-size:11.5px;">Tympanometry &amp; Acoustic Reflexes</strong>
          <table class="report-table" style="margin:4px 0;">
            <thead><tr><th>Ear</th><th>Type</th><th>Peak Pres</th><th>Comp</th><th>ECV</th><th>Reflex 1k</th></tr></thead>
            <tbody>
              <tr>
                <td class="report-ear-r">AD</td>
                <td><strong>${tymp.right ? tymp.right.type : 'NR'}</strong></td>
                <td>${tymp.right ? tymp.right.pres + ' daPa' : 'NR'}</td>
                <td>${tymp.right ? tymp.right.comp + ' mL' : 'NR'}</td>
                <td>${tymp.right ? tymp.right.ecv + ' mL' : 'NR'}</td>
                <td>${tymp.ipsi1kR || 'NR'}</td>
              </tr>
              <tr>
                <td class="report-ear-l">AS</td>
                <td><strong>${tymp.left ? tymp.left.type : 'NR'}</strong></td>
                <td>${tymp.left ? tymp.left.pres + ' daPa' : 'NR'}</td>
                <td>${tymp.left ? tymp.left.comp + ' mL' : 'NR'}</td>
                <td>${tymp.left ? tymp.left.ecv + ' mL' : 'NR'}</td>
                <td>${tymp.ipsi1kL || 'NR'}</td>
              </tr>
            </tbody>
          </table>
          <div style="font-size:11px;color:#64748B;">Decay: ${tymp.decayR || 'Negative bilaterally'}</div>
        </div>
        <div class="report-box">
          <strong style="color:#0891B2;display:block;margin-bottom:4px;font-size:11.5px;">Speech Audiometry</strong>
          <div style="font-size:11.5px;line-height:1.6;">
            <div><strong>SRT:</strong> <span class="report-ear-r">${speech.right ? speech.right.srt + ' dB AD' : 'NR'}</span> &middot; <span class="report-ear-l">${speech.left ? speech.left.srt + ' dB AS' : 'NR'}</span></div>
            <div><strong>WRS:</strong> <span class="report-ear-r">${speech.right ? speech.right.wrs + '% AD' : 'NR'}</span> &middot; <span class="report-ear-l">${speech.left ? speech.left.wrs + '% AS' : 'NR'}</span></div>
            <div><strong>Rollover:</strong> ${speech.rollover || 'Negative for retrocochlear lesion'}</div>
            <div><strong>QuickSIN:</strong> ${speech.quicksin || 'Normal speech in noise'}</div>
          </div>
        </div>
      </div>
    </div>

    ${(ephys && (ephys.abrR || ephys.pattern)) ? `
    <div class="report-section">
      <div class="report-section-title"><span>6. Electrophysiology</span></div>
      <div class="report-box" style="font-size:11.5px;line-height:1.7;">
        ${ephys.abrR ? `<div><strong>ABR Right:</strong> W-I ${ephys.abrR.w1 || 'NR'} &middot; W-III ${ephys.abrR.w3 || 'NR'} &middot; W-V ${ephys.abrR.w5 || 'NR'} &middot; I-V ${ephys.abrR.interval || 'NR'} &middot; OAE: ${ephys.abrR.oae || 'NR'}</div>` : ''}
        ${ephys.abrL ? `<div><strong>ABR Left:</strong> W-I ${ephys.abrL.w1 || 'NR'} &middot; W-III ${ephys.abrL.w3 || 'NR'} &middot; W-V ${ephys.abrL.w5 || 'NR'} &middot; I-V ${ephys.abrL.interval || 'NR'} &middot; OAE: ${ephys.abrL.oae || 'NR'}</div>` : ''}
        ${ephys.pattern ? `<div style="color:#64748B;margin-top:4px;">${ephys.pattern}</div>` : ''}
      </div>
    </div>` : ''}

    <div class="report-section" style="border-bottom:none;">
      <div class="report-section-title"><span>${(ephys && (ephys.abrR || ephys.pattern)) ? 7 : 6}. Clinical Management &amp; Conclusion</span></div>
      <div class="report-box" style="font-size:12px;line-height:1.6;">
        <div><strong>Diagnostic Impression:</strong> ${enc.diagnosis || patient.primaryDiagnosis || 'Diagnostic audiological evaluation completed.'}</div>
        <div style="margin-top:4px;"><strong>Management Directive:</strong> ${enc.management || 'Ongoing audiological surveillance and care plan management.'}</div>
      </div>
    </div>

    <div class="report-signature-block">
      <div>
        <div class="sig-line"></div>
        <div style="font-size:12px;font-weight:700;color:#0F172A;">${clinician}</div>
        <div style="font-size:11px;color:#64748B;">Clinical Audiologist &middot; Reg #${license}</div>
      </div>
      <div style="text-align:right;">
        <div class="sig-line"></div>
        <div style="font-size:12px;font-weight:700;color:#0F172A;">Electronic Clinical Verification</div>
        <div style="font-size:11px;color:#64748B;">Clinical PMS Engine v3.5 &middot; ${reportGenDate}</div>
      </div>
    </div>
  `;

  paper.innerHTML = html;
}

function saveReportToMedia() {
  const patient = window.HearIntelDB ? window.HearIntelDB.getPatient(currentReportPatientId) : null;
  if (patient) {
    if (!patient.media) patient.media = [];
    const reportLabel = currentReportType === 'full' ? 'Longitudinal_Clinical_Journey_Report.pdf' : `${currentReportType.toUpperCase()}_Diagnostic_Report.pdf`;
    
    patient.media.unshift({
      id: 'doc-' + Date.now(),
      name: reportLabel,
      type: 'PDF Longitudinal EMR Document',
      date: 'Today',
      size: '2.4 MB',
      tag: 'Signed & Certified'
    });
    window.HearIntelDB.savePatient(patient);
    notify(`${reportLabel} saved to Patient Media & Documents.`);
  }
}

function printReportDocument() {
  window.print();
}



// ============================================================================
// PROTOTYPE AUTOSAVE ENGINE — localStorage persistence layer
// NOTE FOR DEV TEAM: localStorage is a PROTOTYPE-ONLY stand-in.
// Swap out getAutosaveKey / autosaveRead / autosaveWrite for API calls
// when connecting to the real backend. The field IDs and instance-keyed
// structure remain identical — only the storage primitives change.
// ============================================================================

/**
 * Build a namespaced localStorage key scoped to patient + module + instance.
 * Format: pms_as_{patientId}_{moduleKey}_{instanceIndex}_{fieldId}
 */
function getAutosaveKey(patientId, moduleKey, instanceIndex, fieldId) {
  return 'pms_as_' + patientId + '_' + moduleKey + '_' + instanceIndex + '_' + fieldId;
}

function autosaveWrite(patientId, moduleKey, instanceIndex, fieldId, value) {
  try {
    localStorage.setItem(getAutosaveKey(patientId, moduleKey, instanceIndex, fieldId), value);
  } catch(e) { /* storage full or private mode — fail silently in prototype */ }
}

function autosaveRead(patientId, moduleKey, instanceIndex, fieldId) {
  try {
    return localStorage.getItem(getAutosaveKey(patientId, moduleKey, instanceIndex, fieldId));
  } catch(e) { return null; }
}

/** Reflects save state in the #autoSaveStatus element injected by initModuleAutosave */
function setAutosaveStatus(state) {
  const el = document.getElementById('autoSaveStatus');
  if (!el) return;
  if (state === 'saving') {
    el.textContent = 'Saving…';
    el.style.color = 'var(--text-tertiary)';
  } else {
    el.textContent = '\u2713 Saved';
    el.style.color = 'var(--status-success)';
  }
}

/**
 * Core autosave initialiser. Call once on DOMContentLoaded in each module.
 * @param {string} moduleKey   - matches MODULE_SHORT_NAMES key (e.g. 'otoscopy')
 * @param {string[]} fieldIds  - list of input/select/textarea element IDs to persist
 */
function initModuleAutosave(moduleKey, fieldIds) {
  window._currentActiveModuleFields = { moduleKey: moduleKey, fieldIds: fieldIds };
  const patientId   = getActivePatientId();
  const activeIdx   = getActiveInstanceIndex(moduleKey, patientId);

  // ── Inject save-status indicator into the test-instance-strip if present ──
  // Falls back to a fixed bottom-right pill if the strip isn't on this page.
  (function injectSaveStatus() {
    const strip = document.querySelector('.test-instance-actions');
    const indicator = document.createElement('span');
    indicator.id = 'autoSaveStatus';
    indicator.style.cssText = [
      'font-size:11px',
      'font-weight:600',
      'font-family:var(--font-sans)',
      'color:var(--text-tertiary)',
      'white-space:nowrap',
      'transition:color 180ms ease'
    ].join(';');
    indicator.textContent = 'Autosave on';
    if (strip) {
      strip.appendChild(indicator);
    } else {
      // Floating fallback badge (mirrors .test-instance-strip styling)
      indicator.style.cssText += ';position:fixed;bottom:18px;right:24px;' +
        'background:var(--surface);border:1px solid var(--border);' +
        'border-radius:var(--radius-xs);padding:4px 10px;z-index:900;box-shadow:var(--shadow-card)';
      document.body.appendChild(indicator);
    }
  })();

  let _debounceTimer = null;

  function triggerSave(fieldId, value) {
    setAutosaveStatus('saving');
    clearTimeout(_debounceTimer);
    _debounceTimer = setTimeout(function() {
      autosaveWrite(patientId, moduleKey, activeIdx, fieldId, value);
      setAutosaveStatus('saved');
    }, 350); // 350ms debounce — fast enough, not annoying
  }

  // ── Restore persisted values ──
  fieldIds.forEach(function(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const saved = autosaveRead(patientId, moduleKey, activeIdx, id);
    if (saved !== null) {
      if (el.type === 'checkbox') {
        el.checked = saved === 'true';
      } else {
        el.value = saved;
      }
    }
    // ── Wire event listeners ──
    if (el.tagName === 'SELECT') {
      el.addEventListener('change', function() { triggerSave(id, el.value); });
    } else if (el.type === 'checkbox') {
      el.addEventListener('change', function() { triggerSave(id, el.checked ? 'true' : 'false'); });
    } else {
      // textarea & text inputs: blur + short debounce on input
      el.addEventListener('input',  function() { triggerSave(id, el.value); });
      el.addEventListener('blur',   function() {
        clearTimeout(_debounceTimer);
        autosaveWrite(patientId, moduleKey, activeIdx, id, el.value);
        setAutosaveStatus('saved');
      });
    }
  });

  // ── Persist dynamic PTA audiogram inputs (named input_{track}_{freq}) ──
  if (moduleKey === 'pta') {
    function hookPtaInputs() {
      document.querySelectorAll('[id^="input_"]').forEach(function(el) {
        if (el._asHooked) return;
        el._asHooked = true;
        const id = el.id;
        const saved = autosaveRead(patientId, moduleKey, activeIdx, id);
        if (saved !== null) el.value = saved;
        el.addEventListener('change', function() { triggerSave(id, el.value); });
        el.addEventListener('blur',   function() {
          clearTimeout(_debounceTimer);
          autosaveWrite(patientId, moduleKey, activeIdx, id, el.value);
          setAutosaveStatus('saved');
        });
      });
    }
    // Run immediately and after a short delay (audiogram grid may render late)
    hookPtaInputs();
    setTimeout(hookPtaInputs, 800);
  }

  // ── Hook manual Save button if present ──
  const saveBtn = document.getElementById('btnSaveModule');
  if (saveBtn && !saveBtn._asHooked) {
    saveBtn._asHooked = true;
    saveBtn.addEventListener('click', saveActiveModule);
  }
}

/**
 * Flushes all autosave fields for the currently active module immediately
 * and provides feedback on the Save button and notification toast.
 */
function saveActiveModule() {
  const cfg = window._currentActiveModuleFields;
  const patientId = getActivePatientId();
  if (cfg) {
    const activeIdx = getActiveInstanceIndex(cfg.moduleKey, patientId);
    cfg.fieldIds.forEach(function(id) {
      const el = document.getElementById(id);
      if (!el) return;
      const val = el.type === 'checkbox' ? (el.checked ? 'true' : 'false') : el.value;
      autosaveWrite(patientId, cfg.moduleKey, activeIdx, id, val);
    });
    if (cfg.moduleKey === 'pta') {
      document.querySelectorAll('[id^="input_"]').forEach(function(el) {
        autosaveWrite(patientId, cfg.moduleKey, activeIdx, el.id, el.value);
      });
    }
  }
  setAutosaveStatus('saved');
  const btn = document.getElementById('btnSaveModule');
  if (btn) {
    const origHtml = btn.innerHTML;
    btn.innerHTML = 'Saved &#10003;';
    btn.disabled = true;
    setTimeout(function() {
      btn.innerHTML = origHtml;
      btn.disabled = false;
    }, 1500);
  }
  notify('Changes saved to clinical record.');
}
