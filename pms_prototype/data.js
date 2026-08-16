/**
 * HearIntel PMS — Shared Clinical Data Store & State Engine
 */
const HearIntelDB = (function() {
  const STORAGE_KEY = 'hearintel_pms_db_v4';

  const defaultData = {
    currentClinician: {
      name: 'Dr. Chika Okafor, Au.D.',
      facility: 'Lagos Central Hearing Clinic',
      room: 'Booth 1 (Sound Suite)'
    },
    patients: {
      'amaia': {
        id: 'amaia',
        mrn: 'LCC-26-01248',
        name: 'Amaia O.',
        dob: '1980-04-12',
        age: 46,
        gender: 'Female',
        phone: '+234 803 219 4482',
        email: 'amaia.o@example.com',
        facility: 'Lagos Central Clinic',
        primaryDiagnosis: 'Bilateral Sensorineural Hearing Loss, Mild-to-Moderate Sloping (ICD-10 H90.3)',
        ptaRight: 30.0,
        ptaLeft: 36.2,
        airBoneGap: '<10 dB (Sensorineural)',
        status: 'Active Care Plan',
        statusType: 'warning',
        lastEncounter: '20 May 2026',
        nextRecall: '26 Aug 2026',
        recallReason: '3-Week Hearing Aid Verification & Aural Rehab #3',
        pathway: 'ha',
        pathwayLabel: 'Hearing Aid (HA)',
        alerts: [
          'High-frequency discrimination drop in left ear (WRS 76%)',
          'Oticon Real 1 miniRITE 3-week REM verification due'
        ],
        assessments: [
          {
            id: 'enc-12',
            number: 12,
            date: '20 May 2026',
            type: 'Comprehensive Diagnostic Audiology',
            clinician: 'Dr. Chika Okafor, Au.D.',
            status: 'Completed',
            ptaRight: 30.0,
            ptaLeft: 36.2,
            diagnosis: 'Bilateral SNHL, Mild-to-Mod Sloping',
            thresholds: {
              acR: { 250: 20, 500: 25, 1000: 20, 2000: 30, 3000: 35, 4000: 45, 6000: 50, 8000: 55 },
              bcR: { 500: 25, 1000: 15, 2000: 30, 4000: 40 },
              acL: { 250: 25, 500: 30, 1000: 25, 2000: 40, 3000: 45, 4000: 50, 6000: 60, 8000: 65 },
              bcL: { 500: 30, 1000: 20, 2000: 35, 4000: 45 }
            },
            tympanometry: {
              right: { ecv: 1.15, comp: 0.78, pres: -20, grad: 85, type: 'Type A' },
              left: { ecv: 1.08, comp: 0.72, pres: -30, grad: 90, type: 'Type A' }
            },
            speech: {
              right: { srt: 30, wrs: 88, mcl: 65, ucl: 95 },
              left: { srt: 35, wrs: 76, mcl: 70, ucl: 95 }
            }
          },
          {
            id: 'enc-11',
            number: 11,
            date: '14 Feb 2026',
            type: 'Baseline Audiological Assessment',
            clinician: 'Amina Bello, Aud',
            status: 'Completed',
            ptaRight: 28.5,
            ptaLeft: 33.0,
            diagnosis: 'Bilateral Mild SNHL Baseline',
            thresholds: {
              acR: { 250: 20, 500: 20, 1000: 20, 2000: 30, 3000: 35, 4000: 40, 6000: 45, 8000: 50 },
              bcR: { 500: 20, 1000: 15, 2000: 25, 4000: 35 },
              acL: { 250: 20, 500: 25, 1000: 25, 2000: 35, 3000: 40, 4000: 45, 6000: 55, 8000: 60 },
              bcL: { 500: 25, 1000: 20, 2000: 30, 4000: 40 }
            }
          }
        ],
        carePlan: [
          {
            id: 'cp-1',
            title: 'Bilateral Hearing Aid Fitting & Verification',
            category: 'Hearing Aid (HA)',
            status: 'Active',
            badgeClass: 'warning',
            details: 'Oticon Real 1 miniRITE (SN: OT-26-R-99412 / OT-26-L-99413). REM NAL-NL2 verification completed.',
            nextStep: '3-Week verification recall on 26 Aug 2026'
          },
          {
            id: 'cp-2',
            title: 'Aural Rehabilitation — Speech in Noise',
            category: 'Rehabilitation',
            status: 'Active',
            badgeClass: 'teal',
            details: '6-week communication strategy series focusing on noise reduction and directional mic cues.',
            nextStep: 'Session #3 scheduled for 26 Aug 2026'
          }
        ],
        clinicalNote: 'Patient uses a wheelchair. Requires extra transfer time into sound-treated booth. Prefers auditory-visual cues and slower speech presentation during word recognition testing.',
        address: '4557 De Silva St, Victoria Island, Lagos, Nigeria',
        homePhone: '+234 1 289 4410',
        workPhone: '+234 802 334 9110',
        emergencyContact: 'Oluwaseun O. (Spouse) · +234 802 334 9110',
        primaryLanguage: 'English / Yoruba',
        insurance: 'AXA Mansard HMO (Gold Tier #AX-994218)',
        assignedClinician: 'Dr. Chika Okafor, Au.D.',
        devices: [
          { ear: 'Right (AD)', brand: 'Oticon', model: 'Real 1 miniRITE', serial: 'OT-26-R-99412', battery: '312 Li-ion Rechargeable', fittingDate: '20 May 2026', warrantyExpiry: '20 May 2028', formula: 'NAL-NL2', receiver: '85 dB / Medium Dome' },
          { ear: 'Left (AS)', brand: 'Oticon', model: 'Real 1 miniRITE', serial: 'OT-26-L-99413', battery: '312 Li-ion Rechargeable', fittingDate: '20 May 2026', warrantyExpiry: '20 May 2028', formula: 'NAL-NL2', receiver: '85 dB / Medium Dome' }
        ],
        appointments: [
          { id: 'apt-1', date: '26 Aug 2026', time: '10:00 - 10:45', reason: '3-Week Real-Ear Verification & Aural Rehab #3', specialist: 'Dr. Chika Okafor, Au.D.', status: 'Booked', outcome: 'Scheduled' },
          { id: 'apt-2', date: '20 May 2026', time: '11:00 - 12:30', reason: 'Comprehensive Diagnostic Audiology & Initial Fitting', specialist: 'Dr. Chika Okafor, Au.D.', status: 'Completed', outcome: 'Bilateral SNHL diagnosed; Oticon Real 1 fitted' },
          { id: 'apt-3', date: '14 Feb 2026', time: '09:00 - 10:00', reason: 'Baseline Audiological Assessment', specialist: 'Amina Bello, Aud', status: 'Completed', outcome: 'Baseline established; mild-to-mod loss confirmed' }
        ],
        media: [
          { id: 'm-1', name: 'AD_Otoscopy_20May2026.jpg', type: 'Otoscopy AD', date: '20 May 2026', size: '1.4 MB', tag: 'Right TM Intact' },
          { id: 'm-2', name: 'AS_Otoscopy_20May2026.jpg', type: 'Otoscopy AS', date: '20 May 2026', size: '1.3 MB', tag: 'Left TM Intact' },
          { id: 'm-3', name: 'Diagnostic_Report_Enc12.pdf', type: 'Report PDF', date: '20 May 2026', size: '420 KB', tag: 'Signed Summary' },
          { id: 'm-4', name: 'Tympanogram_Export.xml', type: 'Immittance', date: '20 May 2026', size: '48 KB', tag: 'Type A Bilateral' }
        ]
      },
      'david': {
        id: 'david',
        mrn: 'LCC-26-02891',
        name: 'David M.',
        dob: '1974-09-18',
        age: 52,
        gender: 'Male',
        phone: '+234 802 819 0021',
        email: 'david.m@example.com',
        facility: 'Lagos Central Clinic',
        primaryDiagnosis: 'Asymmetric Sensorineural Hearing Loss, Left Significant Drop (ICD-10 H90.4)',
        ptaRight: 25.0,
        ptaLeft: 55.0,
        airBoneGap: '<10 dB (Sensorineural)',
        status: 'Referral Advised',
        statusType: 'danger',
        lastEncounter: '18 May 2026',
        nextRecall: '22 May 2026',
        recallReason: 'Urgent Referral Consultation & MRI Internal Auditory Meatus',
        pathway: 'follow-up',
        pathwayLabel: 'Referral',
        alerts: [
          'Significant interaural threshold asymmetry (>30 dB at 2k–4k Hz)',
          'Requires urgent Referral clearance for retrocochlear rule-out'
        ],
        assessments: [
          {
            id: 'enc-david-1',
            number: 1,
            date: '18 May 2026',
            type: 'Diagnostic Audiology (Asymmetry Protocol)',
            clinician: 'Amina Bello, Aud',
            status: 'Completed',
            ptaRight: 25.0,
            ptaLeft: 55.0,
            diagnosis: 'Asymmetric SNHL Left',
            thresholds: {
              acR: { 250: 15, 500: 20, 1000: 25, 2000: 25, 3000: 30, 4000: 30, 6000: 35, 8000: 35 },
              bcR: { 500: 20, 1000: 20, 2000: 25, 4000: 30 },
              acL: { 250: 30, 500: 45, 1000: 55, 2000: 60, 3000: 65, 4000: 70, 6000: 75, 8000: 80 },
              bcL: { 500: 40, 1000: 50, 2000: 60, 4000: 65 }
            }
          }
        ],
        carePlan: [
          {
            id: 'cp-david-1',
            title: 'Otolaryngology / Neuro-otology Specialist Referral',
            category: 'Specialist Referral',
            status: 'Pending Review',
            badgeClass: 'danger',
            details: 'Urgent consult for unilateral sensorineural drop. MRI internal auditory meatus requested.',
            nextStep: 'Referral Clinic Appointment on 22 May 2026'
          }
        ],
        clinicalNote: 'Urgent asymmetric sensorineural hearing loss alert (>30 dB drop Left ear at 2k-4k Hz). Awaiting Neuro-otology consult and contrast MRI of IAC to rule out retrocochlear lesion.',
        address: '12 Adeola Odeku St, Victoria Island, Lagos, Nigeria',
        homePhone: '+234 1 450 1192',
        workPhone: '+234 802 819 0021',
        emergencyContact: 'Funke M. (Sister) · +234 803 771 9022',
        primaryLanguage: 'English',
        insurance: 'Hygeia HMO (Corporate #HYG-11029)',
        assignedClinician: 'Dr. Chika Okafor, Au.D.',
        devices: [],
        appointments: [
          { id: 'apt-d1', date: '22 May 2026', time: '14:00 - 15:00', reason: 'Urgent Referral Consultation & MRI Review', specialist: 'Dr. Chika Okafor, Au.D.', status: 'Booked', outcome: 'Pending Consultant Review' },
          { id: 'apt-d2', date: '18 May 2026', time: '10:00 - 11:15', reason: 'Diagnostic Audiology (Asymmetry Protocol)', specialist: 'Amina Bello, Aud', status: 'Completed', outcome: 'Significant Left asymmetric SNHL flagged' }
        ],
        media: [
          { id: 'm-d1', name: 'Asymmetry_Audiogram_18May.pdf', type: 'Report PDF', date: '18 May 2026', size: '380 KB', tag: 'Asymmetric Curve' }
        ]
      },
      'ndidi': {
        id: 'ndidi',
        mrn: 'LCC-26-06177',
        name: 'Ndidi A.',
        dob: '1965-11-03',
        age: 61,
        gender: 'Female',
        phone: '+234 814 901 8823',
        email: 'ndidi.a@example.com',
        facility: 'Lagos Central Clinic',
        primaryDiagnosis: 'Bilateral Severe-to-Profound Sensorineural Hearing Loss (ICD-10 H90.3)',
        ptaRight: 75.0,
        ptaLeft: 82.5,
        airBoneGap: '<10 dB (Sensorineural)',
        status: 'CI Protocol Active',
        statusType: 'warning',
        lastEncounter: '12 May 2026',
        nextRecall: '28 May 2026',
        recallReason: 'MDT Cochlear Implant Candidacy Sign-off Conference',
        pathway: 'ci',
        pathwayLabel: 'Cochlear Implant (CI)',
        alerts: [
          'Aided sentence score CNC < 35% bilaterally with power hearing aids',
          'MDT surgical candidacy sign-off in progress'
        ],
        assessments: [
          {
            id: 'enc-ndidi-1',
            number: 4,
            date: '12 May 2026',
            type: 'Cochlear Implant Candidacy Evaluation',
            clinician: 'Dr. Chika Okafor, Au.D.',
            status: 'Completed',
            ptaRight: 75.0,
            ptaLeft: 82.5,
            diagnosis: 'Severe-to-Profound SNHL Bilateral'
          }
        ],
        carePlan: [
          {
            id: 'cp-ndidi-1',
            title: 'Cochlear Implant Pre-Surgical Evaluation',
            category: 'Cochlear Implant (CI)',
            status: 'Active',
            badgeClass: 'warning',
            details: 'LUTH Referral surgical team review. High-resolution CT petrous bone complete.',
            nextStep: 'MDT Decision Conference on 28 May 2026'
          }
        ],
        media: []
      },
      'emeka': {
        id: 'emeka',
        mrn: 'LCC-26-05320',
        name: 'Emeka O.',
        dob: '1987-02-24',
        age: 39,
        gender: 'Male',
        phone: '+234 809 112 3901',
        email: 'emeka.o@example.com',
        facility: 'Lagos Central Clinic',
        primaryDiagnosis: 'Bilateral Moderate Conductive Hearing Loss (ICD-10 H90.0)',
        ptaRight: 40.0,
        ptaLeft: 42.5,
        airBoneGap: '25 dB (Conductive)',
        status: 'Ready for Fitting',
        statusType: 'success',
        lastEncounter: '05 May 2026',
        nextRecall: '20 May 2026',
        recallReason: 'Bone Conduction / Conventional Device Fitting',
        pathway: 'ha',
        pathwayLabel: 'Hearing Aid (HA)',
        alerts: [
          'Significant air-bone gap (25 dB) with normal bone conduction thresholds'
        ],
        assessments: [],
        carePlan: [
          {
            id: 'cp-emeka-1',
            title: 'Conventional Amplification Device Trial',
            category: 'Hearing Aid (HA)',
            status: 'Active',
            badgeClass: 'success',
            details: 'Trial fitting for conductive loss while monitoring middle ear status.',
            nextStep: 'Fitting session on 20 May 2026'
          }
        ],
        media: []
      },
      'sarah': {
        id: 'sarah',
        mrn: 'LCC-26-04102',
        name: 'Sarah T.',
        dob: '1998-07-15',
        age: 28,
        gender: 'Female',
        phone: '+234 818 440 9102',
        email: 'sarah.t@example.com',
        facility: 'Lagos Central Clinic',
        primaryDiagnosis: 'Bilateral Mild Sensorineural Hearing Loss (ICD-10 H90.3)',
        ptaRight: 25.0,
        ptaLeft: 27.5,
        airBoneGap: '<10 dB (Sensorineural)',
        status: 'Consent Verified',
        statusType: 'teal',
        lastEncounter: '10 May 2026',
        nextRecall: '10 Nov 2026',
        recallReason: '6-Month Annual Threshold Surveillance',
        pathway: 'aural-rehab',
        pathwayLabel: 'Aural Rehab',
        alerts: [],
        assessments: [],
        carePlan: [
          {
            id: 'cp-sarah-1',
            title: 'Preventative Hearing Health & Surveillance',
            category: 'Surveillance',
            status: 'Active',
            badgeClass: 'teal',
            details: 'Hearing protection counseling for occupational noise exposure.',
            nextStep: '6-Month recall on 10 Nov 2026'
          }
        ],
        media: []
      },
      'fatima': {
        id: 'fatima',
        mrn: 'LCC-26-0007819',
        name: 'Fatima B.',
        dob: '2021-06-10',
        age: 5,
        gender: 'Female',
        phone: '+234 803 771 9002 (Guardian)',
        email: 'fatima.guardian@example.com',
        facility: 'Lagos Central Clinic',
        primaryDiagnosis: 'Otitis Media with Effusion / Conductive Loss (ICD-10 H65.0)',
        ptaRight: 35.0,
        ptaLeft: 38.0,
        airBoneGap: '20 dB (Conductive)',
        status: 'Pediatric Recall Due',
        statusType: 'warning',
        lastEncounter: '02 May 2026',
        nextRecall: '23 May 2026',
        recallReason: '3-Week Tympanometry Recheck post-referral medical therapy',
        pathway: 'follow-up',
        pathwayLabel: 'Follow-up Only',
        alerts: ['Type B flat tympanograms bilaterally'],
        assessments: [],
        carePlan: [
          {
            id: 'cp-fatima-1',
            title: 'Pediatric Middle Ear Effusion Monitoring',
            category: 'Follow-up Only',
            status: 'Active',
            badgeClass: 'warning',
            details: 'Following 3-week course of nasal steroids and otological surveillance.',
            nextStep: 'Tympanometry recheck on 23 May 2026'
          }
        ],
        media: []
      }
    }
  };

  function loadDB() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('HearIntel: localStorage read failed, falling back to default', e);
    }
    return JSON.parse(JSON.stringify(defaultData));
  }

  function saveDB(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('HearIntel: localStorage write failed', e);
    }
  }

  let db = loadDB();

  return {
    getPatient(id) {
      if (!id || !db.patients[id]) return db.patients['amaia'];
      return db.patients[id];
    },
    getAllPatients() {
      return Object.values(db.patients);
    },
    savePatient(patient) {
      db.patients[patient.id] = patient;
      saveDB(db);
    },
    createPatient(data) {
      const id = data.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '_' + Math.floor(Math.random() * 1000);
      const newPatient = {
        id: id,
        mrn: data.mrn || 'LCC-26-' + Math.floor(1000000 + Math.random() * 9000000),
        nationalId: data.nationalId || '-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000),
        name: data.name,
        dob: data.dob || '1990-01-01',
        age: parseInt(data.age, 10) || 35,
        gender: data.gender || 'Other',
        phone: data.phone || '+234 800 000 0000',
        email: data.email || 'patient@example.com',
        facility: data.facility || 'Lagos Central Clinic',
        primaryDiagnosis: data.primaryDiagnosis || 'Pending Assessment',
        ptaRight: 20.0,
        ptaLeft: 20.0,
        airBoneGap: '<10 dB',
        status: 'New Intake',
        statusType: 'teal',
        lastEncounter: 'Today',
        nextRecall: 'Pending',
        recallReason: 'Initial comprehensive assessment',
        pathway: 'follow-up',
        pathwayLabel: 'Follow-up',
        alerts: ['New patient intake entry'],
        assessments: [],
        carePlan: [],
        media: []
      };
      db.patients[id] = newPatient;
      saveDB(db);
      return newPatient;
    },
    saveThresholds(patientId, thresholds) {
      const patient = this.getPatient(patientId);
      if (!patient.assessments || patient.assessments.length === 0) {
        patient.assessments = [{
          id: 'enc-' + Date.now(),
          number: 1,
          date: 'Today',
          type: 'Diagnostic Audiology',
          clinician: db.currentClinician.name,
          status: 'Draft',
          thresholds: thresholds
        }];
      } else {
        patient.assessments[0].thresholds = thresholds;
      }
      
      if (thresholds.acR) {
        const rVals = [thresholds.acR[500], thresholds.acR[1000], thresholds.acR[2000], thresholds.acR[4000]].filter(v => v !== undefined && v !== null && v !== '');
        if (rVals.length > 0) {
          patient.ptaRight = parseFloat((rVals.reduce((a, b) => a + Number(b), 0) / rVals.length).toFixed(1));
        }
      }
      if (thresholds.acL) {
        const lVals = [thresholds.acL[500], thresholds.acL[1000], thresholds.acL[2000], thresholds.acL[4000]].filter(v => v !== undefined && v !== null && v !== '');
        if (lVals.length > 0) {
          patient.ptaLeft = parseFloat((lVals.reduce((a, b) => a + Number(b), 0) / lVals.length).toFixed(1));
        }
      }
      this.savePatient(patient);
      return patient;
    },
    completeAssessment(patientId, assessmentData) {
      const patient = this.getPatient(patientId);
      patient.primaryDiagnosis = assessmentData.diagnosis || patient.primaryDiagnosis;
      patient.nextRecall = assessmentData.recallDate || patient.nextRecall;
      patient.recallReason = assessmentData.recallReason || patient.recallReason;
      patient.pathway = assessmentData.pathway || patient.pathway;
      patient.status = 'Care Plan Active';
      patient.statusType = 'success';
      patient.lastEncounter = 'Today';

      if (!patient.assessments) patient.assessments = [];
      patient.assessments.unshift({
        id: 'enc-' + Date.now(),
        number: patient.assessments.length + 1,
        date: 'Today',
        type: 'Diagnostic Assessment & Management',
        clinician: db.currentClinician.name,
        status: 'Completed',
        ptaRight: patient.ptaRight,
        ptaLeft: patient.ptaLeft,
        diagnosis: patient.primaryDiagnosis
      });

      if (!patient.carePlan) patient.carePlan = [];
      patient.carePlan.unshift({
        id: 'cp-' + Date.now(),
        title: assessmentData.pathwayTitle || 'Clinical Management Pathway',
        category: assessmentData.pathwayCategory || 'Management',
        status: 'Active',
        badgeClass: 'success',
        details: assessmentData.notes || 'Assessment conclusion documented.',
        nextStep: 'Scheduled Recall on ' + patient.nextRecall
      });

      this.savePatient(patient);
      return patient;
    },
    addCarePlanItem(patientId, item) {
      const patient = this.getPatient(patientId);
      if (!patient.carePlan) patient.carePlan = [];
      patient.carePlan.unshift({
        id: 'cp-' + Date.now(),
        title: item.title,
        category: item.category || 'Management',
        status: item.status || 'Active',
        badgeClass: item.badgeClass || 'teal',
        details: item.details,
        nextStep: item.nextStep || 'Follow-up scheduled'
      });
      this.savePatient(patient);
      return patient;
    },
    addMedia(patientId, mediaItem) {
      return this.saveSlotMedia(patientId, mediaItem.type || 'Attachment', mediaItem);
    },
    saveSlotMedia(patientId, slotType, mediaItem) {
      const patient = this.getPatient(patientId);
      if (!patient.media) patient.media = [];
      
      // Look for existing item with identical slotType to replace in-place (1 upload per slot policy)
      const existingIdx = patient.media.findIndex(m => m.type === slotType);
      const newMediaObj = {
        id: existingIdx >= 0 ? patient.media[existingIdx].id : ('m-' + Date.now()),
        name: mediaItem.name,
        type: slotType,
        date: 'Today',
        size: mediaItem.size || '1.2 MB',
        tag: mediaItem.tag || 'Clinical Record',
        dataUrl: mediaItem.dataUrl || null
      };

      if (existingIdx >= 0) {
        patient.media[existingIdx] = newMediaObj;
      } else {
        patient.media.unshift(newMediaObj);
      }

      this.savePatient(patient);
      return patient;
    },
    saveScreeningRecord(patientId, record) {
      const patient = this.getPatient(patientId);
      if (!patient) return null;
      if (!patient.assessments) patient.assessments = [];

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      const todayIdx = patient.assessments.findIndex(a => a.type && a.type.startsWith('Hearing Screening') && a.date === dateStr);
      const screeningEntry = {
        id: todayIdx >= 0 ? patient.assessments[todayIdx].id : ('scr-' + Date.now()),
        number: todayIdx >= 0 ? patient.assessments[todayIdx].number : (patient.assessments.length + 1),
        date: dateStr,
        type: 'Hearing Screening — ' + (record.protocol || 'Adult Protocol'),
        clinician: (db && db.currentClinician) ? db.currentClinician.name : 'Clinician',
        status: record.outcome === 'pass' ? 'Passed' : 'Refer for Diagnostic Assessment',
        outcome: record.outcome,
        protocol: record.protocol || 'adult',
        hhieScore: record.hhieScore || 0,
        hhieMax: record.hhieMax || 40,
        sweepResults: record.sweepResults || {},
        stsFlag: record.stsFlag || false,
        diagnosis: record.outcome === 'pass'
          ? 'Hearing Screening: PASS'
          : 'Hearing Screening: REFER — Diagnostic Assessment Required'
      };

      if (todayIdx >= 0) {
        patient.assessments[todayIdx] = screeningEntry;
      } else {
        patient.assessments.unshift(screeningEntry);
      }

      this.savePatient(patient);
      return screeningEntry;
    },
    saveClinicalNote(patientId, note) {
      const patient = this.getPatient(patientId);
      if (!patient) return null;
      patient.clinicalNote = note;
      this.savePatient(patient);
      return patient;
    },
    resetToDefault() {
      db = JSON.parse(JSON.stringify(defaultData));
      saveDB(db);
    }
  };
})();

if (typeof window !== 'undefined') {
  window.HearIntelDB = HearIntelDB;
}
