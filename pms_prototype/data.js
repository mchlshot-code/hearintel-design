/**
 * HearIntel PMS — Shared Clinical Data Store & State Engine
 * Multi-Encounter Longitudinal EMR Dataset (3 Verified Patient Records)
 */
const HearIntelDB = (function() {
  const STORAGE_KEY = 'hearintel_pms_db_v8_clean';

  const defaultData = {
    currentClinician: {
      name: 'Dr. Chika Okafor, Au.D.',
      facility: 'Lagos Central Hearing Clinic',
      room: 'Booth 1 (Sound Suite)',
      license: 'MLSCN-AUD-2024-0891'
    },
    patients: {
      'amaia': {
        id: 'amaia',
        mrn: 'LCC-26-01248',
        name: 'Amaia O.',
        fullName: 'Amaia Okafor',
        dob: '1980-04-12',
        age: 46,
        gender: 'Female',
        phone: '+234 803 219 4482',
        homePhone: '+234 1 289 4410',
        workPhone: '+234 802 334 9110',
        email: 'amaia.o@example.com',
        address: '4557 De Silva St, Victoria Island, Lagos, Nigeria',
        emergencyContact: 'Oluwaseun O. (Spouse) · +234 802 334 9110',
        primaryLanguage: 'English / Yoruba',
        insurance: 'AXA Mansard HMO (Gold Tier #AX-994218)',
        assignedClinician: 'Dr. Chika Okafor, Au.D.',
        facility: 'Lagos Central Clinic',
        referral: 'Dr. T. Adeleke, ENT Consultant (Lagos Island General)',
        primaryDiagnosis: 'Bilateral Sensorineural Hearing Loss, Mild-to-Moderate Sloping (ICD-10 H90.3)',
        ptaRight: 30.0,
        ptaLeft: 36.2,
        airBoneGap: '<10 dB (Pure Sensorineural)',
        status: 'Active Care Plan',
        statusType: 'warning',
        lastEncounter: '20 May 2026',
        nextRecall: '26 Aug 2026',
        recallReason: '3-Week Hearing Aid REM Verification & Aural Rehab #3',
        pathway: 'ha',
        pathwayLabel: 'Hearing Aid Amplification (HA)',
        alerts: [
          'High-frequency discrimination drop in left ear (WRS 76%)',
          'Oticon Real 1 miniRITE 3-week REM verification due',
          'Wheelchair user — requires extra transfer time into sound booth'
        ],
        clinicalNote: 'Patient presents with a 3-year history of bilateral progressive hearing difficulty, most prominent in background noise. Baseline evaluation conducted Feb 2026 demonstrated mild sloping loss; May 2026 follow-up revealed progressive high-frequency threshold decline and asymmetric word recognition breakdown in left ear. Bilateral Oticon Real 1 miniRITE devices fitted on 20 May 2026 with NAL-NL2 verification.',
        diagnosesHistory: [
          { code: 'ICD-10 H90.3', title: 'Bilateral Sensorineural Hearing Loss', date: '14 Feb 2026', status: 'Active / Progressing', notes: 'Sloping high-frequency loss bilaterally.' },
          { code: 'ICD-10 H93.13', title: 'Bilateral Tinnitus', date: '14 Feb 2026', status: 'Active (Stable)', notes: '4000 Hz pure tone sensation, THI score 28/100 (Grade 2).' },
          { code: 'ICD-10 H93.25', title: 'Impaired Auditory Discrimination', date: '20 May 2026', status: 'New Finding', notes: 'Left ear WRS dropped from 92% (Feb) to 76% (May).' }
        ],
        assessments: [
          {
            id: 'enc-12',
            number: 12,
            date: '20 May 2026',
            type: 'Diagnostic Battery + Hearing Aid Fitting',
            clinician: 'Dr. Chika Okafor, Au.D.',
            facility: 'Lagos Central Hearing Clinic',
            timeframe: 'latest',
            ptaRight: 30.0,
            ptaLeft: 36.2,
            rightThresholds: { '250': 20, '500': 25, '1000': 30, '2000': 35, '4000': 45, '8000': 55 },
            leftThresholds: { '250': 25, '500': 30, '1000': 35, '2000': 40, '4000': 55, '8000': 65 },
            rightBcThresholds: { '500': 20, '1000': 25, '2000': 30, '4000': 40 },
            leftBcThresholds: { '500': 25, '1000': 30, '2000': 35, '4000': 50 },
            otoscopy: { right: 'Intact TM, clear canal, cone of light visible', left: 'Intact TM, translucent, slight scarring postero-inferior' },
            tymp: { right: 'Type A (Compliance 0.65 cm3, Peak -15 daPa)', left: 'Type A (Compliance 0.58 cm3, Peak -22 daPa)' },
            speech: { srtRight: 25, srtLeft: 30, wrsRight: '88% @ 65 dB HL', wrsLeft: '76% @ 70 dB HL' },
            tinnitus: { present: true, rightPitch: '4000 Hz', leftPitch: '4000 Hz', thiScore: '28 / 100 (Grade 2)' },
            recommendations: 'Continue binaural amplification with Oticon Real 1. Perform 3-week REM verification and speech-in-noise follow-up.'
          },
          {
            id: 'enc-08',
            number: 8,
            date: '14 Feb 2026',
            type: 'Initial Comprehensive Audiological Evaluation',
            clinician: 'Dr. Chika Okafor, Au.D.',
            facility: 'Lagos Central Hearing Clinic',
            timeframe: '6m',
            ptaRight: 23.3,
            ptaLeft: 26.7,
            rightThresholds: { '250': 15, '500': 20, '1000': 25, '2000': 25, '4000': 35, '8000': 45 },
            leftThresholds: { '250': 15, '500': 20, '1000': 25, '2000': 35, '4000': 40, '8000': 50 },
            rightBcThresholds: { '500': 15, '1000': 20, '2000': 20, '4000': 30 },
            leftBcThresholds: { '500': 15, '1000': 20, '2000': 30, '4000': 35 },
            otoscopy: { right: 'Normal, clear canal', left: 'Normal, clear canal' },
            tymp: { right: 'Type A', left: 'Type A' },
            speech: { srtRight: 20, srtLeft: 20, wrsRight: '96% @ 60 dB HL', wrsLeft: '92% @ 60 dB HL' },
            tinnitus: { present: true, rightPitch: '4000 Hz', leftPitch: '4000 Hz', thiScore: '24 / 100' },
            recommendations: 'Initial baseline audiology evaluation. Recommended trial of binaural RIC hearing aids.'
          }
        ],
        carePlan: [
          {
            id: 'cp-1',
            title: 'Bilateral Hearing Aid Fitting & Real-Ear Verification',
            category: 'Amplification',
            status: 'In Progress',
            badgeClass: 'warning',
            details: 'Oticon Real 1 miniRITE binaural fitting completed 20 May 2026. Target gain verified within 3 dB across 250-4000 Hz. 3-Week REM fine-tuning booked.',
            nextStep: '3-Week REM review on 26 Aug 2026',
            clinician: 'Dr. Chika Okafor, Au.D.'
          },
          {
            id: 'cp-2',
            title: 'Aural Rehabilitation & Communication Strategy Program',
            category: 'Rehabilitation',
            status: 'Active',
            badgeClass: 'accent',
            details: '5-Session auditory training protocol focusing on speech recognition in background noise and directional listening.',
            nextStep: 'Session #3 scheduled for 26 Aug 2026',
            clinician: 'Dr. Chika Okafor, Au.D.'
          }
        ],
        devices: [
          {
            id: 'dev-1',
            side: 'Bilateral',
            makeModel: 'Oticon Real 1 miniRITE R (Lithium-ion)',
            serialRight: 'OT-2026-R8912',
            serialLeft: 'OT-2026-L8913',
            fittingDate: '20 May 2026',
            warranty: '20 May 2029 (3 Years Full)',
            status: 'Active / Paired',
            lastRemDate: '20 May 2026 (NAL-NL2 Verified)'
          }
        ],
        appointments: [
          { id: 'apt-1', date: '26 Aug 2026', time: '10:00 - 11:00', reason: '3-Week Hearing Aid REM Verification & Aural Rehab #3', specialist: 'Dr. Chika Okafor, Au.D.', status: 'Confirmed', outcome: 'Scheduled' },
          { id: 'apt-2', date: '20 May 2026', time: '09:00 - 11:30', reason: 'Diagnostic Battery + Hearing Aid Fitting', specialist: 'Dr. Chika Okafor, Au.D.', status: 'Completed', outcome: 'Fitted & NAL-NL2 Verified' },
          { id: 'apt-3', date: '14 Feb 2026', time: '14:00 - 15:30', reason: 'Initial Audiological Evaluation', specialist: 'Dr. Chika Okafor, Au.D.', status: 'Completed', outcome: 'SNHL Diagnosed, HA Trial Recommended' }
        ],
        media: [
          { id: 'm-1', name: 'Otoscopy_Right_TM_20May2026.jpg', type: 'Otoscopy', date: '20 May 2026', size: '2.4 MB', tag: 'Clear TM' },
          { id: 'm-2', name: 'Otoscopy_Left_TM_20May2026.jpg', type: 'Otoscopy', date: '20 May 2026', size: '2.1 MB', tag: 'Minor Scarring' },
          { id: 'm-3', name: 'Tympanogram_HighRes_20May2026.xml', type: 'Immittance', date: '20 May 2026', size: '48 KB', tag: 'Type A Bilateral' },
          { id: 'm-4', name: 'ENT_Referral_Letter_DrAdeleke.pdf', type: 'Document', date: '10 Jan 2026', size: '340 KB', tag: 'Referral Letter' }
        ]
      },
      'david': {
        id: 'david',
        mrn: 'LCC-26-00981',
        name: 'David M.',
        fullName: 'David Mensah',
        dob: '1968-09-24',
        age: 58,
        gender: 'Male',
        phone: '+234 802 884 1290',
        homePhone: '+234 1 492 8811',
        workPhone: '+234 803 771 9022',
        email: 'david.m@example.com',
        address: '12 Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
        emergencyContact: 'Grace M. (Wife) · +234 802 884 1291',
        primaryLanguage: 'English',
        insurance: 'Leadway Health HMO (Platinum #LW-4019)',
        assignedClinician: 'Dr. Chika Okafor, Au.D.',
        facility: 'Lagos Central Clinic',
        referral: 'Self-referred (Occupational noise exposure history)',
        primaryDiagnosis: 'Moderate Symmetrical High-Frequency SNHL (ICD-10 H90.3)',
        ptaRight: 42.5,
        ptaLeft: 45.0,
        airBoneGap: '<5 dB (Pure Sensorineural)',
        status: 'Active Care Plan',
        statusType: 'success',
        lastEncounter: '18 Apr 2026',
        nextRecall: '18 Oct 2026',
        recallReason: '6-Month Device Check & Real-Ear Verification Recheck',
        pathway: 'ha',
        pathwayLabel: 'Hearing Aid Amplification (HA)',
        alerts: [
          'Chronic high-pitch tinnitus in right ear (THI Score 42/100)',
          'Requires custom molds due to narrow tortuous ear canals'
        ],
        clinicalNote: 'Industrial engineer with 25-year history of occupational machinery noise exposure. Demonstrates classic symmetrical noise-induced 4000 Hz notch bilaterally progressing to moderate high-frequency SNHL. Fitted with Phonak Lumity L90-R with custom cShells. Excellent compliance and satisfaction.',
        diagnosesHistory: [
          { code: 'ICD-10 H90.3', title: 'Noise-Induced Sensorineural Hearing Loss', date: '18 Oct 2025', status: 'Active / Stable', notes: '4 kHz notch bilaterally, high-frequency slope.' },
          { code: 'ICD-10 H93.11', title: 'Right Ear Subjective Tinnitus', date: '18 Oct 2025', status: 'Active (Sound Therapy Managed)', notes: '6000 Hz narrow band sensation.' }
        ],
        assessments: [
          {
            id: 'enc-d1',
            number: 1,
            date: '18 Apr 2026',
            type: 'Diagnostic Battery & Real-Ear Verification',
            clinician: 'Dr. Chika Okafor, Au.D.',
            facility: 'Lagos Central Hearing Clinic',
            timeframe: 'latest',
            ptaRight: 42.5,
            ptaLeft: 45.0,
            rightThresholds: { '250': 20, '500': 25, '1000': 35, '2000': 45, '4000': 65, '8000': 70 },
            leftThresholds: { '250': 20, '500': 30, '1000': 35, '2000': 50, '4000': 70, '8000': 75 },
            rightBcThresholds: { '500': 25, '1000': 35, '2000': 45, '4000': 60 },
            leftBcThresholds: { '500': 30, '1000': 35, '2000': 50, '4000': 65 },
            otoscopy: { right: 'Narrow tortuous canal, healthy TM', left: 'Narrow canal, intact TM' },
            tymp: { right: 'Type A (Compliance 0.52 cm3, Peak -10 daPa)', left: 'Type A (Compliance 0.48 cm3, Peak -15 daPa)' },
            speech: { srtRight: 35, srtLeft: 35, wrsRight: '84% @ 70 dB HL', wrsLeft: '80% @ 75 dB HL' },
            tinnitus: { present: true, rightPitch: '6000 Hz', leftPitch: 'N/A', thiScore: '42 / 100 (Grade 3)' },
            recommendations: 'Custom Phonak cShells verified. Continue sound masking therapy for right tinnitus.'
          }
        ],
        carePlan: [
          {
            id: 'cp-d1',
            title: 'Tinnitus Management & Sound Generator Protocol',
            category: 'Tinnitus Therapy',
            status: 'Active',
            badgeClass: 'success',
            details: 'Fractal sound therapy integrated into hearing aid program #2. Significant reduction in reported annoyance.',
            nextStep: '6-Month follow-up on 18 Oct 2026',
            clinician: 'Dr. Chika Okafor, Au.D.'
          }
        ],
        devices: [
          {
            id: 'dev-d1',
            side: 'Bilateral',
            makeModel: 'Phonak Audeo Lumity L90-R (Custom cShell)',
            serialRight: 'PH-26-R1098',
            serialLeft: 'PH-26-L1099',
            fittingDate: '18 Apr 2026',
            warranty: '18 Apr 2029 (3 Years Full)',
            status: 'Active / Calibrated',
            lastRemDate: '18 Apr 2026 (NAL-NL2 Verified)'
          }
        ],
        appointments: [
          { id: 'apt-d1', date: '18 Oct 2026', time: '14:00 - 15:00', reason: '6-Month Device Check & Tinnitus Review', specialist: 'Dr. Chika Okafor, Au.D.', status: 'Booked', outcome: 'Scheduled' }
        ],
        media: [
          { id: 'm-d1', name: 'Otoscopy_Right_NarrowCanal.jpg', type: 'Otoscopy', date: '18 Apr 2026', size: '1.9 MB', tag: 'Narrow Canal' }
        ]
      },
      'emeka': {
        id: 'emeka',
        mrn: 'LCC-26-02104',
        name: 'Emeka E.',
        fullName: 'Emeka Eze',
        dob: '2019-06-15',
        age: 7,
        gender: 'Male',
        phone: '+234 818 990 4421',
        homePhone: '+234 1 890 2210',
        workPhone: '--',
        email: 'chinyere.eze@example.com',
        address: '8 Bishop Kale Close, Surulere, Lagos, Nigeria',
        emergencyContact: 'Chinyere E. (Mother) · +234 818 990 4421',
        primaryLanguage: 'English / Igbo',
        insurance: 'Hygeia HMO (Family Plan #HY-11849)',
        assignedClinician: 'Dr. Chika Okafor, Au.D.',
        facility: 'Lagos Central Clinic',
        referral: 'Surulere Primary School Hearing Screening (Failed Screen)',
        primaryDiagnosis: 'Bilateral Conductive Hearing Loss secondary to Chronic Otitis Media with Effusion (ICD-10 H65.2)',
        ptaRight: 35.0,
        ptaLeft: 38.3,
        airBoneGap: '25-30 dB (Significant Conductive Component)',
        status: 'ENT Referral / Medical Monitoring',
        statusType: 'danger',
        lastEncounter: '10 May 2026',
        nextRecall: '23 May 2026',
        recallReason: 'Post-Medical Therapy Tympanometry & PTA Recheck',
        pathway: 'referral',
        pathwayLabel: 'ENT Medical Referral',
        alerts: [
          'SAFETY ALERT: Bilateral Type B flat tympanograms with absent acoustic reflexes',
          'Urgent ENT surgical consult scheduled for grommet ventilation tube placement'
        ],
        clinicalNote: '7-year-old male referred following school hearing screening failure. Otoscopy reveals dull, retracted tympanic membranes with amber fluid levels bilaterally. Pure tone testing demonstrates a 25-30 dB conductive air-bone gap. Tympanometry confirms bilateral Type B flat tracings with normal canal volume. Referred to ENT for medical and surgical management.',
        diagnosesHistory: [
          { code: 'ICD-10 H65.2', title: 'Chronic Serous Otitis Media', date: '10 May 2026', status: 'Active / Severe', notes: 'Bilateral middle ear effusion.' },
          { code: 'ICD-10 H90.0', title: 'Conductive Hearing Loss, Bilateral', date: '10 May 2026', status: 'Active', notes: 'Significant 25-30 dB air-bone gap.' }
        ],
        assessments: [
          {
            id: 'enc-e1',
            number: 1,
            date: '10 May 2026',
            type: 'Pediatric Audiometry & Diagnostic Immittance Battery',
            clinician: 'Dr. Chika Okafor, Au.D.',
            facility: 'Lagos Central Hearing Clinic',
            timeframe: 'latest',
            ptaRight: 35.0,
            ptaLeft: 38.3,
            rightThresholds: { '250': 40, '500': 40, '1000': 35, '2000': 30, '4000': 30, '8000': 35 },
            leftThresholds: { '250': 45, '500': 45, '1000': 40, '2000': 35, '4000': 35, '8000': 40 },
            rightBcThresholds: { '500': 10, '1000': 10, '2000': 10, '4000': 10 },
            leftBcThresholds: { '500': 10, '1000': 10, '2000': 10, '4000': 10 },
            otoscopy: { right: 'Amber effusion, dull TM, no cone of light', left: 'Fluid level visible, retracted TM' },
            tymp: { right: 'Type B Flat (ECV 0.85 cm3, No compliance peak)', left: 'Type B Flat (ECV 0.82 cm3, No compliance peak)' },
            speech: { srtRight: 35, srtLeft: 40, wrsRight: '96% @ 70 dB HL', wrsLeft: '92% @ 75 dB HL' },
            tinnitus: { present: false, rightPitch: 'N/A', leftPitch: 'N/A', thiScore: 'N/A' },
            recommendations: 'Urgent referral to Pediatric ENT for myringotomy and tympanostomy tube insertion.'
          }
        ],
        carePlan: [
          {
            id: 'cp-emeka-1',
            title: 'Pediatric Otolaryngology Referral & Medical Monitoring',
            category: 'Medical Management',
            status: 'In Progress',
            badgeClass: 'danger',
            details: 'Medical therapy initiated by ENT. 3-Week tympanometry surveillance scheduled to assess effusion resolution.',
            nextStep: 'Tympanometry recheck on 23 May 2026',
            clinician: 'Dr. Chika Okafor, Au.D.'
          }
        ],
        devices: [],
        appointments: [
          { id: 'apt-e1', date: '23 May 2026', time: '11:00 - 11:30', reason: '3-Week Tympanometry Recheck post-referral medical therapy', specialist: 'Dr. Chika Okafor, Au.D.', status: 'Booked', outcome: 'Scheduled' },
          { id: 'apt-e2', date: '10 May 2026', time: '14:00 - 15:00', reason: 'Pediatric Diagnostic Audiology & Immittance Battery', specialist: 'Dr. Chika Okafor, Au.D.', status: 'Completed', outcome: 'OME & 25 dB ABG confirmed' }
        ],
        media: [
          { id: 'm-e1', name: 'Otoscopy_Bilateral_Effusion.jpg', type: 'Otoscopy', date: '10 May 2026', size: '1.8 MB', tag: 'Type B Retracted TM' },
          { id: 'm-e2', name: 'Tympanometry_Flat_TypeB.xml', type: 'Immittance', date: '10 May 2026', size: '42 KB', tag: 'Flat Curve' }
        ]
      }
    }
  };

  function init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
      }
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }
  }

  function getDB() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return defaultData;
  }

  function saveDB(db) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      console.error('Error saving DB:', e);
    }
  }

  function getPatient(id) {
    const db = getDB();
    if (!db || !db.patients) return defaultData.patients['amaia'];
    return db.patients[id] || defaultData.patients[id] || db.patients['amaia'] || defaultData.patients['amaia'];
  }

  function savePatient(patient) {
    const db = getDB();
    if (!db.patients) db.patients = {};
    db.patients[patient.id] = patient;
    saveDB(db);
    return patient;
  }

  function getAllPatients() {
    const db = getDB();
    if (!db || !db.patients) return Object.values(defaultData.patients);
    const list = Object.values(db.patients);
    return list.length > 0 ? list : Object.values(defaultData.patients);
  }

  init();

  return {
    getPatient,
    savePatient,
    getAllPatients,
    getDB,
    saveDB
  };
})();

if (typeof window !== 'undefined') {
  window.HearIntelDB = HearIntelDB;
}
