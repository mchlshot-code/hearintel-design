// HearIntel PMS Master Engine & Universal UI Coordinator

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
    +         '<input type="date" id="npDOB" value="1985-06-15" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius);font-size:13px;background:var(--surface);color:var(--text-primary);box-shadow:inset 0 1px 2px rgba(0,0,0,0.02);">'
    +       '</div>'
    +       '<div>'
    +         '<label style="font-size:11.5px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:5px;">Sex *</label>'
    +         '<select id="npSex" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius);font-size:13px;background:var(--surface);color:var(--text-primary);">'
    +           '<option value="Male" selected>Male</option>'
    +           '<option value="Female">Female</option>'
    +         '</select>'
    +       '</div>'
    +       '<div>'
    +         '<label style="font-size:11.5px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:5px;">Phone</label>'
    +         '<input type="tel" id="npPhone" placeholder="+234 802 000 0000" style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius);font-size:13px;background:var(--surface);color:var(--text-primary);box-shadow:inset 0 1px 2px rgba(0,0,0,0.02);">'
    +       '</div>'
    +     '</div>'
    +     '<div>'
    +       '<label style="font-size:11.5px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:5px;">Primary Presenting Complaint</label>'
    +       '<input type="text" id="npComplaint" placeholder="e.g. Bilateral hearing loss, difficulty understanding speech in noise" style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius);font-size:13.5px;background:var(--surface);color:var(--text-primary);box-shadow:inset 0 1px 2px rgba(0,0,0,0.02);">'
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

  closeModal('newPatientModal');
  notify('Patient registered: ' + newPatientObj.name + '. Opening patient record...');

  setTimeout(function() {
    window.location.href = '02-profile.html?patient=' + newId;
  }, 350);
}

// ── Clinical Referral Modal ──
function openReferralModal(patientId) {
  var pid = patientId || getActivePatientId();
  var patient = (window.HearIntelDB && window.HearIntelDB.getPatient(pid)) || { name: 'Amaia O.', mrn: 'LCC-26-01248' };
  
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
    +       '<input list="refTargetList" id="refTarget" value="Otolaryngology / Specialist Clinic (LUTH)" placeholder="Select from list or type custom clinic name..." style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius);font-size:13.5px;background:var(--surface);color:var(--text-primary);box-shadow:inset 0 1px 2px rgba(0,0,0,0.02);">'
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
    +       '<input type="text" id="refIndication" value="Asymmetric sensorineural hearing loss — specialist evaluation indicated" style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius);font-size:13.5px;background:var(--surface);color:var(--text-primary);box-shadow:inset 0 1px 2px rgba(0,0,0,0.02);">'
    +     '</div>'
    +     '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">'
    +       '<div>'
    +         '<label style="font-size:11.5px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:5px;">Priority</label>'
    +         '<select id="refPriority" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius);font-size:13px;background:var(--surface);color:var(--text-primary);">'
    +           '<option>Urgent (< 2 weeks)</option>'
    +           '<option>Standard Routine</option>'
    +           '<option>Immediate / Same-Day</option>'
    +         '</select>'
    +       '</div>'
    +       '<div>'
    +         '<label style="font-size:11.5px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:5px;">Attach Records</label>'
    +         '<select id="refAttach" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius);font-size:13px;background:var(--surface);color:var(--text-primary);">'
    +           '<option>Latest Audiogram + Tympanometry</option>'
    +           '<option>Complete Longitudinal Record</option>'
    +           '<option>Summary Diagnostic Report Only</option>'
    +         '</select>'
    +       '</div>'
    +     '</div>'
    +     '<div>'
    +       '<label style="font-size:11.5px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:5px;">Clinician Referral Notes</label>'
    +       '<textarea id="refNotes" rows="3" style="width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius);font-size:13px;background:var(--surface);color:var(--text-primary);font-family:inherit;line-height:1.45;">Patient presenting with unilateral asymmetric progression in left ear. Audiometry confirms >15 dB asymmetry at 2k-4k Hz. Specialist review requested.</textarea>'
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

  // 1. Add Care Plan entry
  if (window.HearIntelDB && window.HearIntelDB.addCarePlanItem) {
    window.HearIntelDB.addCarePlanItem(pid, {
      title: 'Referral: ' + target,
      category: 'Specialist Referral',
      status: 'Dispatched (' + prio + ')',
      badgeClass: 'neutral',
      details: ind + '. ' + (notes ? 'Notes: ' + notes : '') + ' [Attached: ' + attach + ']',
      nextStep: 'Consultation appointment scheduled with ' + target
    });
  }

  // 2. Add generated PDF to Media & Documents
  if (window.HearIntelDB && window.HearIntelDB.addMedia) {
    var safeName = target.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 24);
    window.HearIntelDB.addMedia(pid, {
      name: 'Referral_Letter_' + safeName + '.pdf',
      type: 'Referral Letter (PDF)',
      tag: 'Clinical Referral',
      size: '280 KB'
    });
  }

  // 3. Update patient status
  if (window.HearIntelDB && window.HearIntelDB.getPatient) {
    var p = window.HearIntelDB.getPatient(pid);
    if (p) {
      p.status = 'Referral Dispatched';
      window.HearIntelDB.savePatient(p);
    }
  }

  closeModal('referralModal');
  notify('Referral dispatched to ' + target + '. Letter added to Media & Documents.');

  // If on profile page, refresh profile data view immediately
  if (typeof renderProfile === 'function') {
    renderProfile();
  }
}

// ── Care Plan / Scheduled Recall Modal ──
function openAddCarePlanModal(patientId) {
  var pid = patientId || getActivePatientId();
  var patient = (window.HearIntelDB && window.HearIntelDB.getPatient(pid)) || { name: 'Amaia O.', mrn: 'LCC-26-01248' };

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
    +       '<input type="text" id="cpPractitioner" value="Dr. M. Adebayo, Au.D." style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius);font-size:13.5px;background:var(--surface);color:var(--text-primary);">'
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

  // Live update the recall banner on profile page if present
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
        <span>${window.HearIntelDB ? window.HearIntelDB.getAllPatients().length : 6} clinical records loaded</span>
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

  list.innerHTML = matches.map(p => `
    <div class="lookup-result-row" onclick="location.href='02-profile.html?patient=${p.id}'" title="Open patient record">
      <div style="flex:1;min-width:0;padding-right:20px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:4px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <strong style="font-size:14.5px;color:var(--text-primary);letter-spacing:-0.01em;">${p.name}</strong>
            <span style="font-family:monospace;font-size:11.5px;color:var(--text-secondary);letter-spacing:0.02em;">${p.mrn}</span>
            <span class="badge ${p.statusType || 'neutral'}">${p.status}</span>
          </div>
          <span style="font-size:12px;color:var(--text-secondary);white-space:nowrap;">${p.age} yrs · ${p.gender}</span>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:12px;color:var(--text-secondary);">
          <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:440px;">${p.primaryDiagnosis || 'Audiological Assessment Required'}</span>
          <span style="font-family:monospace;font-size:11.5px;color:var(--text-tertiary);white-space:nowrap;">${p.phone || '+234 800 000 0000'}</span>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
        <a class="btn primary" style="min-height:30px;padding:0 12px;font-size:12px;font-weight:600;" href="03-start-encounter.html?patient=${p.id}" onclick="event.stopPropagation();">Start Assessment</a>
      </div>
    </div>
  `).join('');
}

// Global Keyboard Listener for "/" or "Ctrl+K" / "Cmd+K"
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal('globalPatientLookupModal');
    closeModal('globalPatientSwitcherModal');
    closeModal('newPatientModal');
    closeModal('referralModal');
    closeModal('addCarePlanModal');
  } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openPatientLookupModal();
  } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    e.preventDefault();
    openPatientLookupModal();
  }
});

// ── Master Shell Generator ──

function patientShell(active) {
  const patientId = getActivePatientId();
  const patient = (window.HearIntelDB && window.HearIntelDB.getPatient(patientId)) || { name: 'Amaia O.', mrn: 'LCC-26-01248', age: 46, gender: 'Female' };
  const currentTheme = getActiveTheme();

  const isRegistry   = active === 'patients' || active === 'registry';
  const isProfile    = active === 'profile';
  const isAssessment = ['assessment','history','otoscopy','pta','immittance','speech','conclusion','electrophysiology'].includes(active);
  const showPatientSub = isRegistry || isProfile || isAssessment || active === 'media';
  const assessHref = '04-workspace-history.html?patient=' + patientId;

  const patientSub = showPatientSub
    ? '<div class="nav-sub">'
    +   '<a class="nav-sub-item ' + (isRegistry  ? 'active' : '') + '" href="01-registry.html">Registry</a>'
    +   '<a class="nav-sub-item ' + (isProfile   ? 'active' : '') + '" href="02-profile.html?patient=' + patientId + '">Patient Record</a>'
    +   '<a class="nav-sub-item ' + (isAssessment ? 'active' : '') + '" href="' + assessHref + '">Assessment</a>'
    + '</div>'
    : '';

  const assessBlock = (patientId && patientId !== '')
    ? '<div class="sidebar-assessment-block">'
    +   '<div class="sidebar-assessment-label">Current Patient</div>'
    +   '<div class="sidebar-assessment-patient">' + patient.name + '</div>'
    +   '<a class="sidebar-assessment-link" href="' + assessHref + '">Resume session &#8594;</a>'
    + '</div>'
    : '';

  const html = [
    '<aside class="sidebar">',
      '<div class="brand">',
        '<div style="margin-bottom:6px;"><img src="logo-white.png" alt="HearIntel" style="height:26px;width:auto;display:block;"></div>',
        '<div class="brand-sub">Practice Management</div>',
      '</div>',
      '<nav class="nav-group">',
        '<div class="nav-section">Clinical Ops</div>',
        '<a class="nav-item ' + (active === 'dashboard' ? 'active' : '') + '" href="00-dashboard.html" title="Dashboard">',
          '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg></span>',
          '<span class="nav-label">Dashboard</span>',
        '</a>',
        '<a class="nav-item ' + (showPatientSub ? 'active' : '') + '" href="01-registry.html" title="Patients">',
          '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>',
          '<span class="nav-label">Patients</span>',
        '</a>',
        patientSub,
        '<a class="nav-item ' + (active === 'screening' ? 'active' : '') + '" href="13-workspace-screening.html?patient=' + patientId + '" title="Hearing Screening">',
          '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg></span>',
          '<span class="nav-label">Screening</span>',
        '</a>',
        '<a class="nav-item ' + (active === 'media' ? 'active' : '') + '" href="10-media.html?patient=' + patientId + '" title="Clinical Media">',
          '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg></span>',
          '<span class="nav-label">Clinical Media</span>',
        '</a>',
        '<a class="nav-item ' + (active === 'settings' ? 'active' : '') + '" href="11-settings.html" title="Settings">',
          '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span>',
          '<span class="nav-label">Settings</span>',
        '</a>',
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
        '<div class="theme-switch-bar">',
          '<button type="button" class="theme-btn ' + (currentTheme==='precision'?'active':'') + '" onclick="event.stopPropagation();setTheme(\'precision\')">Precision</button>',
          '<button type="button" class="theme-btn ' + (currentTheme==='layered'?'active':'') + '" onclick="event.stopPropagation();setTheme(\'layered\')">Layered</button>',
          '<button type="button" class="theme-btn ' + (currentTheme==='editorial'?'active':'') + '" onclick="event.stopPropagation();setTheme(\'editorial\')">Editorial</button>',
        '</div>',
      '</div>',
    '</aside>'
  ].join('');
  return html;
}

function workspaceShell(active, content) {
  const patientId = getActivePatientId();
  const patient = (window.HearIntelDB && window.HearIntelDB.getPatient(patientId)) || { name: 'Amaia O.', mrn: 'LCC-26-01248', age: 46, gender: 'Female' };
  const currentTheme = getActiveTheme();
  const assessHref = '04-workspace-history.html?patient=' + patientId;

  const steps = [
    ['04-workspace-history.html?patient=' + patientId, 'History',          active === 'history'],
    ['05-workspace-otoscopy.html?patient=' + patientId, 'Otoscopy',         active === 'otoscopy'],
    ['06-workspace-pta.html?patient=' + patientId,      'Pure Tone (PTA)',  active === 'pta'],
    ['07-workspace-immittance.html?patient=' + patientId,'Immittance',      active === 'immittance'],
    ['08-workspace-speech.html?patient=' + patientId,   'Speech',           active === 'speech'],
    ['12-workspace-electrophysiology.html?patient=' + patientId, 'E-Physiology', active === 'electrophysiology'],
    ['09-conclusion.html?patient=' + patientId,         'Management',       active === 'conclusion'],
  ];

  const sidebarHtml = [
    '<aside class="sidebar">',
      '<div class="brand">',
        '<div style="margin-bottom:6px;"><img src="logo-white.png" alt="HearIntel" style="height:26px;width:auto;display:block;"></div>',
        '<div class="brand-sub">Assessment</div>',
      '</div>',
      '<nav class="nav-group">',
        '<div class="nav-section">Clinical Ops</div>',
        '<a class="nav-item" href="00-dashboard.html" title="Dashboard">',
          '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg></span>',
          '<span class="nav-label">Dashboard</span>',
        '</a>',
        '<a class="nav-item active" href="01-registry.html" title="Patients">',
          '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>',
          '<span class="nav-label">Patients</span>',
        '</a>',
        '<div class="nav-sub">',
          '<a class="nav-sub-item" href="01-registry.html">Registry</a>',
          '<a class="nav-sub-item" href="02-profile.html?patient=' + patientId + '">Patient Record</a>',
          '<a class="nav-sub-item active" href="' + assessHref + '">Assessment</a>',
        '</div>',
        '<a class="nav-item ' + (active === 'screening' ? 'active' : '') + '" href="13-workspace-screening.html?patient=' + patientId + '" title="Screening">',
          '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg></span>',
          '<span class="nav-label">Screening</span>',
        '</a>',
        '<a class="nav-item" href="10-media.html?patient=' + patientId + '" title="Clinical Media">',
          '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg></span>',
          '<span class="nav-label">Clinical Media</span>',
        '</a>',
        '<a class="nav-item" href="11-settings.html" title="Settings">',
          '<span class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span>',
          '<span class="nav-label">Settings</span>',
        '</a>',
      '</nav>',
      '<div class="sidebar-divider"></div>',
      '<div class="sidebar-assessment-block">',
        '<div class="sidebar-assessment-label">Current Patient</div>',
        '<div class="sidebar-assessment-patient">' + patient.name + '</div>',
        '<a class="sidebar-assessment-link" href="02-profile.html?patient=' + patientId + '">&#8592; Back to Record</a>',
      '</div>',
      '<div class="sidebar-divider"></div>',
      '<div class="sidebar-footer" onclick="openPatientLookupModal()" title="Search or switch patient">',
        '<div class="sidebar-footer-row">',
          '<span class="sidebar-footer-name">' + patient.name + '</span>',
          '<span class="sidebar-footer-switch">Switch</span>',
        '</div>',
        '<div class="sidebar-footer-meta">' + patient.age + 'y &middot; ' + patient.gender + ' &middot; ' + patient.mrn + '</div>',
        '<div class="theme-switch-bar">',
          '<button type="button" class="theme-btn ' + (currentTheme==='precision'?'active':'') + '" onclick="event.stopPropagation();setTheme(\'precision\')">Precision</button>',
          '<button type="button" class="theme-btn ' + (currentTheme==='layered'?'active':'') + '" onclick="event.stopPropagation();setTheme(\'layered\')">Layered</button>',
          '<button type="button" class="theme-btn ' + (currentTheme==='editorial'?'active':'') + '" onclick="event.stopPropagation();setTheme(\'editorial\')">Editorial</button>',
        '</div>',
      '</div>',
    '</aside>'
  ].join('');

  const workspaceHtml = [
    '<div class="workspace-main">',
      '<header class="encounter-header">',
        '<div>',
          '<div class="patient-name">' + patient.name + '</div>',
          '<div class="patient-meta">' + patient.age + ' yrs &middot; ' + patient.gender + ' &middot; ' + patient.mrn + ' &middot; ' + (patient.facility || 'Lagos Central Clinic') + '</div>',
        '</div>',
        '<div style="display:flex;align-items:center;gap:14px;">',
          '<a class="btn ghost" style="color:rgba(255,255,255,0.82);font-size:12px;min-height:28px;padding:0 10px;" href="02-profile.html?patient=' + patientId + '">&larr; Exit to Record</a>',
          '<div style="display:flex;align-items:center;gap:5px;font-size:11.5px;color:rgba(255,255,255,0.45);">',
            '<span style="width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.30);display:inline-block;"></span>',
            'Saved locally',
          '</div>',
        '</div>',
      '</header>',
      '<div class="encounter-body">',
        '<nav class="step-rail">',
          '<div class="rail-title">Assessment Flow</div>',
          steps.map(function(s, idx) {
            return '<a class="step ' + (s[2] ? 'active' : '') + '" href="' + s[0] + '">'
              + '<span class="step-marker">' + (idx + 1) + '</span>'
              + '<span class="step-label">' + s[1] + '</span>'
              + '</a>';
          }).join(''),
        '</nav>',
        '<main class="workspace-content"><div class="workspace-page">' + content + '</div></main>',
      '</div>',
    '</div>',
  ].join('');

  return sidebarHtml + workspaceHtml;
}



// ── Universal Shell Initializer ──
document.addEventListener('DOMContentLoaded', function() {
  // 1. Inject regular page shells (e.g. data-shell="dashboard", data-shell="patients", etc.)
  var shellHolders = document.querySelectorAll('[data-shell]');
  shellHolders.forEach(function(holder) {
    var activePage = holder.getAttribute('data-shell');
    holder.outerHTML = patientShell(activePage);
  });

  // 2. Inject workspace shells (e.g. data-workspace-page="history")
  var wsHolders = document.querySelectorAll('[data-workspace-page]');
  wsHolders.forEach(function(holder) {
    var pageKey = holder.getAttribute('data-workspace-page');
    var innerContent = holder.innerHTML;
    holder.outerHTML = workspaceShell(pageKey, innerContent);
  });

  // 3. Ensure active theme class/attribute is set
  document.documentElement.setAttribute('data-theme', getActiveTheme());
});

// ── CLINICAL REPORT GENERATOR ENGINE ──
let currentReportPatientId = 'amaia';
let currentReportType = 'full';

function openReportModal(patientId, reportType = 'full') {
  currentReportPatientId = patientId || getActivePatientId() || 'amaia';
  currentReportType = reportType;

  let modal = document.getElementById('reportExportModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'reportExportModal';
    modal.className = 'report-modal-backdrop';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="report-modal-window">
      <div class="report-modal-header">
        <div style="display:flex;align-items:center;gap:12px;">
          <strong style="font-size:15px;">Clinical Report Export & Download</strong>
          <select id="reportTypeSelector" onchange="switchReportView(this.value)" style="padding:4px 10px;font-size:12.5px;font-weight:600;border:1px solid var(--border);border-radius:var(--radius-sm);" ${currentReportType === 'screening' ? 'disabled style="opacity:0.6;cursor:not-allowed;"' : ''}>
            <option value="full" ${currentReportType === 'full' ? 'selected' : ''}>Full Comprehensive Evaluation Report (All Tests + Management)</option>
            <option value="screening" ${currentReportType === 'screening' ? 'selected' : ''}>Hearing Screening Report</option>
            <option value="all_assessments" ${currentReportType === 'all_assessments' ? 'selected' : ''}>Diagnostic Battery Report (All Tests Only, No Management/Rx)</option>
            <option value="history" ${currentReportType === 'history' ? 'selected' : ''}>1. Case History & Red Flag Report</option>
            <option value="otoscopy" ${currentReportType === 'otoscopy' ? 'selected' : ''}>2. Otoscopy Examination Report</option>
            <option value="pta" ${currentReportType === 'pta' ? 'selected' : ''}>3. Pure Tone Audiometry (PTA) Report</option>
            <option value="immittance" ${currentReportType === 'immittance' ? 'selected' : ''}>4. Immittance & Tympanometry Report</option>
            <option value="speech" ${currentReportType === 'speech' ? 'selected' : ''}>5. Speech & Tinnitus Assessment Report</option>
            <option value="electrophysiology" ${currentReportType === 'electrophysiology' ? 'selected' : ''}>6. Electrophysiological Battery Report</option>
            <option value="management" ${currentReportType === 'management' ? 'selected' : ''}>7. Diagnosis & Care Plan Management Report</option>
          </select>
        </div>
        <button class="btn" style="min-height:28px;padding:0 10px;font-weight:700;" onclick="closeReportModal()">✕</button>
      </div>

      <div class="report-modal-body">
        <div class="report-paper" id="reportPaperContent">
          <!-- Live generated report content -->
        </div>
      </div>

      <div class="report-modal-header" style="background:#FFFFFF;border-top:1px solid var(--border);border-bottom:none;justify-content:space-between;">
        <div style="font-size:12px;color:var(--text-secondary);">
          Formatted for standard A4 Clinical PDF / Print
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn" onclick="saveReportToMedia()">Save to Patient Media</button>
          <button class="btn primary" onclick="printReportDocument()">Download / Print PDF 🖨️</button>
        </div>
      </div>
    </div>
  `;

  renderReportContent();
  modal.style.display = 'flex';
}

function closeReportModal() {
  const modal = document.getElementById('reportExportModal');
  if (modal) modal.style.display = 'none';
}

function switchReportView(type) {
  currentReportType = type;
  renderReportContent();
}

function renderReportContent() {
  const paper = document.getElementById('reportPaperContent');
  if (!paper) return;

  const patient = window.HearIntelDB ? window.HearIntelDB.getPatient(currentReportPatientId) : null;
  const name = patient ? patient.name : 'Amaia O.';
  const id = patient ? (patient.mrn || patient.idNumber || 'LCC-26-01248') : 'LCC-26-01248';
  const ageSex = patient ? `${patient.age} yrs, ${patient.gender}` : '46 yrs, Female';
  const clinic = patient ? (patient.facility || patient.clinic || 'Lagos Central Clinic') : 'Lagos Central Clinic';
  const ptaR = patient ? Math.round(patient.ptaRight || 30) : 30;
  const ptaL = patient ? Math.round(patient.ptaLeft || 36) : 36;
  const diag = patient ? (patient.primaryDiagnosis || 'Bilateral Sensorineural Hearing Loss (ICD-10 H90.3)') : 'Bilateral Sensorineural Hearing Loss (ICD-10 H90.3)';

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  let headerHtml = `
    <div class="report-header-block">
      <div>
        <div style="font-size:18px;font-weight:800;letter-spacing:-0.02em;color:#0F172A;">HearIntel Audiological Medical Center</div>
        <div style="font-size:12px;color:#64748B;margin-top:2px;">Specialist Hearing Healthcare & Practice Management · ${clinic}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:14px;font-weight:700;color:#0F172A;">
          ${currentReportType === 'full' ? 'COMPREHENSIVE AUDIOLOGICAL EVALUATION & CARE PLAN' : 
            currentReportType === 'all_assessments' ? 'DIAGNOSTIC AUDIOLOGY ASSESSMENT BATTERY REPORT' : 'DIAGNOSTIC MODULE REPORT'}
        </div>
        <div style="font-size:11.5px;color:#64748B;margin-top:2px;">Date of Evaluation: ${dateStr}</div>
      </div>
    </div>

    <div class="report-meta-grid">
      <div><strong>Patient Name</strong><span>${name}</span></div>
      <div><strong>Patient ID / MRN</strong><span>${id}</span></div>
      <div><strong>Demographics</strong><span>${ageSex}</span></div>
      <div><strong>Examining Clinician</strong><span>Dr. Chika Okafor, Au.D.</span></div>
    </div>
  `;

  let bodyHtml = '';

  // 1. History Section
  if (['full', 'all_assessments', 'history'].includes(currentReportType)) {
    let complaint = 'Bilateral progressive hearing difficulty, most pronounced in competing background noise.';
    let redFlags = 'Negative for sudden hearing drop, negative for active drainage, otalgia, or vertigo.';
    if (patient && patient.id === 'david') {
      complaint = 'Unilateral sudden-onset hearing drop in left ear accompanied by high-pitched unilateral tinnitus.';
      redFlags = 'Positive for unilateral asymmetric sensorineural progression. Urgent specialist referral indicated.';
    } else if (patient && patient.id === 'ndidi') {
      complaint = 'Severe long-standing bilateral hearing loss with declining speech clarity despite power digital hearing aid usage.';
      redFlags = 'Negative for active middle-ear pathology or acute neurological event. Candidate for Cochlear Implant.';
    } else if (patient && patient.id === 'emeka') {
      complaint = 'Muffled sound quality bilaterally following recurrent childhood otitis media history.';
      redFlags = 'Negative for sensorineural drop; conductive middle-ear component confirmed.';
    }

    bodyHtml += `
      <div class="report-section">
        <div class="report-section-title"><span>1. Case History & Medical Red Flag Screening</span><span style="font-size:11px;font-weight:600;">Clinical Protocol Cleared</span></div>
        <div style="font-size:12.5px;line-height:1.6;color:#334155;">
          <div><strong>Chief Complaint:</strong> ${complaint}</div>
          <div><strong>Medical Red Flags:</strong> ${redFlags}</div>
        </div>
      </div>
    `;
  }

  // 2. Otoscopy Section
  if (['full', 'all_assessments', 'otoscopy'].includes(currentReportType)) {
    let tmStatusR = 'External auditory canal clear. Tympanic membrane intact, translucent with distinct cone of light.';
    let tmStatusL = 'External auditory canal clear. Tympanic membrane intact with normal landmark visibility.';
    if (patient && patient.id === 'emeka') {
      tmStatusR = 'External auditory canal clear. Tympanic membrane retracted with dull cone of light (Type B profile).';
      tmStatusL = 'External auditory canal clear. Tympanic membrane dull, thickened with reduced mobility.';
    }

    bodyHtml += `
      <div class="report-section">
        <div class="report-section-title"><span>2. Otoscopic Examination & Physical Clearance</span><span style="font-size:11px;font-weight:600;">Cleared Bilaterally</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;font-size:12px;color:#334155;">
          <div style="background:#F8FAFC;padding:10px 12px;border-radius:4px;border:1px solid #E2E8F0;">
            <strong style="color:#DC2626;">Right Ear (AD):</strong> ${tmStatusR}
          </div>
          <div style="background:#F8FAFC;padding:10px 12px;border-radius:4px;border:1px solid #E2E8F0;">
            <strong style="color:#2563EB;">Left Ear (AS):</strong> ${tmStatusL}
          </div>
        </div>
      </div>
    `;
  }

  // 3. PTA Section with Dynamic Threshold & True Mathematical PTA Calculation
  if (['full', 'all_assessments', 'pta'].includes(currentReportType)) {
    let th = null;
    if (typeof ptaData !== 'undefined' && ptaData.acR) {
      th = ptaData;
    } else if (patient && patient.assessments && patient.assessments[0] && patient.assessments[0].thresholds) {
      th = patient.assessments[0].thresholds;
    } else {
      const baseR = ptaR || 30;
      const baseL = ptaL || 36;
      th = {
        acR: { 250: Math.max(10, baseR - 10), 500: Math.max(10, baseR - 5), 1000: baseR, 2000: baseR + 5, 4000: baseR + 15, 8000: baseR + 25 },
        bcR: { 500: Math.max(10, baseR - 10), 1000: Math.max(10, baseR - 5), 2000: baseR, 4000: baseR + 10 },
        acL: { 250: Math.max(10, baseL - 10), 500: Math.max(10, baseL - 5), 1000: baseL, 2000: baseL + 5, 4000: baseL + 15, 8000: baseL + 25 },
        bcL: { 500: Math.max(10, baseL - 10), 1000: Math.max(10, baseL - 5), 2000: baseL, 4000: baseL + 10 }
      };
    }

    const calcPta = (track) => {
      if (!th || !th[track]) return 30;
      const f500 = th[track][500] !== undefined ? th[track][500] : 30;
      const f1k = th[track][1000] !== undefined ? th[track][1000] : 30;
      const f2k = th[track][2000] !== undefined ? th[track][2000] : 35;
      const f4k = th[track][4000] !== undefined ? th[track][4000] : 45;
      return Math.round((f500 + f1k + f2k + f4k) / 4);
    };

    const livePtaR = calcPta('acR');
    const livePtaL = calcPta('acL');
    const asymDiff = Math.abs(livePtaR - livePtaL);

    const getVal = (track, f) => {
      if (th && th[track] && th[track][f] !== undefined && th[track][f] !== null) return th[track][f];
      return '-';
    };

    bodyHtml += `
      <div class="report-section">
        <div class="report-section-title"><span>3. Pure Tone Audiometry (PTA)</span><span style="font-size:11px;font-weight:600;">PTA: ${livePtaR} dB R / ${livePtaL} dB L</span></div>
        <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:14px;align-items:start;">
          <table class="report-table">
            <thead>
              <tr>
                <th style="text-align:left;">Ear / Transducer</th><th>250</th><th>500</th><th>1k</th><th>2k</th><th>4k</th><th>8k</th><th>PTA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align:left;color:#DC2626;font-weight:600;">Right AC (O)</td>
                <td>${getVal('acR', 250)}</td><td>${getVal('acR', 500)}</td><td>${getVal('acR', 1000)}</td><td>${getVal('acR', 2000)}</td><td>${getVal('acR', 4000)}</td><td>${getVal('acR', 8000)}</td>
                <td><strong>${livePtaR} dB</strong></td>
              </tr>
              <tr>
                <td style="text-align:left;color:#DC2626;font-weight:600;">Right BC (&lt;)</td>
                <td>-</td><td>${getVal('bcR', 500)}</td><td>${getVal('bcR', 1000)}</td><td>${getVal('bcR', 2000)}</td><td>${getVal('bcR', 4000)}</td><td>-</td>
                <td><strong>-</strong></td>
              </tr>
              <tr>
                <td style="text-align:left;color:#2563EB;font-weight:600;">Left AC (X)</td>
                <td>${getVal('acL', 250)}</td><td>${getVal('acL', 500)}</td><td>${getVal('acL', 1000)}</td><td>${getVal('acL', 2000)}</td><td>${getVal('acL', 4000)}</td><td>${getVal('acL', 8000)}</td>
                <td><strong>${livePtaL} dB</strong></td>
              </tr>
              <tr>
                <td style="text-align:left;color:#2563EB;font-weight:600;">Left BC (&gt;)</td>
                <td>-</td><td>${getVal('bcL', 500)}</td><td>${getVal('bcL', 1000)}</td><td>${getVal('bcL', 2000)}</td><td>${getVal('bcL', 4000)}</td><td>-</td>
                <td><strong>-</strong></td>
              </tr>
            </tbody>
          </table>
          <div style="font-size:11.5px;line-height:1.55;color:#334155;background:#F8FAFC;padding:8px 12px;border-radius:4px;border:1px solid #E2E8F0;">
            <div><strong>Configuration:</strong> ${livePtaR > 70 || livePtaL > 70 ? 'Severe-to-profound sensorineural loss' : 'Mild-to-moderate sloping SNHL'}.</div>
            <div><strong>Air-Bone Gap:</strong> ${patient && patient.id === 'emeka' ? '25 dB (Conductive component)' : '<10 dB (Sensorineural profile)'}.</div>
            <div><strong>Asymmetry:</strong> ${asymDiff} dB (${asymDiff >= 15 ? 'Asymmetric — Investigation Indicated' : 'Symmetric WNL'}).</div>
          </div>
        </div>
      </div>
    `;
  }

  // 4. Immittance & Tympanometry Section (Dynamic based on patient condition)
  if (['full', 'all_assessments', 'immittance'].includes(currentReportType)) {
    let tympR = { type: 'Type A', pres: '-20 daPa', comp: '0.78 mL', ecv: '1.15 mL', ipsi: '85 dB', contra: '90 dB', decay: 'Negative' };
    let tympL = { type: 'Type A', pres: '-30 daPa', comp: '0.72 mL', ecv: '1.08 mL', ipsi: '90 dB', contra: '95 dB', decay: 'Negative' };

    if (patient && patient.id === 'emeka') {
      tympR = { type: 'Type B (Effusion)', pres: 'N/A', comp: '0.18 mL', ecv: '1.10 mL', ipsi: 'Absent', contra: 'Absent', decay: 'N/A' };
      tympL = { type: 'Type B (Effusion)', pres: 'N/A', comp: '0.15 mL', ecv: '1.05 mL', ipsi: 'Absent', contra: 'Absent', decay: 'N/A' };
    } else if (patient && patient.id === 'ndidi') {
      tympR = { type: 'Type A', pres: '-15 daPa', comp: '0.85 mL', ecv: '1.20 mL', ipsi: 'Absent (>105)', contra: 'Absent (>105)', decay: 'N/A' };
      tympL = { type: 'Type A', pres: '-25 daPa', comp: '0.80 mL', ecv: '1.18 mL', ipsi: 'Absent (>105)', contra: 'Absent (>105)', decay: 'N/A' };
    } else if (patient && patient.id === 'david') {
      tympR = { type: 'Type A', pres: '-10 daPa', comp: '0.75 mL', ecv: '1.12 mL', ipsi: '85 dB', contra: '90 dB', decay: 'Negative' };
      tympL = { type: 'Type A', pres: '-20 daPa', comp: '0.70 mL', ecv: '1.10 mL', ipsi: '105 dB', contra: '>105 dB', decay: 'Positive (>50% drop)' };
    }

    bodyHtml += `
      <div class="report-section">
        <div class="report-section-title"><span>4. Immittance & Acoustic Reflex Battery</span><span style="font-size:11px;font-weight:600;">${tympR.type} / ${tympL.type}</span></div>
        <table class="report-table">
          <thead>
            <tr>
              <th style="text-align:left;">Ear</th><th>Peak Pressure</th><th>Compliance</th><th>Volume (ECV)</th><th>Type</th><th>Ipsi 1k</th><th>Contra 1k</th><th>10s Decay</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align:left;color:#DC2626;font-weight:600;">Right (AD)</td><td>${tympR.pres}</td><td>${tympR.comp}</td><td>${tympR.ecv}</td><td><strong>${tympR.type}</strong></td><td>${tympR.ipsi}</td><td>${tympR.contra}</td><td>${tympR.decay}</td>
            </tr>
            <tr>
              <td style="text-align:left;color:#2563EB;font-weight:600;">Left (AS)</td><td>${tympL.pres}</td><td>${tympL.comp}</td><td>${tympL.ecv}</td><td><strong>${tympL.type}</strong></td><td>${tympL.ipsi}</td><td>${tympL.contra}</td><td>${tympL.decay}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  // 5. Speech & Tinnitus Section (Dynamic based on patient condition)
  if (['full', 'all_assessments', 'speech'].includes(currentReportType)) {
    let speechSrtR = '30 dB (AD)';
    let speechSrtL = '35 dB (AS)';
    let speechWrsR = '88% (AD)';
    let speechWrsL = '76% (AS)';
    let rolloverNotes = '0.05 (AD) / 0.11 (AS) — Negative for retrocochlear lesion.';
    let quickSin = '+4.5 dB (Mild SNR loss in competing babble).';

    if (patient && patient.id === 'ndidi') {
      speechSrtR = '75 dB (AD)';
      speechSrtL = '80 dB (AS)';
      speechWrsR = '36% (AD)';
      speechWrsL = '28% (AS)';
      rolloverNotes = 'Severe discrimination breakdown; CNC sentence score <35% (CI Indicated).';
      quickSin = '>15 dB (Severe SNR loss).';
    } else if (patient && patient.id === 'david') {
      speechSrtR = '25 dB (AD)';
      speechSrtL = '55 dB (AS)';
      speechWrsR = '92% (AD)';
      speechWrsL = '52% (AS)';
      rolloverNotes = 'Left ear Rollover Index R = 0.44 (>0.40 Significant Retrocochlear Warning).';
      quickSin = '+8.5 dB (Left Ear Impairment).';
    } else if (patient && patient.id === 'emeka') {
      speechSrtR = '40 dB (AD)';
      speechSrtL = '45 dB (AS)';
      speechWrsR = '96% (AD)';
      speechWrsL = '92% (AS)';
      rolloverNotes = 'Normal discrimination at conductive presentation level (75 dB HL).';
      quickSin = '+1.5 dB (Normal SNR in Noise).';
    }

    bodyHtml += `
      <div class="report-section">
        <div class="report-section-title"><span>5. Speech Audiometry & Tinnitus Battery</span><span style="font-size:11px;font-weight:600;">WRS: ${speechWrsR} / ${speechWrsL}</span></div>
        <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:14px;font-size:12px;color:#334155;">
          <div style="background:#F8FAFC;padding:10px 12px;border-radius:4px;border:1px solid #E2E8F0;">
            <div><strong>Speech Recognition Threshold (SRT):</strong> ${speechSrtR} / ${speechSrtL}.</div>
            <div><strong>Word Recognition Score (WRS):</strong> ${speechWrsR} / ${speechWrsL}.</div>
            <div><strong>Rollover Index:</strong> ${rolloverNotes}</div>
            <div><strong>QuickSIN SNR Loss:</strong> ${quickSin}</div>
          </div>
          <div style="background:#F8FAFC;padding:10px 12px;border-radius:4px;border:1px solid #E2E8F0;">
            <div><strong>Tinnitus Pitch Match:</strong> 4000 Hz Pure Tone (Bilateral).</div>
            <div><strong>Minimum Masking Level (MML):</strong> 48 dB HL (Broadband Noise).</div>
            <div><strong>Tinnitus Handicap (THI):</strong> Score 28 / 100 (Grade 2 Mild Handicap).</div>
          </div>
        </div>
      </div>
    `;
  }

  // 6. Electrophysiology Section (Dynamic)
  if (['full', 'all_assessments', 'electrophysiology'].includes(currentReportType)) {
    let abrR = { w1: '1.62 ms', w3: '3.74 ms', w5: '5.62 ms', interval: '4.00 ms (Normal)', oae: 'Pass (1k-3k Hz)' };
    let abrL = { w1: '1.68 ms', w3: '3.80 ms', w5: '5.68 ms', interval: '4.00 ms (Normal)', oae: 'Refer (>2kHz)' };
    let ephysNote = 'Negative for ANSD or retrocochlear pathology. Wave I-V central conduction within normal limits.';

    if (patient && patient.id === 'david') {
      abrL = { w1: '1.70 ms', w3: '4.35 ms', w5: '6.55 ms', interval: '4.85 ms (Prolonged)', oae: 'Pass (Preserved OHC)' };
      ephysNote = 'Prolonged I-V interpeak interval on Left (4.85 ms) with significant interaural Wave V delay (IT5 = 0.93 ms). Retrocochlear 8th nerve investigation indicated.';
    } else if (patient && patient.id === 'ndidi') {
      abrR = { w1: 'Absent', w3: 'Absent', w5: '7.85 ms (80dB)', interval: 'N/A', oae: 'Absent Bilaterally' };
      abrL = { w1: 'Absent', w3: 'Absent', w5: '8.20 ms (80dB)', interval: 'N/A', oae: 'Absent Bilaterally' };
      ephysNote = 'Severe threshold elevation consistent with profound cochlear sensory loss. Normal neural synchrony at high intensities.';
    }

    bodyHtml += `
      <div class="report-section">
        <div class="report-section-title"><span>6. Electrophysiological Battery (ABR & OAE)</span><span style="font-size:11px;font-weight:600;">Results Documented</span></div>
        <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:14px;align-items:start;">
          <table class="report-table">
            <thead>
              <tr>
                <th style="text-align:left;">Modality / Ear</th><th>Wave I</th><th>Wave III</th><th>Wave V</th><th>I-V Interval</th><th>DPOAE Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align:left;color:#DC2626;font-weight:600;">Right (AD)</td><td>${abrR.w1}</td><td>${abrR.w3}</td><td>${abrR.w5}</td><td>${abrR.interval}</td><td>${abrR.oae}</td>
              </tr>
              <tr>
                <td style="text-align:left;color:#2563EB;font-weight:600;">Left (AS)</td><td>${abrL.w1}</td><td>${abrL.w3}</td><td>${abrL.w5}</td><td>${abrL.interval}</td><td>${abrL.oae}</td>
              </tr>
            </tbody>
          </table>
          <div style="font-size:11.5px;line-height:1.55;color:#334155;background:#F8FAFC;padding:8px 12px;border-radius:4px;border:1px solid #E2E8F0;">
            <div><strong>Diagnostic Pattern:</strong> ${ephysNote}</div>
          </div>
        </div>
      </div>
    `;
  }

  // 7. Management & Care Plan Section
  if (['full', 'management'].includes(currentReportType)) {
    const nextRecall = patient ? (patient.nextRecall || '26 Aug 2026') : '26 Aug 2026';
    const recallReason = patient ? (patient.recallReason || '3-Week Hearing Aid REM Verification') : '3-Week Hearing Aid REM Verification';

    bodyHtml += `
      <div class="report-section" style="border-bottom:none;">
        <div class="report-section-title"><span>7. Diagnostic Classification & Management Plan</span><span style="font-size:11px;font-weight:600;">Care Plan Active</span></div>
        <div style="background:#F8FAFC;padding:12px 14px;border-radius:4px;border:1px solid #E2E8F0;margin-bottom:12px;">
          <div style="font-size:13px;font-weight:700;color:#0F172A;margin-bottom:4px;">Primary Diagnosis: ${diag}</div>
          <div style="font-size:12px;color:#475569;line-height:1.5;">${patient && patient.alerts && patient.alerts.length > 0 ? patient.alerts.join(' · ') : 'Diagnostic assessment confirms clinical indication for management pathway.'}</div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;font-size:12px;color:#334155;">
          <div>
            <strong>Active Clinical Pathway:</strong>
            <div style="margin-top:2px;">${patient && patient.pathwayLabel ? patient.pathwayLabel : 'Hearing Aid Amplification'}</div>
          </div>
          <div>
            <strong>Scheduled Recall:</strong>
            <div style="margin-top:2px;font-weight:600;color:#0F766E;">${nextRecall} (${recallReason})</div>
          </div>
        </div>
      </div>
    `;
  }

  let footerHtml = `
    <div class="report-signature-block">
      <div>
        <div class="sig-line"></div>
        <div style="font-size:12px;font-weight:700;color:#0F172A;">Dr. Chika Okafor, Au.D.</div>
        <div style="font-size:11px;color:#64748B;">Lead Clinical Audiologist · Reg #HA-2024-0891</div>
      </div>
      <div style="text-align:right;">
        <div class="sig-line"></div>
        <div style="font-size:12px;font-weight:700;color:#0F172A;">Electronic Clinical Verification</div>
        <div style="font-size:11px;color:#64748B;">HearIntel Practice Management Engine v3.2</div>
      </div>
    </div>
  `;


  // SCREENING REPORT — Dedicated block, reads from screeningDemographics global
  if (currentReportType === 'screening') {
    const sd = (typeof screeningDemographics !== 'undefined') ? screeningDemographics : {};
    const proto = (typeof currentProtocol !== 'undefined') ? currentProtocol : 'adult';
    const protoLabels = { adult: 'Adult Screening Protocol (25 dB HL)', pediatric: 'Pediatric / School Protocol (20 dB HL)', occupational: 'Occupational Protocol (OSHA STS)', newborn: 'Newborn Protocol (UNHS A-ABR / OAE)' };
    const protoLabel = protoLabels[proto] || proto;

    const otoR = (typeof document !== 'undefined' && document.getElementById('otoTriageR')) ? document.getElementById('otoTriageR').value : sd.otoR || 'clear';
    const otoL = (typeof document !== 'undefined' && document.getElementById('otoTriageL')) ? document.getElementById('otoTriageL').value : sd.otoL || 'clear';
    const otoLabels = { clear: 'Clear / Intact TM', wax: 'Partial Cerumen', occluded: 'Occluding Cerumen (Refer for Removal)', abnormal: 'Perforation / Inflammation' };

    // Get sweep results snapshot
    const sweepData = (typeof sweepResults !== 'undefined') ? sweepResults : {};
    const activeFreqs = proto === 'pediatric' ? [500,1000,2000,4000] : [1000,2000,4000];
    const formatSweep = (ear) => {
      if (!sweepData[ear]) return 'Not recorded';
      return activeFreqs.map(f => {
        const v = sweepData[ear][f];
        return v === null ? `${f}Hz: Untested` : v ? `${f}Hz: Heard` : `${f}Hz: Missed`;
      }).join(' | ');
    };

    // HHIE
    const hhieTotal = (typeof hhieScores !== 'undefined') ? Object.values(hhieScores).reduce((a,b) => a+b, 0) : (sd.hhieScore || 0);
    let hhieBand = 'No significant handicap (0–8)';
    if (hhieTotal >= 10 && hhieTotal <= 24) hhieBand = 'Mild-to-moderate handicap (10–24) — Referral recommended';
    if (hhieTotal >= 26) hhieBand = 'Significant handicap (26–40) — Urgent referral indicated';

    // Disposition
    const dispEl = typeof document !== 'undefined' ? document.getElementById('dispTitle') : null;
    const dispDescEl = typeof document !== 'undefined' ? document.getElementById('dispDesc') : null;
    const dispText = dispEl ? dispEl.textContent.trim() : (sd.outcome === 'pass' ? 'Hearing Screening Passed' : 'Diagnostic Referral Indicated');
    const dispDesc = dispDescEl ? dispDescEl.textContent.trim() : '';

    // OAE (newborn)
    const oae = (typeof oaeResults !== 'undefined') ? oaeResults : { r: 'not recorded', l: 'not recorded' };

    // Rescreening interval
    const rescreenMap = { adult: '5 years (or annually if age ≥65)', pediatric: 'Annual school hearing surveillance', occupational: 'Annual mandatory occupational audiometric monitoring', newborn: 'UNHS 1-3-6 Benchmark — confirm by 3 months, intervene by 6 months' };

    const demoName   = sd.fullName    || name;
    const demoDob    = sd.dob         || '—';
    const demoAge    = sd.age         || ageSex;
    const demoSex    = sd.sex         || '—';
    const demoOcc    = sd.occupation  || '—';
    const demoPhone  = sd.phone       || '—';
    const demoRef    = sd.referralSource || 'Self';
    const demoReason = sd.reason      || '—';
    const demoClin   = sd.clinician   || 'Dr. Chika Okafor, Au.D.';

    headerHtml = `
      <div class="report-header-block">
        <div>
          <div style="font-size:18px;font-weight:800;letter-spacing:-0.02em;color:#0F172A;">HearIntel Audiological Medical Center</div>
          <div style="font-size:12px;color:#64748B;margin-top:2px;">Specialist Hearing Healthcare and Practice Management · ${clinic}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:14px;font-weight:700;color:#0F172A;">HEARING HEALTH SCREENING REPORT</div>
          <div style="font-size:11.5px;color:#64748B;margin-top:2px;">Date of Screening: ${dateStr}</div>
        </div>
      </div>
      <div class="report-meta-grid">
        <div><strong>Patient Name</strong><span>${demoName}</span></div>
        <div><strong>Patient ID / MRN</strong><span>${id}</span></div>
        <div><strong>Date of Birth</strong><span>${demoDob}</span></div>
        <div><strong>Age / Sex</strong><span>${demoAge} / ${demoSex}</span></div>
        <div><strong>Phone</strong><span>${demoPhone}</span></div>
        <div><strong>Occupation</strong><span>${demoOcc}</span></div>
        <div><strong>Referral Source</strong><span>${demoRef}</span></div>
        <div><strong>Screener / Clinician</strong><span>${demoClin}</span></div>
      </div>
    `;

    bodyHtml = `
      <div class="report-section">
        <div class="report-section-title"><span>1. Screening Protocol</span><span style="font-size:11px;font-weight:600;">${protoLabel}</span></div>
        <div style="font-size:12.5px;color:#334155;">
          <div><strong>Reason for Screening:</strong> ${demoReason}</div>
        </div>
      </div>

      <div class="report-section">
        <div class="report-section-title"><span>2. Otoscopic Clearance</span><span style="font-size:11px;font-weight:600;">${(otoR==='clear'&&otoL==='clear') ? 'Cleared Bilaterally' : 'Clearance Concern Noted'}</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;font-size:12px;color:#334155;">
          <div style="background:#F8FAFC;padding:10px 12px;border-radius:4px;border:1px solid #E2E8F0;">
            <strong style="color:#DC2626;">Right Ear (AD):</strong> ${otoLabels[otoR] || otoR}
          </div>
          <div style="background:#F8FAFC;padding:10px 12px;border-radius:4px;border:1px solid #E2E8F0;">
            <strong style="color:#2563EB;">Left Ear (AS):</strong> ${otoLabels[otoL] || otoL}
          </div>
        </div>
      </div>

      ${(proto === 'adult' || proto === 'pediatric') ? `
      <div class="report-section">
        <div class="report-section-title"><span>3. Pure Tone Sweep Results</span><span style="font-size:11px;font-weight:600;">${protoLabel}</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;font-size:12px;color:#334155;">
          <div style="background:#F8FAFC;padding:10px 12px;border-radius:4px;border:1px solid #E2E8F0;">
            <strong style="color:#DC2626;">Right Ear (AD):</strong><br>${formatSweep('r')}
          </div>
          <div style="background:#F8FAFC;padding:10px 12px;border-radius:4px;border:1px solid #E2E8F0;">
            <strong style="color:#2563EB;">Left Ear (AS):</strong><br>${formatSweep('l')}
          </div>
        </div>
      </div>` : ''}

      ${proto === 'newborn' ? `
      <div class="report-section">
        <div class="report-section-title"><span>3. OAE / A-ABR Results</span><span style="font-size:11px;font-weight:600;">UNHS Protocol</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;font-size:12px;color:#334155;">
          <div style="background:#F8FAFC;padding:10px 12px;border-radius:4px;border:1px solid #E2E8F0;"><strong style="color:#DC2626;">Right Ear (AD):</strong> ${oae.r || 'Not recorded'}</div>
          <div style="background:#F8FAFC;padding:10px 12px;border-radius:4px;border:1px solid #E2E8F0;"><strong style="color:#2563EB;">Left Ear (AS):</strong> ${oae.l || 'Not recorded'}</div>
        </div>
      </div>` : ''}

      ${proto === 'adult' ? `
      <div class="report-section">
        <div class="report-section-title"><span>4. Hearing Handicap Inventory (HHIE-S)</span><span style="font-size:11px;font-weight:600;">Score: ${hhieTotal} / 40</span></div>
        <div style="font-size:12.5px;color:#334155;">
          <div><strong>Raw Score:</strong> ${hhieTotal} / 40</div>
          <div><strong>Interpretation:</strong> ${hhieBand}</div>
        </div>
      </div>` : ''}

      <div class="report-section" style="border-bottom:none;">
        <div class="report-section-title"><span>5. Clinical Disposition and Recommendations</span></div>
        <div style="background:#F8FAFC;padding:12px 14px;border-radius:4px;border:1px solid #E2E8F0;margin-bottom:10px;">
          <div style="font-size:13px;font-weight:700;color:#0F172A;margin-bottom:4px;">${dispText}</div>
          <div style="font-size:12px;color:#475569;line-height:1.5;">${dispDesc || 'See screening summary above.'}</div>
        </div>
        <div style="font-size:12px;color:#334155;">
          <strong>Recommended Rescreening Interval:</strong> ${rescreenMap[proto] || 'As clinically indicated.'}
        </div>
      </div>
    `;
  }

    paper.innerHTML = headerHtml + bodyHtml + footerHtml;
}

function saveReportToMedia() {
  const patient = window.HearIntelDB ? window.HearIntelDB.getPatient(currentReportPatientId) : null;
  if (patient) {
    if (!patient.media) patient.media = [];
    const reportLabel = currentReportType === 'full' ? 'Full_Audiological_Evaluation_Report.pdf' : `${currentReportType.toUpperCase()}_Diagnostic_Report.pdf`;
    
    patient.media.unshift({
      id: 'doc-' + Date.now(),
      name: reportLabel,
      type: 'PDF Diagnostic Document',
      date: 'Today',
      size: '1.8 MB'
    });
    window.HearIntelDB.savePatient(patient);
    notify(`${reportLabel} saved to Patient Media & Documents.`);
  }
}
