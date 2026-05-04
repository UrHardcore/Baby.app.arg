/* ========================================
   BebeCare - Main Application
   ======================================== */

const App = {
  currentSection: 'dashboard',

  init() {
    this.initTheme();
    this.checkProfile();
    this.bindEvents();
  },

  initTheme() {
    const theme = Storage.getTheme();
    document.documentElement.setAttribute('data-theme', theme);
    this.updateThemeIcons(theme);
  },

  updateThemeIcons(theme) {
    const sunIcon = document.querySelector('.icon-sun');
    const moonIcon = document.querySelector('.icon-moon');
    if (theme === 'dark') {
      sunIcon?.classList.add('hidden');
      moonIcon?.classList.remove('hidden');
    } else {
      sunIcon?.classList.remove('hidden');
      moonIcon?.classList.add('hidden');
    }
  },

  checkProfile() {
    const profile = Storage.getBabyProfile();
    if (profile) {
      this.showApp();
    } else {
      this.showOnboarding();
    }
  },

  showOnboarding() {
    document.getElementById('onboarding').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');

    const maxDate = new Date().toISOString().split('T')[0];
    document.getElementById('baby-birthdate').setAttribute('max', maxDate);
  },

  showApp() {
    document.getElementById('onboarding').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');

    VaccineModule.init();
    ReminderModule.init();
    MedicalModule.init();
    GrowthModule.init();
    InfoModule.init();
    Dashboard.init();
  },

  bindEvents() {
    // Onboarding form
    document.getElementById('onboarding-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleOnboarding();
    });

    // Navigation
    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
      item.addEventListener('click', () => {
        this.navigateTo(item.dataset.section);
      });
    });

    // More menu
    const moreBtn = document.getElementById('nav-more-btn');
    const moreMenu = document.getElementById('more-menu');

    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      moreMenu.classList.toggle('hidden');
    });

    document.querySelector('.more-menu-overlay')?.addEventListener('click', () => {
      moreMenu.classList.add('hidden');
    });

    document.querySelectorAll('.more-menu-item').forEach(item => {
      item.addEventListener('click', () => {
        this.navigateTo(item.dataset.section);
        moreMenu.classList.add('hidden');
      });
    });

    // Dashboard card navigation
    document.querySelectorAll('.dash-card[data-nav]').forEach(card => {
      card.addEventListener('click', () => {
        this.navigateTo(card.dataset.nav);
      });
    });

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
      this.toggleTheme();
    });

    // Export
    document.getElementById('export-btn').addEventListener('click', () => {
      this.exportData();
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
      this.logout();
    });

    // Modal
    document.getElementById('modal-close').addEventListener('click', () => {
      this.closeModal();
    });

    document.querySelector('.modal-overlay')?.addEventListener('click', () => {
      this.closeModal();
    });

    // Edit profile
    document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
      this.showEditProfile();
    });

    // Resize handler for chart
    window.addEventListener('resize', Utils.debounce(() => {
      if (this.currentSection === 'growth') {
        GrowthModule.renderChart();
      }
    }, 250));

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
        document.getElementById('more-menu').classList.add('hidden');
      }
    });
  },

  handleOnboarding() {
    const name = document.getElementById('baby-name').value.trim();
    const birthDate = document.getElementById('baby-birthdate').value;
    const birthTime = document.getElementById('baby-birthtime').value;
    const birthWeight = parseFloat(document.getElementById('baby-weight').value);
    const gender = document.getElementById('baby-gender').value;

    if (!name || !birthDate || !birthWeight) return;

    const profile = {
      name,
      birthDate,
      birthTime,
      birthWeight,
      gender,
      created: Date.now()
    };

    Storage.saveBabyProfile(profile);
    this.showApp();
    Utils.showToast(`Bienvenido/a! Perfil de ${name} creado`, 'success');
  },

  navigateTo(section) {
    if (this.currentSection === section) return;

    this.currentSection = section;

    // Update sections visibility
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`section-${section}`);
    if (target) target.classList.add('active');

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navItem = document.querySelector(`.nav-item[data-section="${section}"]`);
    if (navItem) navItem.classList.add('active');

    // Re-render chart if growth section
    if (section === 'growth') {
      setTimeout(() => GrowthModule.renderChart(), 100);
    }

    // Scroll to top
    document.getElementById('app-main').scrollTo({ top: 0, behavior: 'smooth' });

    // Hide info content when navigating to info
    if (section === 'info') {
      InfoModule.hideCategory();
    }
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    Storage.saveTheme(next);
    this.updateThemeIcons(next);

    // Re-render chart with new colors
    if (this.currentSection === 'growth') {
      setTimeout(() => GrowthModule.renderChart(), 100);
    }
  },

  exportData() {
    const profile = Storage.getBabyProfile();
    if (!profile) {
      Utils.showToast('No hay datos para exportar', 'warning');
      return;
    }

    const data = Storage.exportAll();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mi_baby_arg_${profile.name.toLowerCase().replace(/\s+/g, '_')}_${Utils.getTodayString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    Utils.showToast('Datos exportados correctamente', 'success');
  },

  openModal() {
    document.getElementById('modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  },

  closeModal() {
    document.getElementById('modal').classList.add('hidden');
    document.body.style.overflow = '';
  },

  showEditProfile() {
    const profile = Storage.getBabyProfile();
    if (!profile) return;

    const modalBody = document.getElementById('modal-body');
    document.getElementById('modal-title').textContent = 'Editar Perfil';

    modalBody.innerHTML = `
      <form id="edit-profile-form">
        <div class="form-group">
          <label for="edit-name">Nombre</label>
          <input type="text" id="edit-name" required value="${profile.name}">
        </div>
        <div class="form-group">
          <label for="edit-birthdate">Fecha de nacimiento</label>
          <input type="date" id="edit-birthdate" required value="${profile.birthDate}">
        </div>
        <div class="form-group">
          <label for="edit-birthtime">Hora de nacimiento</label>
          <input type="time" id="edit-birthtime" value="${profile.birthTime || ''}">
        </div>
        <div class="form-group">
          <label for="edit-weight">Peso al nacer (kg)</label>
          <input type="number" id="edit-weight" step="0.01" min="0.5" max="7" required value="${profile.birthWeight}">
        </div>
        <div class="form-group">
          <label for="edit-gender">Sexo</label>
          <select id="edit-gender">
            <option value="girl" ${profile.gender === 'girl' ? 'selected' : ''}>Femenino</option>
            <option value="boy" ${profile.gender === 'boy' ? 'selected' : ''}>Masculino</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary btn-lg">Guardar Cambios</button>
        <button type="button" class="btn btn-danger btn-lg" style="margin-top: 8px;" onclick="App.resetApp()">Borrar Todos los Datos</button>
      </form>
    `;

    document.getElementById('edit-profile-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedProfile = {
        ...profile,
        name: document.getElementById('edit-name').value.trim(),
        birthDate: document.getElementById('edit-birthdate').value,
        birthTime: document.getElementById('edit-birthtime').value,
        birthWeight: parseFloat(document.getElementById('edit-weight').value),
        gender: document.getElementById('edit-gender').value
      };
      Storage.saveBabyProfile(updatedProfile);
      Dashboard.update();
      VaccineModule.render();
      this.closeModal();
      Utils.showToast('Perfil actualizado', 'success');
    });

    this.openModal();
  },

  logout() {
    if (confirm('¿Cerrar sesion? Volveras a la pantalla de inicio. Tus datos se mantendran guardados.')) {
      document.getElementById('app').classList.add('hidden');
      document.getElementById('onboarding').classList.remove('hidden');

      const profile = Storage.getBabyProfile();
      if (profile) {
        document.getElementById('baby-name').value = profile.name;
        document.getElementById('baby-birthdate').value = profile.birthDate;
        document.getElementById('baby-birthtime').value = profile.birthTime || '12:00';
        document.getElementById('baby-weight').value = profile.birthWeight;
        document.getElementById('baby-gender').value = profile.gender || 'girl';
      }

      this.currentSection = 'dashboard';
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      document.getElementById('section-dashboard')?.classList.add('active');
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      document.querySelector('.nav-item[data-section="dashboard"]')?.classList.add('active');
    }
  },

  resetApp() {
    if (confirm('¿Estas seguro? Se borraran TODOS los datos. Esta accion no se puede deshacer.')) {
      localStorage.clear();
      window.location.reload();
    }
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
