/* ========================================
   BebeCare - Vaccines Module
   ======================================== */

const VaccineModule = {
  appliedVaccines: {},
  currentFilter: 'all',

  init() {
    this.appliedVaccines = Storage.getVaccines();
    this.bindEvents();
    this.render();
  },

  bindEvents() {
    document.querySelectorAll('.vaccine-filters .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.vaccine-filters .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.render();
      });
    });
  },

  getVaccineStatus(vaccine) {
    if (this.appliedVaccines[vaccine.id]) return 'applied';
    const profile = Storage.getBabyProfile();
    if (!profile) return 'pending';
    const dueDate = Utils.getVaccineDueDate(profile.birthDate, vaccine.ageMonths, vaccine.ageDays);
    if (Utils.isOverdue(dueDate)) return 'overdue';
    const now = new Date();
    const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    if (diffDays <= 5 && diffDays >= 0) return 'warning';
    return 'pending';
  },

  toggleVaccine(vaccineId) {
    if (this.appliedVaccines[vaccineId]) {
      delete this.appliedVaccines[vaccineId];
      Utils.showToast('Vacuna desmarcada', 'info');
    } else {
      this.appliedVaccines[vaccineId] = {
        appliedDate: Utils.getTodayString(),
        timestamp: Date.now()
      };
      Utils.showToast('Vacuna marcada como aplicada', 'success');
    }
    Storage.saveVaccines(this.appliedVaccines);
    this.render();
    Dashboard.update();
  },

  getProgress() {
    const total = VACCINE_SCHEDULE.length;
    const applied = Object.keys(this.appliedVaccines).length;
    return { total, applied, percent: Math.round((applied / total) * 100) };
  },

  getNextVaccine() {
    const profile = Storage.getBabyProfile();
    if (!profile) return null;

    const pending = VACCINE_SCHEDULE.filter(v => {
      return !this.appliedVaccines[v.id];
    }).sort((a, b) => {
      const dateA = Utils.getVaccineDueDate(profile.birthDate, a.ageMonths, a.ageDays);
      const dateB = Utils.getVaccineDueDate(profile.birthDate, b.ageMonths, b.ageDays);
      return dateA - dateB;
    });

    return pending.length > 0 ? pending[0] : null;
  },

  render() {
    const list = document.getElementById('vaccine-list');
    const profile = Storage.getBabyProfile();
    if (!profile) return;

    let vaccines = VACCINE_SCHEDULE.map(v => ({
      ...v,
      status: this.getVaccineStatus(v),
      dueDate: Utils.getVaccineDueDate(profile.birthDate, v.ageMonths, v.ageDays)
    }));

    if (this.currentFilter !== 'all') {
      if (this.currentFilter === 'pending') {
        vaccines = vaccines.filter(v => v.status === 'pending' || v.status === 'warning');
      } else {
        vaccines = vaccines.filter(v => v.status === this.currentFilter);
      }
    }

    if (vaccines.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">💉</div>
          <p>No hay vacunas en esta categoria</p>
        </div>
      `;
      this.updateProgress();
      return;
    }

    list.innerHTML = vaccines.map(v => {
      const statusLabels = {
        applied: 'Aplicada',
        pending: 'Pendiente',
        overdue: 'Vencida',
        warning: 'Por vencer'
      };

      let dueDateStr;
      if (v.status === 'applied' && this.appliedVaccines[v.id]) {
        dueDateStr = `Aplicada el ${Utils.formatDateShort(this.appliedVaccines[v.id].appliedDate)}`;
      } else if (v.status === 'warning') {
        const diffDays = Math.ceil((v.dueDate - new Date()) / (1000 * 60 * 60 * 24));
        dueDateStr = diffDays <= 0 ? 'Vence hoy!' : `Vence en ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
      } else {
        dueDateStr = `Estimada: ${v.dueDate.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
      }

      return `
        <div class="vaccine-card ${v.status}">
          <div class="vaccine-check" onclick="VaccineModule.toggleVaccine('${v.id}')" title="Marcar/desmarcar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div class="vaccine-info">
            <div class="vaccine-name">${v.name}</div>
            <div class="vaccine-detail">${v.description} - ${dueDateStr}</div>
          </div>
          <div>
            <span class="vaccine-age">${v.ageLabel}</span>
            <span class="vaccine-status status-${v.status}">${statusLabels[v.status]}</span>
          </div>
        </div>
      `;
    }).join('');

    this.updateProgress();
    this.updateAlertDot();
  },

  updateAlertDot() {
    const profile = Storage.getBabyProfile();
    if (!profile) return;
    let hasOverdue = false;
    let hasWarning = false;
    for (const v of VACCINE_SCHEDULE) {
      const status = this.getVaccineStatus(v);
      if (status === 'overdue') { hasOverdue = true; break; }
      if (status === 'warning') hasWarning = true;
    }
    const dot = document.getElementById('vaccine-alert-dot');
    const navBtn = document.getElementById('nav-vaccines');
    if (!dot || !navBtn) return;
    if (hasOverdue) {
      dot.classList.remove('hidden');
      dot.classList.add('alert-critical');
      dot.classList.remove('alert-warning');
      navBtn.classList.add('vaccine-buzz');
    } else if (hasWarning) {
      dot.classList.remove('hidden');
      dot.classList.add('alert-warning');
      dot.classList.remove('alert-critical');
      navBtn.classList.remove('vaccine-buzz');
    } else {
      dot.classList.add('hidden');
      navBtn.classList.remove('vaccine-buzz');
    }
  },

  updateProgress() {
    const progress = this.getProgress();
    const fill = document.getElementById('vaccine-progress-fill');
    const text = document.getElementById('vaccine-progress-text');
    if (fill) fill.style.width = progress.percent + '%';
    if (text) text.textContent = `${progress.applied}/${progress.total} (${progress.percent}%) completado`;
  }
};
