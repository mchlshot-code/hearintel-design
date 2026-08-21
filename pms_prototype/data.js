/**
 * HearIntel PMS — Clinical Data Store & State Engine
 * Clean Database Initializer (All static mock-ups removed for live dynamic workflows)
 */
const HearIntelDB = (function() {
  const STORAGE_KEY = 'hearintel_pms_db_v7_live';

  const defaultData = {
    currentClinician: {
      name: 'Authenticated Clinician',
      facility: 'Audiology Clinical Center',
      room: 'Diagnostic Sound Suite',
      license: 'MLSCN-AUD-VERIFIED'
    },
    patients: {}
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
    if (!db || !db.patients) return null;
    if (id && db.patients[id]) return db.patients[id];
    const all = Object.values(db.patients);
    return all.length > 0 ? all[0] : null;
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
    if (!db || !db.patients) return [];
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
