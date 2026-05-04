/* ========================================
   BebeCare - Reminders Module
   ======================================== */

const ReminderModule = {
  reminders: [],

  init() {
    this.reminders = Storage.getReminders();
    this.bindEvents();
    this.render();
    this.checkDueReminders();
  },

  bindEvents() {
    document.getElementById('add-reminder-btn').addEventListener('click', () => {
      this.showAddModal();
    });
  },

  showAddModal(editId = null) {
    const existing = editId ? this.reminders.find(r => r.id === editId) : null;
    const title = existing ? 'Editar Recordatorio' : 'Nuevo Recordatorio';

    const modalBody = document.getElementById('modal-body');
    document.getElementById('modal-title').textContent = title;

    modalBody.innerHTML = `
      <form id="reminder-form">
        <div class="form-group">
          <label for="reminder-title">Titulo</label>
          <input type="text" id="reminder-title" placeholder="Ej: Turno con pediatra" required value="${existing ? existing.title : ''}">
        </div>
        <div class="form-group">
          <label for="reminder-type">Tipo</label>
          <select id="reminder-type">
            <option value="pediatra" ${existing?.type === 'pediatra' ? 'selected' : ''}>Turno con pediatra</option>
            <option value="medicacion" ${existing?.type === 'medicacion' ? 'selected' : ''}>Medicacion</option>
            <option value="evento" ${existing?.type === 'evento' ? 'selected' : ''}>Evento importante</option>
            <option value="otro" ${existing?.type === 'otro' ? 'selected' : ''}>Otro</option>
          </select>
        </div>
        <div class="form-group">
          <label for="reminder-date">Fecha</label>
          <input type="date" id="reminder-date" required value="${existing ? existing.date : Utils.getTodayString()}">
        </div>
        <div class="form-group">
          <label for="reminder-time">Hora (opcional)</label>
          <input type="time" id="reminder-time" value="${existing ? existing.time || '' : ''}">
        </div>
        <div class="form-group">
          <label for="reminder-notes">Notas (opcional)</label>
          <textarea id="reminder-notes" rows="3" placeholder="Detalles adicionales...">${existing ? existing.notes || '' : ''}</textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-lg">${existing ? 'Guardar Cambios' : 'Crear Recordatorio'}</button>
      </form>
    `;

    document.getElementById('reminder-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveReminder(editId);
    });

    App.openModal();
  },

  saveReminder(editId) {
    const title = document.getElementById('reminder-title').value.trim();
    const type = document.getElementById('reminder-type').value;
    const date = document.getElementById('reminder-date').value;
    const time = document.getElementById('reminder-time').value;
    const notes = document.getElementById('reminder-notes').value.trim();

    if (!title || !date) return;

    if (editId) {
      const idx = this.reminders.findIndex(r => r.id === editId);
      if (idx !== -1) {
        this.reminders[idx] = { ...this.reminders[idx], title, type, date, time, notes };
      }
      Utils.showToast('Recordatorio actualizado', 'success');
    } else {
      this.reminders.push({
        id: Utils.generateId(),
        title, type, date, time, notes,
        created: Date.now(),
        completed: false
      });
      Utils.showToast('Recordatorio creado', 'success');
    }

    Storage.saveReminders(this.reminders);
    this.render();
    App.closeModal();
    Dashboard.update();
  },

  deleteReminder(id) {
    this.reminders = this.reminders.filter(r => r.id !== id);
    Storage.saveReminders(this.reminders);
    this.render();
    Dashboard.update();
    Utils.showToast('Recordatorio eliminado', 'info');
  },

  toggleComplete(id) {
    const reminder = this.reminders.find(r => r.id === id);
    if (reminder) {
      reminder.completed = !reminder.completed;
      Storage.saveReminders(this.reminders);
      this.render();
      Dashboard.update();
    }
  },

  checkDueReminders() {
    const today = Utils.getTodayString();
    const dueReminders = this.reminders.filter(r => !r.completed && r.date <= today);
    if (dueReminders.length > 0) {
      setTimeout(() => {
        Utils.showToast(`Tienes ${dueReminders.length} recordatorio${dueReminders.length > 1 ? 's' : ''} pendiente${dueReminders.length > 1 ? 's' : ''}`, 'warning');
      }, 2000);
    }
  },

  getUpcomingReminders(limit = 3) {
    return this.reminders
      .filter(r => !r.completed)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, limit);
  },

  render() {
    const list = document.getElementById('reminder-list');

    if (this.reminders.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔔</div>
          <p>No hay recordatorios</p>
          <span>Agrega un recordatorio para no olvidar nada</span>
        </div>
      `;
      return;
    }

    const sorted = [...this.reminders].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return new Date(a.date) - new Date(b.date);
    });

    const typeIcons = {
      pediatra: '👨‍⚕️',
      medicacion: '💊',
      evento: '🎉',
      otro: '📌'
    };

    list.innerHTML = sorted.map(r => `
      <div class="reminder-card ${r.completed ? 'completed' : ''}" style="${r.completed ? 'opacity: 0.6;' : ''}">
        <div class="reminder-icon type-${r.type}">${typeIcons[r.type] || '📌'}</div>
        <div class="reminder-info">
          <div class="reminder-title" style="${r.completed ? 'text-decoration: line-through;' : ''}">${r.title}</div>
          <div class="reminder-date">${Utils.formatDate(r.date)}${r.time ? ' - ' + r.time : ''}${r.notes ? ' - ' + r.notes : ''}</div>
        </div>
        <div class="reminder-actions">
          <button class="reminder-action-btn" onclick="ReminderModule.toggleComplete('${r.id}')" title="${r.completed ? 'Desmarcar' : 'Completar'}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
          <button class="reminder-action-btn" onclick="ReminderModule.showAddModal('${r.id}')" title="Editar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="reminder-action-btn delete" onclick="ReminderModule.deleteReminder('${r.id}')" title="Eliminar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </div>
    `).join('');
  }
};
