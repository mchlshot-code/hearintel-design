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

// ── CLINICAL REPORT GENERATOR ENGINE (LONGITUDINAL EMR SYSTEM) ──
let currentReportPatientId = 'amaia';
let currentReportType = 'full';
let currentReportTimeframe = 'all'; // 'all', '12m', '6m', 'latest'
let activeReportAssessments = []; // selected encounter IDs

function openReportModal(patientId, reportType = 'full') {
  currentReportPatientId = patientId || getActivePatientId() || 'amaia';
  currentReportType = reportType;
  currentReportTimeframe = 'all';

  const patient = window.HearIntelDB ? window.HearIntelDB.getPatient(currentReportPatientId) : null;
  if (patient && patient.assessments) {
    activeReportAssessments = patient.assessments.map(a => a.id);
  } else {
    activeReportAssessments = [];
  }

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
          
          <select id="reportTypeSelector" onchange="switchReportView(this.value)" style="padding:5px 10px;font-size:12px;font-weight:600;">
            <option value="full" ${currentReportType === 'full' ? 'selected' : ''}>Full Longitudinal Clinical Journey (Complete EMR Record)</option>
            <option value="ent_referral" ${currentReportType === 'ent_referral' ? 'selected' : ''}>Specialist ENT / Medical Referral Synthesis</option>
            <option value="audiology_battery" ${currentReportType === 'audiology_battery' ? 'selected' : ''}>Diagnostic Audiology Battery &amp; Quantitative Data Only</option>
            <option value="patient_summary" ${currentReportType === 'patient_summary' ? 'selected' : ''}>Patient &amp; Family Care Plan / Aural Rehab Summary</option>
            <option value="screening" ${currentReportType === 'screening' ? 'selected' : ''}>Hearing Health Screening Report</option>
          </select>

          <select id="reportTimeframeSelector" onchange="switchReportTimeframe(this.value)" style="padding:5px 10px;font-size:12px;font-weight:600;">
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

      <!-- Quick-Jump Document Navigation Bar -->
      <div style="background:#0F172A;border-bottom:1px solid rgba(255,255,255,0.08);padding:6px 20px;display:flex;gap:8px;overflow-x:auto;font-size:11px;white-space:nowrap;">
        <span style="color:rgba(255,255,255,0.4);display:flex;align-items:center;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">Jump to:</span>
        <a href="#sec-summary" style="color:#38BDF8;padding:2px 6px;border-radius:3px;background:rgba(56,189,248,0.1);">1. Summary</a>
        <a href="#sec-timeline" style="color:#94A3B8;padding:2px 6px;">2. Timeline</a>
        <a href="#sec-results" style="color:#94A3B8;padding:2px 6px;">3. Measurements</a>
        <a href="#sec-audiogram" style="color:#94A3B8;padding:2px 6px;">4. Audiogram</a>
        <a href="#sec-longitudinal" style="color:#94A3B8;padding:2px 6px;">5. Shift &amp; Delta</a>
        <a href="#sec-diagnoses" style="color:#94A3B8;padding:2px 6px;">6. Diagnoses</a>
        <a href="#sec-careplan" style="color:#94A3B8;padding:2px 6px;">7. Care Plan</a>
        <a href="#sec-media" style="color:#94A3B8;padding:2px 6px;">8. Media</a>
        <a href="#sec-conclusion" style="color:#94A3B8;padding:2px 6px;">9. Conclusion</a>
      </div>

      <!-- Scrollable Document Desk Background -->
      <div class="report-modal-body" id="reportModalBodyContainer">
        <div class="report-paper" id="reportPaperContent">
          <!-- Live generated longitudinal report content -->
        </div>
      </div>

      <!-- Bottom Action Footer -->
      <div class="report-modal-header" style="background:#0F172A;border-top:1px solid rgba(255,255,255,0.08);border-bottom:none;justify-content:space-between;">
        <div style="font-size:11.5px;color:rgba(255,255,255,0.6);display:flex;align-items:center;gap:6px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Clinical Longitudinal EMR &middot; A4 Multi-Page Compliant
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

function switchReportTimeframe(tf) {
  currentReportTimeframe = tf;
  renderReportContent();
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
    // Logarithmic interpolation fallback
    const minL = Math.log10(125);
    const maxL = Math.log10(8000);
    return pL + ((Math.log10(f) - minL) / (maxL - minL)) * plotW;
  };

  const getY = (db) => {
    return pT + ((db - (-10)) / (120 - (-10))) * plotH;
  };

  let svg = `<svg viewBox="0 0 ${width} ${height}" style="width:100%;max-width:${width}px;background:#FFFFFF;border:1px solid #CBD5E1;border-radius:4px;font-family:'DM Sans',sans-serif;">`;

  // Shaded Normal Hearing Zone (0 to 20 dB)
  const normY1 = getY(0);
  const normY2 = getY(20);
  svg += `<rect x="${pL}" y="${normY1}" width="${plotW}" height="${normY2 - normY1}" fill="#F0FDF4" opacity="0.8"/>`;
  svg += `<text x="${pL + 8}" y="${normY2 - 4}" font-size="9" fill="#16A34A" font-weight="600">Normal Hearing Range (&le;20 dB HL)</text>`;

  // Horizontal Grid lines & dB labels
  dBs.forEach(db => {
    const y = getY(db);
    const isMajor = db === 0 || db === 20 || db === 40 || db === 70 || db === 90;
    svg += `<line x1="${pL}" y1="${y}" x2="${pL + plotW}" y2="${y}" stroke="${isMajor ? '#94A3B8' : '#E2E8F0'}" stroke-width="${isMajor ? 1 : 0.75}" stroke-dasharray="${db === 20 ? '4 2' : 'none'}"/>`;
    svg += `<text x="${pL - 8}" y="${y + 3.5}" font-size="9.5" font-weight="${isMajor ? 700 : 500}" fill="#475569" text-anchor="end">${db}</text>`;
  });

  // Vertical Grid lines & Frequency labels
  freqs.forEach(f => {
    const x = getX(f);
    const isInter = f === 3000 || f === 6000;
    svg += `<line x1="${x}" y1="${pT}" x2="${x}" y2="${pT + plotH}" stroke="${isInter ? '#CBD5E1' : '#94A3B8'}" stroke-width="${isInter ? 0.75 : 1}" stroke-dasharray="${isInter ? '3 3' : 'none'}"/>`;
    svg += `<text x="${x}" y="${pT - 8}" font-size="10" font-weight="${isInter ? 500 : 700}" fill="#1E293B" text-anchor="middle">${f >= 1000 ? (f/1000)+'k' : f}</text>`;
  });

  // Axis Labels
  svg += `<text x="${pL + plotW / 2}" y="${pT - 18}" font-size="10" font-weight="700" fill="#64748B" text-anchor="middle">Frequency (Hz)</text>`;
  svg += `<text x="${pL - 32}" y="${pT + plotH / 2}" font-size="10" font-weight="700" fill="#64748B" text-anchor="middle" transform="rotate(-90 ${pL - 32} ${pT + plotH / 2})">Hearing Level (dB HL)</text>`;

  // ── Plot Baseline Overlay (if available) ──
  if (baselineThresholds) {
    if (baselineThresholds.acR) {
      let ptsR = [];
      Object.keys(baselineThresholds.acR).map(Number).sort((a,b)=>a-b).forEach(f => {
        const v = baselineThresholds.acR[f];
        if (v !== undefined && v !== null) ptsR.push(`${getX(f)},${getY(v)}`);
      });
      if (ptsR.length > 1) {
        svg += `<polyline points="${ptsR.join(' ')}" fill="none" stroke="#FCA5A5" stroke-width="1.5" stroke-dasharray="4 3"/>`;
      }
    }
    if (baselineThresholds.acL) {
      let ptsL = [];
      Object.keys(baselineThresholds.acL).map(Number).sort((a,b)=>a-b).forEach(f => {
        const v = baselineThresholds.acL[f];
        if (v !== undefined && v !== null) ptsL.push(`${getX(f)},${getY(v)}`);
      });
      if (ptsL.length > 1) {
        svg += `<polyline points="${ptsL.join(' ')}" fill="none" stroke="#93C5FD" stroke-width="1.5" stroke-dasharray="4 3"/>`;
      }
    }
  }

  // ── Plot Current Evaluation Curves ──
  // Right Ear AC (Red 'O' and solid line)
  if (currentThresholds && currentThresholds.acR) {
    let pts = [];
    const fSorted = Object.keys(currentThresholds.acR).map(Number).sort((a,b)=>a-b);
    fSorted.forEach(f => {
      const val = currentThresholds.acR[f];
      if (val !== undefined && val !== null) {
        const cx = getX(f);
        const cy = getY(val);
        pts.push(`${cx},${cy}`);
      }
    });
    if (pts.length > 1) {
      svg += `<polyline points="${pts.join(' ')}" fill="none" stroke="#DC2626" stroke-width="2.2"/>`;
    }
    fSorted.forEach(f => {
      const val = currentThresholds.acR[f];
      if (val !== undefined && val !== null) {
        const cx = getX(f);
        const cy = getY(val);
        svg += `<circle cx="${cx}" cy="${cy}" r="4.5" fill="#FFFFFF" stroke="#DC2626" stroke-width="2.2"/>`;
      }
    });
  }

  // Right Ear BC (Red '<' bracket)
  if (currentThresholds && currentThresholds.bcR) {
    Object.keys(currentThresholds.bcR).map(Number).forEach(f => {
      const val = currentThresholds.bcR[f];
      if (val !== undefined && val !== null) {
        const cx = getX(f) - 6;
        const cy = getY(val);
        svg += `<path d="M${cx+4} ${cy-5} L${cx-2} ${cy} L${cx+4} ${cy+5}" fill="none" stroke="#DC2626" stroke-width="2"/>`;
      }
    });
  }

  // Left Ear AC (Blue 'X' and solid line)
  if (currentThresholds && currentThresholds.acL) {
    let pts = [];
    const fSorted = Object.keys(currentThresholds.acL).map(Number).sort((a,b)=>a-b);
    fSorted.forEach(f => {
      const val = currentThresholds.acL[f];
      if (val !== undefined && val !== null) {
        const cx = getX(f);
        const cy = getY(val);
        pts.push(`${cx},${cy}`);
      }
    });
    if (pts.length > 1) {
      svg += `<polyline points="${pts.join(' ')}" fill="none" stroke="#2563EB" stroke-width="2.2"/>`;
    }
    fSorted.forEach(f => {
      const val = currentThresholds.acL[f];
      if (val !== undefined && val !== null) {
        const cx = getX(f);
        const cy = getY(val);
        svg += `<line x1="${cx-4}" y1="${cy-4}" x2="${cx+4}" y2="${cy+4}" stroke="#2563EB" stroke-width="2.2"/>`;
        svg += `<line x1="${cx+4}" y1="${cy-4}" x2="${cx-4}" y2="${cy+4}" stroke="#2563EB" stroke-width="2.2"/>`;
      }
    });
  }

  // Left Ear BC (Blue '>' bracket)
  if (currentThresholds && currentThresholds.bcL) {
    Object.keys(currentThresholds.bcL).map(Number).forEach(f => {
      const val = currentThresholds.bcL[f];
      if (val !== undefined && val !== null) {
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

// ── COMPREHENSIVE LONGITUDINAL REPORT RENDERER ──
function renderReportContent() {
  const paper = document.getElementById('reportPaperContent');
  if (!paper) return;

  const patient = window.HearIntelDB ? window.HearIntelDB.getPatient(currentReportPatientId) : null;
  const name = patient ? patient.name : 'Amaia O.';
  const fullName = patient ? (patient.fullName || patient.name) : 'Amaia Okafor';
  const mrn = patient ? (patient.mrn || patient.idNumber || 'LCC-26-01248') : 'LCC-26-01248';
  const dob = patient ? (patient.dob || '1980-04-12') : '1980-04-12';
  const age = patient ? patient.age : 46;
  const gender = patient ? patient.gender : 'Female';
  const phone = patient ? (patient.phone || '+234 803 219 4482') : '+234 803 219 4482';
  const email = patient ? (patient.email || 'amaia.o@example.com') : 'amaia.o@example.com';
  const clinic = patient ? (patient.facility || patient.clinic || 'Lagos Central Clinic') : 'Lagos Central Clinic';
  const insurance = patient ? (patient.insurance || 'Private / Self-Pay') : 'Private / Self-Pay';
  const referral = patient ? (patient.referral || 'Specialist Referral') : 'Specialist Referral';
  const clinician = (patient && patient.assignedClinician) || 'Dr. Chika Okafor, Au.D.';
  const ptaR = patient ? Math.round(patient.ptaRight || 30) : 30;
  const ptaL = patient ? Math.round(patient.ptaLeft || 36) : 36;
  const diag = patient ? (patient.primaryDiagnosis || 'Bilateral Sensorineural Hearing Loss (ICD-10 H90.3)') : 'Bilateral Sensorineural Hearing Loss (ICD-10 H90.3)';

  // All assessments
  const allAssessments = (patient && patient.assessments) ? patient.assessments : [];
  const latestEnc = allAssessments[0] || null;
  const baselineEnc = allAssessments.length > 1 ? allAssessments[allAssessments.length - 1] : null;

  const now = new Date();
  const reportGenDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const dateRangeStr = baselineEnc ? `${baselineEnc.date} &ndash; ${latestEnc.date}` : (latestEnc ? latestEnc.date : reportGenDate);

  // ── 1. PATIENT / REPORT HEADER (Pillar 1) ──
  let headerHtml = `
    <div class="report-header-block" id="sec-header">
      <div>
        <div style="font-size:18px;font-weight:800;letter-spacing:-0.02em;color:#0891B2;">HearIntel Audiological Medical Center</div>
        <div style="font-size:11.5px;color:#64748B;margin-top:2px;">Specialist Hearing Healthcare &amp; Practice Management &middot; ${clinic}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:13.5px;font-weight:700;color:#0F172A;">
          ${currentReportType === 'full' ? 'LONGITUDINAL CLINICAL JOURNEY &amp; EMR REPORT' : 
            currentReportType === 'ent_referral' ? 'SPECIALIST ENT / MEDICAL REFERRAL SYNTHESIS' :
            currentReportType === 'audiology_battery' ? 'DIAGNOSTIC AUDIOLOGY BATTERY REPORT' :
            currentReportType === 'patient_summary' ? 'PATIENT &amp; FAMILY AURAL REHABILITATION SUMMARY' : 'HEARING HEALTH SCREENING REPORT'}
        </div>
        <div style="font-size:11px;color:#64748B;margin-top:2px;">Reporting Window: <strong>${dateRangeStr}</strong> &middot; Generated: ${reportGenDate}</div>
      </div>
    </div>

    <div class="report-meta-grid">
      <div><strong>Patient Full Name</strong><span>${fullName}</span></div>
      <div><strong>Patient MRN / ID</strong><span>${mrn}</span></div>
      <div><strong>Date of Birth / Age</strong><span>${dob} (${age} yrs)</span></div>
      <div><strong>Gender / Language</strong><span>${gender} &middot; ${patient ? patient.primaryLanguage : 'English'}</span></div>
      <div><strong>Phone &amp; Emergency</strong><span>${phone}</span></div>
      <div><strong>Insurance / Coverage</strong><span>${insurance}</span></div>
      <div><strong>Referring Source</strong><span>${referral}</span></div>
      <div><strong>Attending Audiologist</strong><span>${clinician} (MLSCN #HA-2024-0891)</span></div>
    </div>
  `;

  let bodyHtml = '';

  // ── 2. CLINICAL SUMMARY & LONGITUDINAL SYNTHESIS (Pillar 2) ──
  let summaryText = patient ? patient.clinicalNote : 'Patient has undergone standardized clinical audiological evaluation.';
  let alertsList = (patient && patient.alerts && patient.alerts.length > 0) ? patient.alerts : ['No critical clinical alerts noted.'];

  bodyHtml += `
    <div class="report-section" id="sec-summary">
      <div class="report-section-title">
        <span>1. Comprehensive Clinical Synthesis &amp; Case Summary</span>
        <span style="font-size:11px;font-weight:600;color:#0891B2;">EMR Narrative Record</span>
      </div>
      <div class="report-box" style="line-height:1.6;">
        <div style="font-size:12.5px;color:#0F172A;margin-bottom:8px;">${summaryText}</div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px;padding-top:8px;border-top:1px solid #E2E8F0;font-size:11.5px;">
          <div>
            <strong>Current Primary Diagnosis:</strong>
            <div style="color:#0891B2;font-weight:700;margin-top:1px;">${diag}</div>
          </div>
          <div>
            <strong>Current Management Status:</strong>
            <div style="font-weight:600;color:#059669;margin-top:1px;">${patient ? patient.pathwayLabel : 'Active Surveillance'} (${patient ? patient.status : 'Active'})</div>
          </div>
        </div>

        <div style="margin-top:8px;padding:6px 10px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:4px;font-size:11.5px;color:#92400E;">
          <strong>Active Clinical Alerts:</strong> ${alertsList.join(' &middot; ')}
        </div>
      </div>
    </div>
  `;

  // ── 3. ASSESSMENT TIMELINE (Pillar 3) ──
  if (allAssessments.length > 0) {
    let timelineRows = allAssessments.map(enc => `
      <tr>
        <td style="font-weight:700;white-space:nowrap;">${enc.date}</td>
        <td><strong>${enc.type}</strong></td>
        <td>${enc.clinician}</td>
        <td>${enc.reason || 'Diagnostic Assessment'}</td>
        <td><span class="report-ear-r">${Math.round(enc.ptaRight || 30)} dB</span> / <span class="report-ear-l">${Math.round(enc.ptaLeft || 36)} dB</span></td>
        <td><strong>${enc.diagnosis || 'SNHL'}</strong></td>
        <td><span style="font-size:10.5px;color:#059669;font-weight:600;">${enc.status || 'Completed'}</span></td>
      </tr>
    `).join('');

    bodyHtml += `
      <div class="report-section" id="sec-timeline">
        <div class="report-section-title">
          <span>2. Longitudinal Assessment Timeline (${allAssessments.length} Recorded Visits)</span>
          <span style="font-size:11px;font-weight:600;color:#64748B;">Chronological History</span>
        </div>
        <table class="report-table">
          <thead>
            <tr>
              <th>Date</th><th>Encounter Type</th><th>Clinician</th><th>Purpose / Reason</th><th>PTA (R/L)</th><th>Diagnostic Impression</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${timelineRows}
          </tbody>
        </table>
      </div>
    `;
  }

  // ── 4. DETAILED QUANTITATIVE MEASUREMENT RESULTS (Pillar 4) ──
  if (latestEnc) {
    const th = latestEnc.thresholds || {};
    const tymp = latestEnc.tympanometry || {};
    const speech = latestEnc.speech || {};
    const ephys = latestEnc.electrophysiology || {};

    const getVal = (track, f) => (th[track] && th[track][f] !== undefined && th[track][f] !== null) ? th[track][f] : '-';

    bodyHtml += `
      <div class="report-section" id="sec-results">
        <div class="report-section-title">
          <span>3. Detailed Quantitative Assessment Data (Encounter ${latestEnc.date})</span>
          <span style="font-size:11px;font-weight:600;color:#0891B2;">Objective Test Battery</span>
        </div>
        
        <!-- Threshold Table -->
        <table class="report-table">
          <thead>
            <tr>
              <th style="text-align:left;">Ear / Modality</th><th>250Hz</th><th>500Hz</th><th>1000Hz</th><th>2000Hz</th><th>3000Hz</th><th>4000Hz</th><th>6000Hz</th><th>8000Hz</th><th>4-Freq PTA</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align:left;" class="report-ear-r">Right AC (O)</td>
              <td>${getVal('acR', 250)}</td><td>${getVal('acR', 500)}</td><td>${getVal('acR', 1000)}</td><td>${getVal('acR', 2000)}</td><td>${getVal('acR', 3000)}</td><td>${getVal('acR', 4000)}</td><td>${getVal('acR', 6000)}</td><td>${getVal('acR', 8000)}</td>
              <td><strong class="report-ear-r">${Math.round(latestEnc.ptaRight || 30)} dB</strong></td>
            </tr>
            <tr>
              <td style="text-align:left;" class="report-ear-r">Right BC (&lt;)</td>
              <td>-</td><td>${getVal('bcR', 500)}</td><td>${getVal('bcR', 1000)}</td><td>${getVal('bcR', 2000)}</td><td>-</td><td>${getVal('bcR', 4000)}</td><td>-</td><td>-</td>
              <td><strong>-</strong></td>
            </tr>
            <tr>
              <td style="text-align:left;" class="report-ear-l">Left AC (X)</td>
              <td>${getVal('acL', 250)}</td><td>${getVal('acL', 500)}</td><td>${getVal('acL', 1000)}</td><td>${getVal('acL', 2000)}</td><td>${getVal('acL', 3000)}</td><td>${getVal('acL', 4000)}</td><td>${getVal('acL', 6000)}</td><td>${getVal('acL', 8000)}</td>
              <td><strong class="report-ear-l">${Math.round(latestEnc.ptaLeft || 36)} dB</strong></td>
            </tr>
            <tr>
              <td style="text-align:left;" class="report-ear-l">Left BC (&gt;)</td>
              <td>-</td><td>${getVal('bcL', 500)}</td><td>${getVal('bcL', 1000)}</td><td>${getVal('bcL', 2000)}</td><td>-</td><td>${getVal('bcL', 4000)}</td><td>-</td><td>-</td>
              <td><strong>-</strong></td>
            </tr>
          </tbody>
        </table>

        <!-- Immittance & Speech Split Grid -->
        <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:12px;margin-top:10px;">
          <!-- Immittance -->
          <div class="report-box">
            <strong style="color:#0891B2;display:block;margin-bottom:4px;font-size:11.5px;">Immittance &amp; Acoustic Reflex Battery</strong>
            <table class="report-table" style="margin:4px 0;">
              <thead>
                <tr><th>Ear</th><th>Type</th><th>Peak Pres</th><th>Comp</th><th>ECV</th><th>Reflex 1k</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td class="report-ear-r">AD</td>
                  <td><strong>${tymp.right ? tymp.right.type : 'Type A'}</strong></td>
                  <td>${tymp.right ? tymp.right.pres + ' daPa' : '-20 daPa'}</td>
                  <td>${tymp.right ? tymp.right.comp + ' mL' : '0.78 mL'}</td>
                  <td>${tymp.right ? tymp.right.ecv + ' mL' : '1.15 mL'}</td>
                  <td>${tymp.ipsi1kR || '85 dB'}</td>
                </tr>
                <tr>
                  <td class="report-ear-l">AS</td>
                  <td><strong>${tymp.left ? tymp.left.type : 'Type A'}</strong></td>
                  <td>${tymp.left ? tymp.left.pres + ' daPa' : '-30 daPa'}</td>
                  <td>${tymp.left ? tymp.left.comp + ' mL' : '0.72 mL'}</td>
                  <td>${tymp.left ? tymp.left.ecv + ' mL' : '1.08 mL'}</td>
                  <td>${tymp.ipsi1kL || '90 dB'}</td>
                </tr>
              </tbody>
            </table>
            <div style="font-size:11px;color:#64748B;margin-top:2px;">Decay: ${tymp.decayR || 'Negative bilaterally'}</div>
          </div>

          <!-- Speech -->
          <div class="report-box">
            <strong style="color:#0891B2;display:block;margin-bottom:4px;font-size:11.5px;">Speech Audiometry &amp; Noise Battery</strong>
            <div style="font-size:11.5px;line-height:1.6;">
              <div><strong>SRT:</strong> <span class="report-ear-r">${speech.right ? speech.right.srt : 30} dB AD</span> &middot; <span class="report-ear-l">${speech.left ? speech.left.srt : 35} dB AS</span></div>
              <div><strong>WRS:</strong> <span class="report-ear-r">${speech.right ? speech.right.wrs : 88}% AD</span> &middot; <span class="report-ear-l">${speech.left ? speech.left.wrs : 76}% AS</span></div>
              <div><strong>Rollover Index:</strong> ${speech.rollover || '0.05 (AD) / 0.11 (AS) — Normal'}</div>
              <div><strong>QuickSIN Loss:</strong> ${speech.quicksin || '+4.5 dB (Mild SNR loss in noise)'}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ── 5. VISUALIZATIONS & LONGITUDINAL AUDIOGRAM (Pillar 5) ──
  if (latestEnc) {
    const curTh = latestEnc.thresholds || {};
    const baseTh = baselineEnc ? (baselineEnc.thresholds || null) : null;
    const audiogramSvg = generateReportAudiogramSvg(curTh, baseTh);

    bodyHtml += `
      <div class="report-section" id="sec-audiogram">
        <div class="report-section-title">
          <span>4. Pure Tone Audiogram &amp; Longitudinal Comparison</span>
          <span style="font-size:11px;font-weight:600;color:#64748B;">ISO 8253-1 Standard Calibration</span>
        </div>
        <div style="display:flex;justify-content:center;margin:8px 0;">
          ${audiogramSvg}
        </div>
        <div style="font-size:11.5px;color:#64748B;text-align:center;margin-top:4px;">
          Solid lines indicate current evaluation (${latestEnc.date}); dashed overlays indicate baseline (${baselineEnc ? baselineEnc.date : 'N/A'}).
        </div>
      </div>
    `;
  }

  // ── 6. LONGITUDINAL CHANGE & DELTA ANALYSIS (Pillar 7) ──
  if (allAssessments.length > 1 && baselineEnc && latestEnc) {
    const bTh = baselineEnc.thresholds || {};
    const cTh = latestEnc.thresholds || {};

    const calcDelta = (ear, f) => {
      const b = bTh[ear] ? bTh[ear][f] : null;
      const c = cTh[ear] ? cTh[ear][f] : null;
      if (b !== null && c !== null && b !== undefined && c !== undefined) {
        const diff = c - b;
        if (diff > 0) return `<span style="color:#DC2626;font-weight:700;">+${diff} dB (Drop)</span>`;
        if (diff < 0) return `<span style="color:#16A34A;font-weight:700;">${diff} dB (Gain)</span>`;
        return `<span style="color:#64748B;">0 dB</span>`;
      }
      return '-';
    };

    const deltaPtaR = (latestEnc.ptaRight || 30) - (baselineEnc.ptaRight || 28.5);
    const deltaPtaL = (latestEnc.ptaLeft || 36) - (baselineEnc.ptaLeft || 33);
    const deltaWrsL = (latestEnc.speech && latestEnc.speech.left ? latestEnc.speech.left.wrs : 76) - (baselineEnc.speech && baselineEnc.speech.left ? baselineEnc.speech.left.wrs : 92);

    bodyHtml += `
      <div class="report-section" id="sec-longitudinal">
        <div class="report-section-title">
          <span>5. Longitudinal Progression &amp; Significant Threshold Shift (STS)</span>
          <span style="font-size:11px;font-weight:600;color:#DC2626;">Delta: ${baselineEnc.date} &rarr; ${latestEnc.date}</span>
        </div>
        
        <table class="report-table">
          <thead>
            <tr>
              <th style="text-align:left;">Ear / Track</th><th>500Hz</th><th>1000Hz</th><th>2000Hz</th><th>3000Hz</th><th>4000Hz</th><th>8000Hz</th><th>PTA Shift</th><th>STS Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align:left;" class="report-ear-r">Right Ear (AD)</td>
              <td>${calcDelta('acR', 500)}</td><td>${calcDelta('acR', 1000)}</td><td>${calcDelta('acR', 2000)}</td><td>${calcDelta('acR', 3000)}</td><td>${calcDelta('acR', 4000)}</td><td>${calcDelta('acR', 8000)}</td>
              <td><strong>+${deltaPtaR.toFixed(1)} dB</strong></td>
              <td><span style="font-size:10.5px;color:#16A34A;font-weight:600;">Negative (&lt;10 dB)</span></td>
            </tr>
            <tr>
              <td style="text-align:left;" class="report-ear-l">Left Ear (AS)</td>
              <td>${calcDelta('acL', 500)}</td><td>${calcDelta('acL', 1000)}</td><td>${calcDelta('acL', 2000)}</td><td>${calcDelta('acL', 3000)}</td><td>${calcDelta('acL', 4000)}</td><td>${calcDelta('acL', 8000)}</td>
              <td><strong>+${deltaPtaL.toFixed(1)} dB</strong></td>
              <td><span style="font-size:10.5px;color:#DC2626;font-weight:700;">Progressive High-Freq Drop</span></td>
            </tr>
          </tbody>
        </table>

        <div class="report-box" style="margin-top:8px;font-size:11.5px;">
          <div><strong>Speech Discrimination Shift:</strong> Left ear WRS decreased by <strong>${Math.abs(deltaWrsL)}%</strong> (from 92% to 76%), correlating with high-frequency cochlear dead region.</div>
          <div style="margin-top:2px;"><strong>Middle Ear Status Trend:</strong> Tympanometric compliance and peak pressures remain stable (Type A bilaterally).</div>
        </div>
      </div>
    `;
  }

  // ── 7. DIAGNOSES & CLINICAL FINDINGS HISTORY (Pillar 8) ──
  const diagHist = patient && patient.diagnosesHistory ? patient.diagnosesHistory : [
    { code: 'ICD-10 H90.3', title: 'Bilateral Sensorineural Hearing Loss', date: 'Initial Visit', status: 'Active', notes: 'Sloping configuration.' }
  ];

  let diagRows = diagHist.map(d => `
    <tr>
      <td style="font-weight:700;color:#0891B2;">${d.code}</td>
      <td style="font-weight:600;">${d.title}</td>
      <td>${d.date}</td>
      <td><span style="font-size:10.5px;font-weight:700;color:#0F172A;">${d.status}</span></td>
      <td style="font-size:11px;color:#64748B;">${d.notes}</td>
    </tr>
  `).join('');

  bodyHtml += `
    <div class="report-section" id="sec-diagnoses">
      <div class="report-section-title">
        <span>6. Diagnoses &amp; Otologic Findings History</span>
        <span style="font-size:11px;font-weight:600;color:#64748B;">ICD-10 Clinical Coding</span>
      </div>
      <table class="report-table">
        <thead>
          <tr><th>ICD-10 Code</th><th>Diagnosis / Condition</th><th>First Recorded</th><th>Current Status</th><th>Clinical Observations</th></tr>
        </thead>
        <tbody>
          ${diagRows}
        </tbody>
      </table>
    </div>
  `;

  // ── 8. THREE-TIER MANAGEMENT & CARE PLAN (Pillar 9) ──
  const carePlans = patient && patient.carePlan ? patient.carePlan : [];
  const devices = patient && patient.devices ? patient.devices : [];

  let cpRows = carePlans.map(cp => `
    <div style="padding:6px 0;border-bottom:1px solid #E2E8F0;display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <strong style="color:#0F172A;">${cp.title}</strong>
        <div style="font-size:11px;color:#64748B;margin-top:1px;">${cp.details}</div>
      </div>
      <div style="text-align:right;">
        <span style="font-size:10.5px;font-weight:700;color:#059669;">${cp.status}</span>
        <div style="font-size:10.5px;color:#64748B;">${cp.nextStep}</div>
      </div>
    </div>
  `).join('');

  let devRows = devices.map(d => `
    <tr>
      <td class="${d.ear.includes('Right') ? 'report-ear-r' : 'report-ear-l'}">${d.ear}</td>
      <td><strong>${d.brand} ${d.model}</strong></td>
      <td>${d.serial}</td>
      <td>${d.formula}</td>
      <td>${d.fittingDate}</td>
      <td>${d.warrantyExpiry}</td>
    </tr>
  `).join('');

  bodyHtml += `
    <div class="report-section" id="sec-careplan">
      <div class="report-section-title">
        <span>7. Comprehensive Management History &amp; Active Care Plan</span>
        <span style="font-size:11px;font-weight:600;color:#059669;">Care Pathway Active</span>
      </div>
      
      <!-- 3-Tier Management -->
      <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:10px;margin-bottom:12px;">
        <div class="report-box">
          <strong style="color:#64748B;font-size:10.5px;text-transform:uppercase;letter-spacing:0.04em;">1. What Has Been Done</strong>
          <div style="font-size:11.5px;margin-top:4px;">Bilateral diagnostic evaluation, REM NAL-NL2 acoustic verification, communication counseling.</div>
        </div>
        <div class="report-box">
          <strong style="color:#0891B2;font-size:10.5px;text-transform:uppercase;letter-spacing:0.04em;">2. Active Management</strong>
          <div style="font-size:11.5px;margin-top:4px;">Bilateral Oticon Real 1 miniRITE amplification; Aural rehabilitation session series (2/6 completed).</div>
        </div>
        <div class="report-box">
          <strong style="color:#DC2626;font-size:10.5px;text-transform:uppercase;letter-spacing:0.04em;">3. Outstanding Actions</strong>
          <div style="font-size:11.5px;margin-top:4px;">Scheduled 3-week verification recall (${patient ? patient.nextRecall : '26 Aug 2026'}); Speech in noise rehab module #3.</div>
        </div>
      </div>

      ${devices.length > 0 ? `
        <div style="margin-bottom:10px;">
          <strong style="font-size:11.5px;color:#0F172A;display:block;margin-bottom:4px;">Prescribed Hearing Technology Specifications:</strong>
          <table class="report-table">
            <thead>
              <tr><th>Ear</th><th>Device / Brand</th><th>Serial Number</th><th>Prescription Formula</th><th>Fitting Date</th><th>Warranty</th></tr>
            </thead>
            <tbody>${devRows}</tbody>
          </table>
        </div>
      ` : ''}

      <div class="report-box">
        <strong style="font-size:11.5px;color:#0F172A;display:block;margin-bottom:6px;">Active Care Plan Milestones:</strong>
        ${cpRows}
      </div>
    </div>
  `;

  // ── 9. MEDIA & DOCUMENTS GALLERY (Pillar 10) ──
  const mediaList = (patient && patient.media) ? patient.media : [];
  if (mediaList.length > 0) {
    let mediaItems = mediaList.map(m => `
      <div style="background:#F8FAFC;border:1px solid #CBD5E1;border-radius:4px;padding:6px 10px;font-size:11px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <strong style="color:#0F172A;">${m.name}</strong>
          <div style="color:#64748B;font-size:10px;">${m.type} &middot; ${m.date} (${m.size})</div>
        </div>
        <span style="font-size:9.5px;font-weight:700;background:#E2E8F0;padding:2px 6px;border-radius:3px;color:#334155;">${m.tag || 'Verified'}</span>
      </div>
    `).join('');

    bodyHtml += `
      <div class="report-section" id="sec-media">
        <div class="report-section-title">
          <span>8. Clinical Media &amp; Diagnostic Document Attachments</span>
          <span style="font-size:11px;font-weight:600;color:#64748B;">${mediaList.length} Attached Files</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          ${mediaItems}
        </div>
      </div>
    `;
  }

  // ── 10. STRUCTURED CLINICAL CONCLUSION & RECALL (Pillar 11) ──
  bodyHtml += `
    <div class="report-section" id="sec-conclusion" style="border-bottom:none;">
      <div class="report-section-title">
        <span>9. Clinical Conclusion &amp; Actionable Recommendations</span>
        <span style="font-size:11px;font-weight:600;color:#059669;">Validated Care Plan</span>
      </div>
      <div class="report-box" style="line-height:1.6;">
        <div style="font-size:12px;color:#0F172A;">
          <strong>Diagnostic Impression:</strong> ${diag}. Results indicate progressive high-frequency sensorineural deficit with preserved middle ear status and normal central auditory brainstem conduction.
        </div>
        <div style="font-size:12px;color:#0F172A;margin-top:4px;">
          <strong>Primary Management Directive:</strong> Continue full-time bilateral digital hearing aid usage. Emphasize directional microphone mode in crowded acoustic settings.
        </div>
        <div style="font-size:12px;color:#0F766E;font-weight:700;margin-top:6px;padding-top:6px;border-top:1px solid #E2E8F0;">
          Scheduled Clinical Recall: ${patient ? patient.nextRecall : '26 Aug 2026'} &mdash; ${patient ? patient.recallReason : '3-Week Real-Ear Verification'}
        </div>
      </div>
    </div>
  `;

  // ── 11. AUDIT METADATA & SIGN-OFF BLOCK (Pillar 12) ──
  let footerHtml = `
    <div class="report-signature-block" id="sec-signoff">
      <div>
        <div class="sig-line"></div>
        <div style="font-size:12px;font-weight:700;color:#0F172A;">${clinician}</div>
        <div style="font-size:11px;color:#64748B;">Lead Clinical Audiologist &middot; Reg #HA-2024-0891</div>
        <div style="font-size:10px;color:#94A3B8;margin-top:2px;">Digital Authentication: SHA-256: 8f4a9b2c01e3d778</div>
      </div>
      <div style="text-align:right;">
        <div class="sig-line"></div>
        <div style="font-size:12px;font-weight:700;color:#0F172A;">Electronic Clinical Verification</div>
        <div style="font-size:11px;color:#64748B;">HearIntel Practice Management Engine v3.4</div>
        <div style="font-size:10px;color:#94A3B8;margin-top:2px;">Page 1 of 1 &middot; Confidential Medical Record</div>
      </div>
    </div>
  `;

  paper.innerHTML = headerHtml + bodyHtml + footerHtml;
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
