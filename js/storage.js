/* ========================================
   BebeCare - Storage Module
   localStorage persistence with fallback
   ======================================== */

const Storage = {
  PREFIX: 'bebecare_',

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
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(this._getKey(key));
      return true;
    } catch {
      return false;
    }
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
