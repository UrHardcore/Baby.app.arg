/* ========================================
   BebeCare - Dashboard Module
   ======================================== */

const Dashboard = {
  ageInterval: null,

  init() {
    this.update();
    this.startAgeCounter();
  },

  startAgeCounter() {
    if (this.ageInterval) clearInterval(this.ageInterval);
    this.ageInterval = setInterval(() => {
      this.updateAge();
    }, 60000);
  },

  update() {
    this.updateAge();
    this.updateVaccineCard();
    this.updateReminderCard();
    this.updateMedicalCard();
    this.updateGrowthCard();
    this.updateTip();
    this.updateTimeline();
    this.updateBabyProfile();
  },

  updateAge() {
    const profile = Storage.getBabyProfile();
    if (!profile) return;

    const ageStr = Utils.formatAge(profile.birthDate);
    const shortAge = Utils.formatShortAge(profile.birthDate);

    const dashAgeValue = document.getElementById('dash-age-value');
    const headerAge = document.getElementById('header-age');

    if (dashAgeValue) dashAgeValue.textContent = ageStr;
    if (headerAge) headerAge.textContent = shortAge;
  },

  updateVaccineCard() {
    const nextVaccine = VaccineModule.getNextVaccine();
    const dashValue = document.getElementById('dash-vaccine-value');

    if (nextVaccine) {
      dashValue.textContent = `${nextVaccine.name} (${nextVaccine.ageLabel})`;
    } else {
      dashValue.textContent = 'Todas al dia';
    }
  },

  updateReminderCard() {
    const upcoming = ReminderModule.getUpcomingReminders(1);
    const dashValue = document.getElementById('dash-reminder-value');

    if (upcoming.length > 0) {
      const r = upcoming[0];
      dashValue.textContent = `${r.title} - ${Utils.formatDateShort(r.date)}`;
    } else {
      dashValue.textContent = 'Sin pendientes';
    }
  },

  updateMedicalCard() {
    const lastRecord = MedicalModule.getLastRecord();
    const dashValue = document.getElementById('dash-medical-value');

    if (lastRecord) {
      const desc = lastRecord.description.length > 40
        ? lastRecord.description.substring(0, 40) + '...'
        : lastRecord.description;
      dashValue.textContent = desc;
    } else {
      dashValue.textContent = 'Sin registros';
    }
  },

  updateGrowthCard() {
    const latest = GrowthModule.getLatestRecord();
    const dashValue = document.getElementById('dash-growth-value');

    if (latest) {
      const parts = [];
      if (latest.weight) parts.push(`${latest.weight}kg`);
      if (latest.height) parts.push(`${latest.height}cm`);
      dashValue.textContent = parts.join(' / ') || 'Sin datos';
    } else {
      dashValue.textContent = 'Sin datos';
    }
  },

  updateTip() {
    const tipValue = document.getElementById('dash-tip-value');
    if (tipValue) tipValue.textContent = Utils.getDailyTip();
  },

  updateTimeline() {
    const profile = Storage.getBabyProfile();
    if (!profile) return;

    const timelineBar = document.getElementById('timeline-bar');
    const ageMonths = Utils.getAgeInMonths(profile.birthDate);

    timelineBar.innerHTML = DEVELOPMENT_MILESTONES.map(m => {
      let status = '';
      if (m.ageMonths < ageMonths - 1) status = 'achieved';
      else if (Math.abs(m.ageMonths - ageMonths) <= 1) status = 'current';

      return `
        <div class="timeline-item ${status}" title="${m.description}">
          <span class="timeline-item-icon">${m.icon}</span>
          <span class="timeline-item-label">${m.label}</span>
        </div>
      `;
    }).join('');
  },

  updateBabyProfile() {
    const profile = Storage.getBabyProfile();
    if (!profile) return;

    const fullName = profile.lastName ? `${profile.name} ${profile.lastName}` : profile.name;
    const headerName = document.getElementById('header-name');
    const babySectionTitle = document.getElementById('baby-section-title');
    const profileName = document.getElementById('baby-profile-name');
    const profileBirth = document.getElementById('baby-profile-birth');
    const profileAge = document.getElementById('baby-profile-age');
    const profileWeight = document.getElementById('baby-profile-weight');
    const profileAvatar = document.getElementById('baby-profile-avatar');

    if (headerName) headerName.textContent = fullName;
    if (babySectionTitle) babySectionTitle.textContent = fullName;
    if (profileName) profileName.textContent = fullName;
    if (profileBirth) profileBirth.textContent = `Nacido/a el ${Utils.formatDate(profile.birthDate)}${profile.birthTime ? ' a las ' + profile.birthTime : ''}`;
    if (profileAge) profileAge.textContent = Utils.formatAge(profile.birthDate);
    if (profileWeight) profileWeight.textContent = `Peso al nacer: ${profile.birthWeight} kg`;
    if (profileAvatar) profileAvatar.textContent = profile.gender === 'boy' ? '👦' : '👧';

    const headerAvatar = document.getElementById('header-avatar');
    if (headerAvatar) headerAvatar.textContent = profile.gender === 'boy' ? '👦' : '👧';

    this.updateBabyTimeline();
    this.updateBabyStats();
  },

  updateBabyTimeline() {
    const timeline = document.getElementById('baby-timeline');
    const profile = Storage.getBabyProfile();
    if (!profile || !timeline) return;

    const events = [];

    events.push({
      date: profile.birthDate,
      text: `${profile.name} nacio - ${profile.birthWeight}kg`,
      type: 'nacimiento'
    });

    const vaccines = Storage.getVaccines();
    Object.entries(vaccines).forEach(([id, data]) => {
      const vaccine = VACCINE_SCHEDULE.find(v => v.id === id);
      if (vaccine) {
        events.push({
          date: data.appliedDate,
          text: `Vacuna: ${vaccine.name} (${vaccine.description})`,
          type: 'vacuna'
        });
      }
    });

    const medical = Storage.getMedicalRecords();
    medical.forEach(r => {
      events.push({
        date: r.date,
        text: r.description.length > 60 ? r.description.substring(0, 60) + '...' : r.description,
        type: 'medico'
      });
    });

    const growth = Storage.getGrowthRecords();
    growth.forEach(r => {
      const parts = [];
      if (r.weight) parts.push(`${r.weight}kg`);
      if (r.height) parts.push(`${r.height}cm`);
      if (parts.length > 0) {
        events.push({
          date: r.date,
          text: `Registro: ${parts.join(', ')}`,
          type: 'crecimiento'
        });
      }
    });

    events.sort((a, b) => new Date(b.date) - new Date(a.date));

    const timelineDiv = timeline.querySelector('.timeline');
    if (!timelineDiv) return;

    if (events.length === 0) {
      timelineDiv.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">No hay eventos registrados</p>';
      return;
    }

    timelineDiv.innerHTML = events.slice(0, 20).map(e => `
      <div class="timeline-entry">
        <div class="timeline-entry-date">${Utils.formatDate(e.date)}</div>
        <div class="timeline-entry-text">${e.text}</div>
        <div class="timeline-entry-type">${e.type}</div>
      </div>
    `).join('');
  },

  updateBabyStats() {
    const grid = document.getElementById('baby-stats-grid');
    if (!grid) return;

    const profile = Storage.getBabyProfile();
    if (!profile) return;

    const vaccineProgress = VaccineModule.getProgress();
    const reminders = Storage.getReminders();
    const pendingReminders = reminders.filter(r => !r.completed).length;
    const medicalCount = Storage.getMedicalRecords().length;
    const growthCount = Storage.getGrowthRecords().length;
    const ageDays = Utils.getAgeInDays(profile.birthDate);

    grid.innerHTML = `
      <div class="stat-item">
        <div class="stat-value">${ageDays}</div>
        <div class="stat-label">Dias de vida</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${vaccineProgress.applied}/${vaccineProgress.total}</div>
        <div class="stat-label">Vacunas</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${pendingReminders}</div>
        <div class="stat-label">Recordatorios</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${medicalCount}</div>
        <div class="stat-label">Registros medicos</div>
      </div>
    `;
  }
};
