/* ========================================
   Mi Baby ARG - Main Application
   Firebase Auth + Firestore integration
   ======================================== */
 
const App = {
  currentSection: 'dashboard',
  authReady: false,
  isGuest: false,
 
  init() {
    this.initTheme();
    this.bindAuthEvents();
    this.checkGuestOrFirebase();
  },
 
  checkGuestOrFirebase() {
    const guestMode = localStorage.getItem('bebecare_guest_mode');
    if (guestMode === 'true') {
      this.isGuest = true;
      this.authReady = true;
      const profile = Storage.getBabyProfile();
      if (profile) {
        this.showApp();
        this.bindEvents();
      } else {
        this.showOnboarding();
        this.bindEvents();
      }
      this.waitForFirebase();
      return;
    }
    this.waitForFirebase();
  },
 
  waitForFirebase() {
    if (window.firebaseReady) {
      this.setupAuth();
    } else {
      document.addEventListener('firebase-ready', () => this.setupAuth());
      setTimeout(() => {
        if (!this.authReady) {
          this.showAuthScreen();
        }
      }, 5000);
    }
  },
 
  setupAuth() {
    window.FirebaseAuth.onAuthChanged(async (user) => {
      this.authReady = true;
      if (this.isGuest) return;
      if (user) {
        this.showLoadingScreen('Cargando datos...');
        const hasData = await Storage.loadFromFirebase();
        const profile = Storage.getBabyProfile();
        if (profile) {
          this.showApp();
          this.bindEvents();
        } else {
          this.showOnboarding();
          this.bindEvents();
        }
      } else {
        this.showAuthScreen();
      }
    });
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
 
  showLoadingScreen(text) {
    document.getElementById('loading-screen').classList.remove('hidden');
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('onboarding').classList.add('hidden');
    document.getElementById('app').classList.add('hidden');
    const p = document.querySelector('#loading-screen p');
    if (p && text) p.textContent = text;
  },
 
  showAuthScreen() {
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('onboarding').classList.add('hidden');
    document.getElementById('app').classList.add('hidden');
    this.showAuthWelcome();
  },
 
  showOnboarding() {
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('onboarding').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
 
    const maxDate = new Date().toISOString().split('T')[0];
    document.getElementById('baby-birthdate').setAttribute('max', maxDate);
  },
 
  showApp() {
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('onboarding').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
 
    VaccineModule.init();
    ReminderModule.init();
    MedicalModule.init();
    GrowthModule.init();
    InfoModule.init();
    Dashboard.init();
  },
 
  showAuthWelcome() {
    document.getElementById('auth-welcome').classList.remove('hidden');
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.add('hidden');
    this.clearAuthErrors();
  },
 
  bindAuthEvents() {
    // Welcome screen: show email login form
    document.getElementById('show-email-login')?.addEventListener('click', () => {
      document.getElementById('auth-welcome').classList.add('hidden');
      document.getElementById('login-form').classList.remove('hidden');
    });
 
    // Guest mode
    document.getElementById('guest-login-btn')?.addEventListener('click', () => {
      this.handleGuestLogin();
    });
 
    // Back to welcome from login/register
    document.getElementById('back-to-welcome-login')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showAuthWelcome();
    });
    document.getElementById('back-to-welcome-register')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showAuthWelcome();
    });
 
    // Toggle between login and register
    document.getElementById('show-register')?.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('login-form').classList.add('hidden');
      document.getElementById('register-form').classList.remove('hidden');
      this.clearAuthErrors();
    });
 
    document.getElementById('show-login')?.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('register-form').classList.add('hidden');
      document.getElementById('login-form').classList.remove('hidden');
      this.clearAuthErrors();
    });
 
    // Login form
    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleLogin();
    });
 
    // Register form
    document.getElementById('register-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleRegister();
    });
 
    // Google sign-in
    document.getElementById('google-login-btn')?.addEventListener('click', () => {
      this.handleGoogleLogin();
    });
  },
 
  clearAuthErrors() {
    document.getElementById('login-error')?.classList.add('hidden');
    document.getElementById('register-error')?.classList.add('hidden');
  },
 
  showAuthError(formId, message) {
    const el = document.getElementById(formId);
    if (el) {
      el.textContent = message;
      el.classList.remove('hidden');
    }
  },
 
  setAuthLoading(btnId, loading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    if (loading) {
      btn.disabled = true;
      btn.querySelector('span').textContent = 'Cargando...';
    } else {
      btn.disabled = false;
    }
  },
 
  getFirebaseErrorMessage(code) {
    const messages = {
      'auth/email-already-in-use': 'Este email ya esta registrado.',
      'auth/invalid-email': 'El email no es valido.',
      'auth/weak-password': 'La contrasena debe tener al menos 6 caracteres.',
      'auth/user-not-found': 'No existe una cuenta con este email.',
      'auth/wrong-password': 'Contrasena incorrecta.',
      'auth/too-many-requests': 'Demasiados intentos. Espera un momento.',
      'auth/invalid-credential': 'Email o contrasena incorrectos.',
      'auth/network-request-failed': 'Error de conexion. Verifica tu internet.'
    };
    return messages[code] || 'Ocurrio un error. Intenta nuevamente.';
  },
 
  async handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    this.clearAuthErrors();
 
    if (!email || !password) {
      this.showAuthError('login-error', 'Completa todos los campos.');
      return;
    }
 
    this.setAuthLoading('login-submit-btn', true);
    try {
      this.isGuest = false;
      localStorage.removeItem('bebecare_guest_mode');
      await window.FirebaseAuth.login(email, password);
    } catch (err) {
      this.showAuthError('login-error', this.getFirebaseErrorMessage(err.code));
      this.setAuthLoading('login-submit-btn', false);
      document.getElementById('login-submit-btn').querySelector('span').textContent = 'Iniciar Sesion';
    }
  },
 
  async handleRegister() {
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const password2 = document.getElementById('register-password2').value;
    this.clearAuthErrors();
 
    if (!name || !email || !password || !password2) {
      this.showAuthError('register-error', 'Completa todos los campos.');
      return;
    }
 
    if (password !== password2) {
      this.showAuthError('register-error', 'Las contrasenas no coinciden.');
      return;
    }
 
    if (password.length < 6) {
      this.showAuthError('register-error', 'La contrasena debe tener al menos 6 caracteres.');
      return;
    }
 
    this.setAuthLoading('register-submit-btn', true);
    try {
      await window.FirebaseAuth.register(email, password, name);
    } catch (err) {
      this.showAuthError('register-error', this.getFirebaseErrorMessage(err.code));
      this.setAuthLoading('register-submit-btn', false);
      document.getElementById('register-submit-btn').querySelector('span').textContent = 'Crear Cuenta';
    }
  },
 
  async handleGoogleLogin() {
    this.clearAuthErrors();
    const loginBtn = document.getElementById('google-login-btn');
    if (loginBtn) loginBtn.disabled = true;
 
    try {
      this.isGuest = false;
      localStorage.removeItem('bebecare_guest_mode');
      await window.FirebaseAuth.loginWithGoogle();
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        this.showAuthError('login-error', this.getFirebaseErrorMessage(err.code));
      }
    } finally {
      if (loginBtn) loginBtn.disabled = false;
    }
  },
 
  handleGuestLogin() {
    this.isGuest = true;
    localStorage.setItem('bebecare_guest_mode', 'true');
    const profile = Storage.getBabyProfile();
    if (profile) {
      this.showApp();
      this.bindEvents();
    } else {
      this.showOnboarding();
      this.bindEvents();
    }
  },
 
  bindEvents() {
    if (this._eventsBound) return;
    this._eventsBound = true;
 
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
  async handleOnboarding() {
    const name = document.getElementById('baby-name').value.trim();
    const lastName = document.getElementById('baby-lastname').value.trim();
    const birthDate = document.getElementById('baby-birthdate').value;
      created: Date.now()
    };
 
    Storage.saveBabyProfile(profile);
    Storage.saveBabyProfileLocal(profile);
    this.showLoadingScreen('Guardando perfil...');
    await Storage.syncNow();
    this.showApp();
    Utils.showToast(`Bienvenido/a! Perfil de ${name} ${lastName} creado`, 'success');
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
          <label for="edit-lastname">Apellido</label>
          <input type="text" id="edit-lastname" required value="${profile.lastName || ''}">
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
        lastName: document.getElementById('edit-lastname').value.trim(),
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
 
  async logout() {
    if (this.isGuest) {
      if (confirm('¿Cerrar sesion de invitado? Los datos de este dispositivo se mantendran.')) {
        localStorage.removeItem('bebecare_guest_mode');
        this.isGuest = false;
        this.showAuthScreen();
        this.showAuthWelcome();
      }
      return;
    }
    if (confirm('¿Cerrar sesion? Los datos quedaran guardados en la nube.')) {
      try {
        this.showLoadingScreen('Guardando datos...');
        await Storage.syncNow();
        Storage.clearLocal();
        await window.FirebaseAuth.logout();
      } catch (err) {
        console.warn('Logout error:', err);
        Storage.clearLocal();
        this.showAuthScreen();
        this.showAuthWelcome();
      }
    }
  },
 
  async resetApp() {
    if (confirm('¿Estas seguro? Se borraran TODOS los datos de tu bebe. Esta accion no se puede deshacer.')) {
      Storage.clearLocal();
      if (!this.isGuest) {
        const uid = window.FirebaseAuth.getUid();
        if (uid) {
          try {
            await window.FirebaseDB.saveAppData(uid, {
              profile: null,
              vaccines: {},
              reminders: [],
              medical: [],
              growth: [],
              lastSync: Date.now()
            });
          } catch (err) {
            console.warn('Reset error:', err);
          }
        }
      }
      this.showOnboarding();
    }
  }
};
 
// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});