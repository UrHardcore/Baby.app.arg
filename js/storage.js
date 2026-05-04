/* ========================================
   Mi Baby ARG - Storage Module
   localStorage + Firebase Firestore sync
   ======================================== */

const Storage = {
  PREFIX: 'bebecare_',
  _syncTimeout: null,

  _getKey(key) {
    return this.PREFIX + key;
  },

  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(this._getKey(key));
      return data !== null ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(this._getKey(key), JSON.stringify(value));
      this._scheduleSync();
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(this._getKey(key));
      this._scheduleSync();
      return true;
    } catch {
      return false;
    }
  },

  _scheduleSync() {
    if (this._syncTimeout) clearTimeout(this._syncTimeout);
    this._syncTimeout = setTimeout(() => this.syncToFirebase(), 1500);
  },

  async syncToFirebase() {
    if (!window.FirebaseAuth || !window.FirebaseAuth.getUid()) return;
    const uid = window.FirebaseAuth.getUid();
    try {
      const data = {
        profile: this.getBabyProfile(),
        vaccines: this.getVaccines(),
        reminders: this.getReminders(),
        medical: this.getMedicalRecords(),
        growth: this.getGrowthRecords(),
        lastSync: Date.now()
      };
      await window.FirebaseDB.saveAppData(uid, data);
    } catch (err) {
      console.warn('Firebase sync error:', err);
    }
  },

  async loadFromFirebase() {
    if (!window.FirebaseAuth || !window.FirebaseAuth.getUid()) return false;
    const uid = window.FirebaseAuth.getUid();
    try {
      const data = await window.FirebaseDB.getAppData(uid);
      if (data && data.profile) {
        if (data.profile) this.saveBabyProfileLocal(data.profile);
        if (data.vaccines) this.saveVaccinesLocal(data.vaccines);
        if (data.reminders) this.saveRemindersLocal(data.reminders);
        if (data.medical) this.saveMedicalRecordsLocal(data.medical);
        if (data.growth) this.saveGrowthRecordsLocal(data.growth);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Firebase load error:', err);
      return false;
    }
  },

  // Local-only setters (no sync trigger, used during load)
  saveBabyProfileLocal(profile) {
    try { localStorage.setItem(this._getKey('profile'), JSON.stringify(profile)); } catch {}
  },
  saveVaccinesLocal(vaccines) {
    try { localStorage.setItem(this._getKey('vaccines'), JSON.stringify(vaccines)); } catch {}
  },
  saveRemindersLocal(reminders) {
    try { localStorage.setItem(this._getKey('reminders'), JSON.stringify(reminders)); } catch {}
  },
  saveMedicalRecordsLocal(records) {
    try { localStorage.setItem(this._getKey('medical'), JSON.stringify(records)); } catch {}
  },
  saveGrowthRecordsLocal(records) {
    try { localStorage.setItem(this._getKey('growth'), JSON.stringify(records)); } catch {}
  },

  clearLocal() {
    const theme = this.getTheme();
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(this.PREFIX)) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
    this.saveTheme(theme);
  },

  getBabyProfile() {
    return this.get('profile', null);
  },

  saveBabyProfile(profile) {
    return this.set('profile', profile);
  },

  getVaccines() {
    return this.get('vaccines', {});
  },

  saveVaccines(vaccines) {
    return this.set('vaccines', vaccines);
  },

  getReminders() {
    return this.get('reminders', []);
  },

  saveReminders(reminders) {
    return this.set('reminders', reminders);
  },

  getMedicalRecords() {
    return this.get('medical', []);
  },

  saveMedicalRecords(records) {
    return this.set('medical', records);
  },

  getGrowthRecords() {
    return this.get('growth', []);
  },

  saveGrowthRecords(records) {
    return this.set('growth', records);
  },

  getTheme() {
    return this.get('theme', 'light');
  },

  saveTheme(theme) {
    return this.set('theme', theme);
  },

  exportAll() {
    const data = {
      profile: this.getBabyProfile(),
      vaccines: this.getVaccines(),
      reminders: this.getReminders(),
      medical: this.getMedicalRecords(),
      growth: this.getGrowthRecords(),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    return JSON.stringify(data, null, 2);
  },

  importAll(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) this.saveBabyProfile(data.profile);
      if (data.vaccines) this.saveVaccines(data.vaccines);
      if (data.reminders) this.saveReminders(data.reminders);
      if (data.medical) this.saveMedicalRecords(data.medical);
      if (data.growth) this.saveGrowthRecords(data.growth);
      return true;
    } catch {
      return false;
    }
  }
};
