/* ========================================
   BebeCare - Medical History Module
   ======================================== */

const MedicalModule = {
  records: [],

  init() {
    this.records = Storage.getMedicalRecords();
    this.bindEvents();
    this.render();
  },

  bindEvents() {
    document.getElementById('add-medical-btn').addEventListener('click', () => {
      this.showAddModal();
    });
  },

  showAddModal(editId = null) {
    const existing = editId ? this.records.find(r => r.id === editId) : null;
    const title = existing ? 'Editar Registro' : 'Nuevo Registro Medico';

    const modalBody = document.getElementById('modal-body');
    document.getElementById('modal-title').textContent = title;

    modalBody.innerHTML = `
      <form id="medical-form">
        <div class="form-group">
          <label for="medical-date">Fecha</label>
          <input type="date" id="medical-date" required value="${existing ? existing.date : Utils.getTodayString()}">
        </div>
        <div class="form-group">
          <label for="medical-description">Descripcion</label>
          <textarea id="medical-description" rows="4" placeholder="Ej: Control de rutina, peso 7.5kg, talla 68cm. Todo normal." required>${existing ? existing.description : ''}</textarea>
        </div>
        <div class="form-group">
          <label for="medical-professional">Profesional (opcional)</label>
          <input type="text" id="medical-professional" placeholder="Ej: Dra. Martinez" value="${existing ? existing.professional || '' : ''}">
        </div>
        <button type="submit" class="btn btn-primary btn-lg">${existing ? 'Guardar Cambios' : 'Agregar Registro'}</button>
      </form>
    `;

    document.getElementById('medical-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveRecord(editId);
    });

    App.openModal();
  },

  saveRecord(editId) {
    const date = document.getElementById('medical-date').value;
    const description = document.getElementById('medical-description').value.trim();
    const professional = document.getElementById('medical-professional').value.trim();

    if (!date || !description) return;

    if (editId) {
      const idx = this.records.findIndex(r => r.id === editId);
      if (idx !== -1) {
        this.records[idx] = { ...this.records[idx], date, description, professional };
      }
      Utils.showToast('Registro actualizado', 'success');
    } else {
      this.records.push({
        id: Utils.generateId(),
        date, description, professional,
        created: Date.now()
      });
      Utils.showToast('Registro medico agregado', 'success');
    }

    Storage.saveMedicalRecords(this.records);
    this.render();
    App.closeModal();
    Dashboard.update();
  },

  deleteRecord(id) {
    this.records = this.records.filter(r => r.id !== id);
    Storage.saveMedicalRecords(this.records);
    this.render();
    Dashboard.update();
    Utils.showToast('Registro eliminado', 'info');
  },

  getLastRecord() {
    if (this.records.length === 0) return null;
    return [...this.records].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  },

  render() {
    const list = document.getElementById('medical-list');

    if (this.records.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🏥</div>
          <p>Sin registros medicos</p>
          <span>Registra las consultas y eventos medicos</span>
        </div>
      `;
      return;
    }

    const sorted = [...this.records].sort((a, b) => new Date(b.date) - new Date(a.date));

    list.innerHTML = sorted.map(r => `
      <div class="medical-card">
        <div class="medical-card-header">
          <span class="medical-date">${Utils.formatDate(r.date)}</span>
          <div class="medical-card-actions">
            <button class="reminder-action-btn" onclick="MedicalModule.showAddModal('${r.id}')" title="Editar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="reminder-action-btn delete" onclick="MedicalModule.deleteRecord('${r.id}')" title="Eliminar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
          </div>
        </div>
        <p class="medical-description">${r.description}</p>
        ${r.professional ? `<p class="medical-professional">👨‍⚕️ ${r.professional}</p>` : ''}
      </div>
    `).join('');
  }
};
