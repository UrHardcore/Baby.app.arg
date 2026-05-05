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
    this._syncTimeout = setTimeout(() => this.syncToFirebase(), 1000);
  },
 
  async syncNow() {
    if (this._syncTimeout) clearTimeout(this._syncTimeout);
    await this.syncToFirebase();
  },
 
  async syncToFirebase() {
    if (!window.FirebaseAuth || !window.FirebaseAuth.getUid()) {
      console.log('syncToFirebase: no auth or no uid, skipping');
      return;
    }
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
      console.log('syncToFirebase: saving data for uid', uid, 'profile:', data.profile ? data.profile.name : 'null');
      await window.FirebaseDB.saveAppData(uid, data);
      console.log('syncToFirebase: save complete');
    } catch (err) {
      console.error('Firebase sync error:', err);
    }
  },
 
  async loadFromFirebase() {
    if (!window.FirebaseAuth || !window.FirebaseAuth.getUid()) {
      console.log('loadFromFirebase: no auth or no uid');
      return false;
    }
    const uid = window.FirebaseAuth.getUid();
    try {
      console.log('loadFromFirebase: loading data for uid', uid);
      const data = await window.FirebaseDB.getAppData(uid);
      console.log('loadFromFirebase: got data', data ? 'yes' : 'no', 'profile:', data?.profile ? data.profile.name : 'null');
      if (data) {
        if (data.profile) this.saveBabyProfileLocal(data.profile);
        if (data.vaccines) this.saveVaccinesLocal(data.vaccines);
        if (data.reminders) this.saveRemindersLocal(data.reminders);
        if (data.medical) this.saveMedicalRecordsLocal(data.medical);
        if (data.growth) this.saveGrowthRecordsLocal(data.growth);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Firebase load error:', err);
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
    const result = this.set('profile', profile);
    this.syncNow();
    return result;
  },
 
  getVaccines() {
    return this.get('vaccines', {});
  },
 
  saveVaccines(vaccines) {
    const result = this.set('vaccines', vaccines);
    this.syncNow();
    return result;
  },
 
  getReminders() {
    return this.get('reminders', []);
  },
 
  saveReminders(reminders) {
    const result = this.set('reminders', reminders);
    this.syncNow();
    return result;
  },
 
  getMedicalRecords() {
    return this.get('medical', []);
  },
 
  saveMedicalRecords(records) {
    const result = this.set('medical', records);
    this.syncNow();
    return result;
  },
 
  getGrowthRecords() {
    return this.get('growth', []);
  },
 
  saveGrowthRecords(records) {
    const result = this.set('growth', records);
    this.syncNow();
    return result;
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