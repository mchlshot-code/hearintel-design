/**
 * HearIntel PMS — Shared Clinical Data Store & State Engine
 * Multi-Encounter Longitudinal EMR Dataset
 */
const HearIntelDB = (function() {
  const STORAGE_KEY = 'hearintel_pms_db_v6_clean';

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
            type: 'Comprehensive Diagnostic Audiology & Fitting',
            clinician: 'Dr. Chika Okafor, Au.D.',
            facility: 'Lagos Central Clinic (Booth 1)',
            reason: '6-Month Surveillance & Bilateral Hearing Aid Fitting',
            status: 'Completed',
            ptaRight: 30.0,
            ptaLeft: 36.2,
            diagnosis: 'Bilateral SNHL, Mild-to-Mod Sloping (Progressive High-Freq)',
            history: {
              complaint: 'Worsening difficulty understanding soft spoken consonants and group conversation in noise over past 3 months.',
              redFlags: 'Negative for sudden drop, active discharge, otalgia, or vertigo.',
              otologic: 'Bilateral continuous ringing tinnitus (4kHz). No ototoxic drug exposure.'
            },
            otoscopy: {
              right: 'External canal patent and clear. Tympanic membrane intact, translucent with sharp cone of light.',
              left: 'External canal patent and clear. Tympanic membrane intact, normal landmarks.'
            },
            thresholds: {
              acR: { 250: 20, 500: 25, 1000: 20, 2000: 30, 3000: 35, 4000: 45, 6000: 50, 8000: 55 },
              bcR: { 500: 25, 1000: 15, 2000: 30, 4000: 40 },
              acL: { 250: 25, 500: 30, 1000: 25, 2000: 40, 3000: 45, 4000: 50, 6000: 60, 8000: 65 },
              bcL: { 500: 30, 1000: 20, 2000: 35, 4000: 45 }
            },
            tympanometry: {
              right: { ecv: 1.15, comp: 0.78, pres: -20, grad: 85, type: 'Type A (Normal)' },
              left: { ecv: 1.08, comp: 0.72, pres: -30, grad: 90, type: 'Type A (Normal)' },
              ipsi1kR: '85 dB HL', contra1kR: '90 dB HL',
              ipsi1kL: '90 dB HL', contra1kL: '95 dB HL',
              decayR: 'Negative (No decay)', decayL: 'Negative (No decay)'
            },
            speech: {
              right: { srt: 30, wrs: 88, wrsLevel: '65 dB HL', mcl: 65, ucl: 95 },
              left: { srt: 35, wrs: 76, wrsLevel: '70 dB HL', mcl: 70, ucl: 95 },
              rollover: '0.05 (AD) / 0.11 (AS) — Negative for retrocochlear lesion',
              quicksin: '+4.5 dB SNR Loss (Mild SNR deficit in noise)'
            },
            electrophysiology: {
              abrR: { w1: '1.62 ms', w3: '3.74 ms', w5: '5.62 ms', interval: '4.00 ms (Normal)', oae: 'Pass (1k-3k Hz)' },
              abrL: { w1: '1.68 ms', w3: '3.80 ms', w5: '5.68 ms', interval: '4.00 ms (Normal)', oae: 'Refer (>2kHz)' },
              pattern: 'Wave I-V central conduction within normal limits bilaterally. High-frequency DPOAE suppression consistent with sensory cochlear loss.'
            },
            management: 'Bilateral Oticon Real 1 miniRITE programmed to NAL-NL2 target. Real-ear probe microphone measurement (REM) completed. Follow-up recall scheduled for 26 Aug 2026.'
          },
          {
            id: 'enc-11',
            number: 11,
            date: '14 Feb 2026',
            type: 'Baseline Comprehensive Audiological Evaluation',
            clinician: 'Amina Bello, Aud',
            facility: 'Lagos Central Clinic (Booth 1)',
            reason: 'Initial Diagnostic Evaluation for Progressive Hearing Difficulty',
            status: 'Completed',
            ptaRight: 28.5,
            ptaLeft: 33.0,
            diagnosis: 'Bilateral Mild Sensorineural Hearing Loss Baseline',
            history: {
              complaint: 'Difficulty in noisy family gatherings and television clarity over 2 years.',
              redFlags: 'Negative for all red flags.',
              otologic: 'Bilateral mild tinnitus.'
            },
            otoscopy: {
              right: 'External auditory canal clear. TM intact with normal cone of light.',
              left: 'External auditory canal clear. TM intact with normal landmarks.'
            },
            thresholds: {
              acR: { 250: 20, 500: 20, 1000: 20, 2000: 30, 3000: 35, 4000: 40, 6000: 45, 8000: 50 },
              bcR: { 500: 20, 1000: 15, 2000: 25, 4000: 35 },
              acL: { 250: 20, 500: 25, 1000: 25, 2000: 35, 3000: 40, 4000: 45, 6000: 55, 8000: 60 },
              bcL: { 500: 25, 1000: 20, 2000: 30, 4000: 40 }
            },
            tympanometry: {
              right: { ecv: 1.12, comp: 0.80, pres: -15, grad: 80, type: 'Type A (Normal)' },
              left: { ecv: 1.10, comp: 0.75, pres: -20, grad: 85, type: 'Type A (Normal)' },
              ipsi1kR: '85 dB HL', contra1kR: '90 dB HL',
              ipsi1kL: '85 dB HL', contra1kL: '90 dB HL',
              decayR: 'Negative', decayL: 'Negative'
            },
            speech: {
              right: { srt: 25, wrs: 92, wrsLevel: '65 dB HL', mcl: 60, ucl: 95 },
              left: { srt: 30, wrs: 92, wrsLevel: '65 dB HL', mcl: 65, ucl: 95 },
              rollover: '0.04 (AD) / 0.04 (AS) — Normal',
              quicksin: '+2.0 dB SNR Loss (Normal Speech in Noise)'
            },
            electrophysiology: {
              abrR: { w1: '1.60 ms', w3: '3.70 ms', w5: '5.60 ms', interval: '4.00 ms (Normal)', oae: 'Pass (1k-4k Hz)' },
              abrL: { w1: '1.62 ms', w3: '3.72 ms', w5: '5.62 ms', interval: '4.00 ms (Normal)', oae: 'Pass (1k-3k Hz)' },
              pattern: 'Normal auditory brainstem evoked potentials and bilateral cochlear microphonic.'
            },
            management: 'Baseline documented. Communication strategies counseled. 6-Month surveillance scheduled.'
          }
        ],
        carePlan: [
          {
            id: 'cp-1',
            title: 'Bilateral Hearing Aid Fitting & Verification',
            category: 'Hearing Aid (HA)',
            status: 'Active (Fitted)',
            badgeClass: 'warning',
            details: 'Oticon Real 1 miniRITE (SN: OT-26-R-99412 / OT-26-L-99413). REM NAL-NL2 acoustic verification complete.',
            nextStep: '3-Week verification recall on 26 Aug 2026',
            clinician: 'Dr. Chika Okafor, Au.D.'
          },
          {
            id: 'cp-2',
            title: 'Aural Rehabilitation — Speech in Noise Strategy',
            category: 'Rehabilitation',
            status: 'In Progress (Session 2/6)',
            badgeClass: 'teal',
            details: '6-week communication strategy series focusing on directional microphone training and clear speech cues.',
            nextStep: 'Session #3 scheduled for 26 Aug 2026',
            clinician: 'Dr. Chika Okafor, Au.D.'
          },
          {
            id: 'cp-0',
            title: 'Baseline Diagnostic Surveillance',
            category: 'Surveillance',
            status: 'Completed',
            badgeClass: 'neutral',
            details: 'Initial evaluation completed on 14 Feb 2026; established sloping baseline.',
            nextStep: 'Transitioned to active amplification on 20 May 2026',
            clinician: 'Amina Bello, Aud'
          }
        ],
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
          { id: 'm-4', name: 'Tympanogram_Export_20May.xml', type: 'Immittance', date: '20 May 2026', size: '48 KB', tag: 'Type A Bilateral' }
        ]
      },
      'david': {
        id: 'david',
        mrn: 'LCC-26-02891',
        name: 'David M.',
        fullName: 'David Mohammed',
        dob: '1974-09-18',
        age: 52,
        gender: 'Male',
        phone: '+234 802 819 0021',
        homePhone: '+234 1 450 1192',
        workPhone: '+234 802 819 0021',
        email: 'david.m@example.com',
        address: '12 Adeola Odeku St, Victoria Island, Lagos, Nigeria',
        emergencyContact: 'Funke M. (Sister) · +234 803 771 9022',
        primaryLanguage: 'English',
        insurance: 'Hygeia HMO (Corporate #HYG-11029)',
        assignedClinician: 'Dr. Chika Okafor, Au.D.',
        facility: 'Lagos Central Clinic',
        referral: 'Dr. O. Adele, Family Physician (MedPlus Clinic)',
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
        pathwayLabel: 'Urgent Medical Referral',
        alerts: [
          'Significant interaural threshold asymmetry (>30 dB at 2k–4k Hz on Left)',
          'Left ear Rollover Index R = 0.44 (>0.40 Retrocochlear Warning)',
          'Requires urgent Referral clearance and contrast MRI of IAC to rule out vestibular schwannoma'
        ],
        clinicalNote: 'Patient experienced acute unilateral hearing loss and high-frequency roaring tinnitus in left ear over 4 weeks. Audiometric battery revealed significant 30 dB asymmetric drop in left ear, severe word discrimination collapse (WRS 52% at 80 dB HL with rollover R=0.44), and prolonged ABR interpeak interval (I-V = 4.85 ms, IT5 = 0.93 ms). Urgent ENT/Neuro-otology consult and contrast MRI requested.',
        diagnosesHistory: [
          { code: 'ICD-10 H90.4', title: 'Sensorineural Hearing Loss, Unilateral (Left)', date: '18 May 2026', status: 'Active (Urgent)', notes: 'Significant asymmetric high-frequency drop.' },
          { code: 'ICD-10 H93.12', title: 'Unilateral Tinnitus (Left)', date: '18 May 2026', status: 'Active', notes: 'Roaring tonal tinnitus accompanied by sudden sensory loss.' }
        ],
        assessments: [
          {
            id: 'enc-david-2',
            number: 2,
            date: '18 May 2026',
            type: 'Diagnostic Audiology (Asymmetry Protocol)',
            clinician: 'Dr. Chika Okafor, Au.D.',
            facility: 'Lagos Central Clinic (Booth 1)',
            reason: 'Urgent Diagnostic Workup for Unilateral Hearing Loss & Tinnitus',
            status: 'Completed',
            ptaRight: 25.0,
            ptaLeft: 55.0,
            diagnosis: 'Asymmetric SNHL, Left Significant Drop (ICD-10 H90.4)',
            history: {
              complaint: 'Unilateral sudden-onset hearing drop in left ear with high-pitched roaring tinnitus over past 4 weeks.',
              redFlags: 'Positive for unilateral asymmetric sensorineural progression. Urgent specialist referral indicated.',
              otologic: 'Left ear high-frequency ringing, intermittent dizziness without true spinning vertigo.'
            },
            otoscopy: {
              right: 'Canal clear. TM intact, translucent with sharp light reflex.',
              left: 'Canal clear. TM intact, landmarks normal. No middle ear effusion.'
            },
            thresholds: {
              acR: { 250: 15, 500: 20, 1000: 25, 2000: 25, 3000: 30, 4000: 30, 6000: 35, 8000: 35 },
              bcR: { 500: 20, 1000: 20, 2000: 25, 4000: 30 },
              acL: { 250: 30, 500: 45, 1000: 55, 2000: 60, 3000: 65, 4000: 70, 6000: 75, 8000: 80 },
              bcL: { 500: 40, 1000: 50, 2000: 60, 4000: 65 }
            },
            tympanometry: {
              right: { ecv: 1.12, comp: 0.75, pres: -10, grad: 80, type: 'Type A (Normal)' },
              left: { ecv: 1.10, comp: 0.70, pres: -20, grad: 85, type: 'Type A (Normal)' },
              ipsi1kR: '85 dB HL', contra1kR: '90 dB HL',
              ipsi1kL: '105 dB HL', contra1kL: '>105 dB HL (Elevated)',
              decayR: 'Negative', decayL: 'Positive (>50% acoustic reflex decay at 10s)'
            },
            speech: {
              right: { srt: 25, wrs: 92, wrsLevel: '65 dB HL', mcl: 65, ucl: 95 },
              left: { srt: 55, wrs: 52, wrsLevel: '80 dB HL', mcl: 80, ucl: 100, rollover: 0.44, quicksin: '+8.5 dB SNR Loss' },
              rollover: 'Left ear Rollover Index R = 0.44 (>0.40 Significant Retrocochlear Warning)',
              quicksin: '+8.5 dB SNR Loss (Significant discrimination deficit)'
            },
            electrophysiology: {
              abrR: { w1: '1.60 ms', w3: '3.70 ms', w5: '5.60 ms', interval: '4.00 ms (Normal)', oae: 'Pass (Normal OHC)' },
              abrL: { w1: '1.70 ms', w3: '4.35 ms', w5: '6.55 ms', interval: '4.85 ms (Prolonged)', oae: 'Pass (Preserved OHC)' },
              pattern: 'Significant interaural Wave V delay (IT5 = 0.93 ms) with preserved DPOAEs on Left. Findings strongly suggest 8th-nerve retrocochlear lesion.'
            },
            management: 'Urgent Otolaryngology / Neuro-otology consult and contrast MRI of IAC requested. Hearing aid fitting contraindicated pending medical rule-out.'
          },
          {
            id: 'enc-david-1',
            number: 1,
            date: '10 Jan 2026',
            type: 'Routine Annual Occupational Audiometric Screening',
            clinician: 'Amina Bello, Aud',
            facility: 'Lagos Central Clinic (Booth 1)',
            reason: 'Annual Executive Health Screening',
            status: 'Completed',
            ptaRight: 18.5,
            ptaLeft: 20.0,
            diagnosis: 'Normal Symmetric Bilateral Hearing Thresholds',
            history: {
              complaint: 'Routine check; no subjective complaints at time of evaluation.',
              redFlags: 'Negative for all red flags.',
              otologic: 'No history of ear infections or tinnitus.'
            },
            otoscopy: {
              right: 'Canal clear. TM intact with distinct light cone.',
              left: 'Canal clear. TM intact with distinct light cone.'
            },
            thresholds: {
              acR: { 250: 15, 500: 15, 1000: 20, 2000: 20, 3000: 20, 4000: 25, 6000: 25, 8000: 25 },
              bcR: { 500: 15, 1000: 15, 2000: 20, 4000: 20 },
              acL: { 250: 15, 500: 15, 1000: 20, 2000: 20, 3000: 25, 4000: 25, 6000: 25, 8000: 30 },
              bcL: { 500: 15, 1000: 15, 2000: 20, 4000: 25 }
            },
            tympanometry: {
              right: { ecv: 1.10, comp: 0.80, pres: -10, grad: 80, type: 'Type A (Normal)' },
              left: { ecv: 1.10, comp: 0.80, pres: -10, grad: 80, type: 'Type A (Normal)' },
              ipsi1kR: '85 dB HL', contra1kR: '90 dB HL',
              ipsi1kL: '85 dB HL', contra1kL: '90 dB HL',
              decayR: 'Negative', decayL: 'Negative'
            },
            speech: {
              right: { srt: 20, wrs: 96, wrsLevel: '60 dB HL', mcl: 60, ucl: 95 },
              left: { srt: 20, wrs: 96, wrsLevel: '60 dB HL', mcl: 60, ucl: 95 },
              rollover: 'Normal (0.02)',
              quicksin: '+1.0 dB SNR Loss (Normal)'
            },
            electrophysiology: {
              abrR: { w1: '1.60 ms', w3: '3.70 ms', w5: '5.60 ms', interval: '4.00 ms (Normal)', oae: 'Pass' },
              abrL: { w1: '1.60 ms', w3: '3.70 ms', w5: '5.60 ms', interval: '4.00 ms (Normal)', oae: 'Pass' },
              pattern: 'Normal baseline auditory brainstem responses bilaterally.'
            },
            management: 'Normal baseline established. Routine annual surveillance recommended.'
          }
        ],
        carePlan: [
          {
            id: 'cp-david-1',
            title: 'Otolaryngology / Neuro-otology Specialist Referral',
            category: 'Specialist Referral',
            status: 'Pending Review (Urgent)',
            badgeClass: 'danger',
            details: 'Urgent consult for unilateral sensorineural drop and retrocochlear test findings. Contrast MRI internal auditory canal requested.',
            nextStep: 'Consultant clinic review on 22 May 2026',
            clinician: 'Dr. Chika Okafor, Au.D.'
          }
        ],
        devices: [],
        appointments: [
          { id: 'apt-d1', date: '22 May 2026', time: '14:00 - 15:00', reason: 'Urgent Referral Consultation & MRI Review', specialist: 'Dr. Chika Okafor, Au.D.', status: 'Booked', outcome: 'Pending Consultant Review' },
          { id: 'apt-d2', date: '18 May 2026', time: '10:00 - 11:15', reason: 'Diagnostic Audiology (Asymmetry Protocol)', specialist: 'Dr. Chika Okafor, Au.D.', status: 'Completed', outcome: 'Significant Left asymmetric SNHL flagged' },
          { id: 'apt-d3', date: '10 Jan 2026', time: '09:30 - 10:30', reason: 'Routine Annual Occupational Screening', specialist: 'Amina Bello, Aud', status: 'Completed', outcome: 'Normal symmetric baseline' }
        ],
        media: [
          { id: 'm-d1', name: 'Asymmetry_Audiogram_18May.pdf', type: 'Report PDF', date: '18 May 2026', size: '380 KB', tag: 'Asymmetric Curve' },
          { id: 'm-d2', name: 'ABR_Traces_18May.pdf', type: 'Electrophysiology', date: '18 May 2026', size: '620 KB', tag: 'Prolonged Wave V Left' }
        ]
      },      'emeka': {
        id: 'emeka',
        mrn: 'LCC-26-03319',
        name: 'Emeka O.',
        fullName: 'Emeka Okafor',
        dob: '2016-07-22',
        age: 10,
        gender: 'Male',
        phone: '+234 809 112 3445',
        homePhone: '+234 1 330 9941',
        workPhone: '+234 809 112 3445',
        email: 'emeka.parents@example.com',
        address: '14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
        emergencyContact: 'Mrs. Chioma O. (Mother) · +234 809 112 3445',
        primaryLanguage: 'English',
        insurance: 'Leadway Health (Gold Tier #LDW-88192)',
        assignedClinician: 'Dr. Chika Okafor, Au.D.',
        facility: 'Lagos Central Clinic',
        referral: 'Dr. F. Balogun, Consultant Pediatrician (St. Nicholas)',
        primaryDiagnosis: 'Bilateral Moderate Conductive Hearing Loss with Otitis Media (ICD-10 H90.0)',
        ptaRight: 42.5,
        ptaLeft: 45.0,
        airBoneGap: '25 dB (Significant Conductive Component)',
        status: 'Medical Management',
        statusType: 'neutral',
        lastEncounter: '10 May 2026',
        nextRecall: '23 May 2026',
        recallReason: '3-Week Tympanometry Recheck post-referral medical therapy',
        pathway: 'follow-up',
        pathwayLabel: 'Pediatric Medical ENT Pathway',
        alerts: [
          'Type B (Flat) tympanograms with normal ear canal volume bilaterally',
          'Significant 25 dB air-bone gap; bone conduction pure sensorineural thresholds are normal',
          'Requires 3-week follow-up to check for middle ear effusion resolution'
        ],
        clinicalNote: '10-year-old child presenting with muffled hearing and decreased academic performance following recurrent upper respiratory tract infections. Diagnostic testing revealed bilateral moderate conductive hearing loss (air-bone gap of 25 dB), flat Type B tympanograms with normal canal volumes indicating bilateral middle-ear effusion (secretory otitis media), and normal word discrimination at elevated presentation level. Medical referral initiated for pediatric ENT management.',
        diagnosesHistory: [
          { code: 'ICD-10 H90.0', title: 'Bilateral Conductive Hearing Loss', date: '10 May 2026', status: 'Active (Reversible)', notes: '25 dB Air-Bone Gap secondary to middle ear effusion.' },
          { code: 'ICD-10 H65.0', title: 'Acute Serous Otitis Media Bilateral', date: '10 May 2026', status: 'Active', notes: 'Amber fluid levels visualized on pneumatic otoscopy.' }
        ],
        assessments: [
          {
            id: 'enc-emeka-1',
            number: 1,
            date: '10 May 2026',
            type: 'Pediatric Diagnostic Audiology & Immittance Battery',
            clinician: 'Dr. Chika Okafor, Au.D.',
            facility: 'Lagos Central Clinic (Booth 1)',
            reason: 'Pediatric Evaluation for Muffled Hearing & Inattention in Class',
            status: 'Completed',
            ptaRight: 42.5,
            ptaLeft: 45.0,
            diagnosis: 'Bilateral Moderate Conductive Loss (Otitis Media with Effusion)',
            history: {
              complaint: 'Muffled sound quality bilaterally following recurrent childhood otitis media and viral URI history.',
              redFlags: 'Negative for sensorineural drop; 25 dB conductive middle-ear component confirmed.',
              otologic: 'Aural fullness bilaterally, autophony, negative for active otorrhea or acute ear pain.'
            },
            otoscopy: {
              right: 'External canal clear. TM retracted with dull cone of light and amber fluid level (Type B).',
              left: 'External canal clear. TM thickened, reduced pneumatic mobility (Type B).'
            },
            thresholds: {
              acR: { 250: 40, 500: 45, 1000: 40, 2000: 45, 3000: 45, 4000: 40, 6000: 35, 8000: 30 },
              bcR: { 500: 15, 1000: 15, 2000: 15, 4000: 15 },
              acL: { 250: 45, 500: 45, 1000: 45, 2000: 45, 3000: 50, 4000: 45, 6000: 40, 8000: 35 },
              bcL: { 500: 20, 1000: 15, 2000: 20, 4000: 15 }
            },
            tympanometry: {
              right: { ecv: 1.10, comp: 0.18, pres: 'N/A', grad: 'Flat', type: 'Type B (Effusion)' },
              left: { ecv: 1.05, comp: 0.15, pres: 'N/A', grad: 'Flat', type: 'Type B (Effusion)' },
              ipsi1kR: 'Absent', contra1kR: 'Absent',
              ipsi1kL: 'Absent', contra1kL: 'Absent',
              decayR: 'N/A', decayL: 'N/A'
            },
            speech: {
              right: { srt: 40, wrs: 96, wrsLevel: '75 dB HL', mcl: 75, ucl: 100 },
              left: { srt: 45, wrs: 92, wrsLevel: '80 dB HL', mcl: 80, ucl: 100 },
              rollover: 'Normal discrimination at conductive presentation level (75 dB HL)',
              quicksin: '+1.5 dB SNR Loss (Normal SNR in noise)'
            },
            electrophysiology: {
              abrR: { w1: '1.95 ms', w3: '4.05 ms', w5: '5.95 ms', interval: '4.00 ms (Normal)', oae: 'Refer (Middle Ear Masking)' },
              abrL: { w1: '2.00 ms', w3: '4.10 ms', w5: '6.00 ms', interval: '4.00 ms (Normal)', oae: 'Refer (Middle Ear Masking)' },
              pattern: 'Absolute latency shift consistent with conductive middle-ear component. Central conduction WNL.'
            },
            management: 'Referred to Pediatric Otolaryngology for middle ear medical management. Follow-up immittance recheck scheduled.'
          }
        ],
        carePlan: [
          {
            id: 'cp-emeka-1',
            title: 'Pediatric Otolaryngology Referral & Medical Monitoring',
            category: 'Medical Management',
            status: 'In Progress',
            badgeClass: 'neutral',
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
    return db.patients[id] || defaultData.patients[id] || defaultData.patients['amaia'];
  }

  function savePatient(patient) {
    const db = getDB();
    db.patients[patient.id] = patient;
    saveDB(db);
    return patient;
  }

  function getAllPatients() {
    const db = getDB();
    return Object.values(db.patients);
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
