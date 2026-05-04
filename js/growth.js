/* ========================================
   BebeCare - Growth Tracking Module
   ======================================== */

const GrowthModule = {
  records: [],
  currentType: 'weight',

  init() {
    this.records = Storage.getGrowthRecords();
    this.bindEvents();
    this.render();
  },

  bindEvents() {
    document.getElementById('add-growth-btn').addEventListener('click', () => {
      this.showAddModal();
    });

    document.querySelectorAll('.growth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.growth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentType = tab.dataset.type;
        this.renderChart();
        this.updateIndicator();
      });
    });
  },

  showAddModal(editId = null) {
    const existing = editId ? this.records.find(r => r.id === editId) : null;
    const title = existing ? 'Editar Registro' : 'Nuevo Registro de Crecimiento';

    const modalBody = document.getElementById('modal-body');
    document.getElementById('modal-title').textContent = title;

    modalBody.innerHTML = `
      <form id="growth-form">
        <div class="form-group">
          <label for="growth-date">Fecha</label>
          <input type="date" id="growth-date" required value="${existing ? existing.date : Utils.getTodayString()}">
        </div>
        <div class="form-group">
          <label for="growth-weight">Peso (kg)</label>
          <input type="number" id="growth-weight" step="0.01" min="0.5" max="60" placeholder="Ej: 7.5" value="${existing ? existing.weight || '' : ''}">
        </div>
        <div class="form-group">
          <label for="growth-height">Altura (cm)</label>
          <input type="number" id="growth-height" step="0.1" min="30" max="180" placeholder="Ej: 68" value="${existing ? existing.height || '' : ''}">
        </div>
        <button type="submit" class="btn btn-primary btn-lg">${existing ? 'Guardar Cambios' : 'Agregar Registro'}</button>
      </form>
    `;

    document.getElementById('growth-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveRecord(editId);
    });

    App.openModal();
  },

  saveRecord(editId) {
    const date = document.getElementById('growth-date').value;
    const weight = parseFloat(document.getElementById('growth-weight').value) || null;
    const height = parseFloat(document.getElementById('growth-height').value) || null;

    if (!date || (!weight && !height)) {
      Utils.showToast('Ingresa al menos peso o altura', 'warning');
      return;
    }

    if (editId) {
      const idx = this.records.findIndex(r => r.id === editId);
      if (idx !== -1) {
        this.records[idx] = { ...this.records[idx], date, weight, height };
      }
      Utils.showToast('Registro actualizado', 'success');
    } else {
      this.records.push({
        id: Utils.generateId(),
        date, weight, height,
        created: Date.now()
      });
      Utils.showToast('Registro de crecimiento agregado', 'success');
    }

    Storage.saveGrowthRecords(this.records);
    this.render();
    App.closeModal();
    Dashboard.update();
  },

  deleteRecord(id) {
    this.records = this.records.filter(r => r.id !== id);
    Storage.saveGrowthRecords(this.records);
    this.render();
    Dashboard.update();
    Utils.showToast('Registro eliminado', 'info');
  },

  getLatestRecord() {
    if (this.records.length === 0) return null;
    return [...this.records].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  },

  getTrend(type) {
    const sorted = [...this.records]
      .filter(r => r[type] !== null && r[type] !== undefined)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (sorted.length < 2) return 'stable';

    const last = sorted[sorted.length - 1][type];
    const prev = sorted[sorted.length - 2][type];
    const diff = last - prev;

    if (Math.abs(diff) < 0.1) return 'stable';
    return diff > 0 ? 'up' : 'down';
  },

  renderChart() {
    const canvas = document.getElementById('growth-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = container.offsetWidth * dpr;
    canvas.height = container.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    const w = container.offsetWidth;
    const h = container.offsetHeight;

    ctx.clearRect(0, 0, w, h);

    const sorted = [...this.records]
      .filter(r => r[this.currentType] !== null && r[this.currentType] !== undefined)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (sorted.length < 2) {
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim();
      ctx.font = '14px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Necesitas al menos 2 registros para ver el grafico', w / 2, h / 2);
      return;
    }

    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const values = sorted.map(r => r[this.currentType]);
    const minVal = Math.min(...values) * 0.95;
    const maxVal = Math.max(...values) * 1.05;
    const range = maxVal - minVal || 1;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#A0A0B8' : '#6B7280';
    const gridColor = isDark ? '#2A2A45' : '#E5E7EB';
    const lineColor = '#6C63FF';
    const fillColor = isDark ? 'rgba(108, 99, 255, 0.15)' : 'rgba(108, 99, 255, 0.1)';

    // Grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartH / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      const val = maxVal - (range / gridLines) * i;
      ctx.fillStyle = textColor;
      ctx.font = '11px -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(val.toFixed(1), padding.left - 8, y + 4);
    }

    // Data points and line
    const points = sorted.map((r, i) => ({
      x: padding.left + (chartW / (sorted.length - 1)) * i,
      y: padding.top + chartH - ((r[this.currentType] - minVal) / range) * chartH
    }));

    // Fill area
    ctx.beginPath();
    ctx.moveTo(points[0].x, padding.top + chartH);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Points
    points.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = lineColor;
      ctx.fill();
      ctx.strokeStyle = isDark ? '#1A1A2E' : '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Date labels
      ctx.fillStyle = textColor;
      ctx.font = '10px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      const dateLabel = new Date(sorted[i].date + 'T12:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
      ctx.fillText(dateLabel, p.x, h - padding.bottom + 20);
    });

    // Unit label
    ctx.fillStyle = textColor;
    ctx.font = '12px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    const unit = this.currentType === 'weight' ? 'Peso (kg)' : 'Altura (cm)';
    ctx.fillText(unit, w / 2, h - 5);
  },

  updateIndicator() {
    const indicator = document.getElementById('growth-indicator');
    const trend = this.getTrend(this.currentType);
    const labels = {
      up: this.currentType === 'weight' ? '↑ Peso en aumento' : '↑ Altura en aumento',
      down: this.currentType === 'weight' ? '↓ Peso en descenso' : '↓ Altura en descenso',
      stable: this.currentType === 'weight' ? '→ Peso estable' : '→ Altura estable'
    };

    indicator.className = 'growth-indicator ' + trend;
    indicator.textContent = labels[trend];
  },

  render() {
    this.renderChart();
    this.updateIndicator();
    this.renderList();
  },

  renderList() {
    const list = document.getElementById('growth-list');

    if (this.records.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📏</div>
          <p>Sin registros de crecimiento</p>
          <span>Registra peso y altura periodicamente</span>
        </div>
      `;
      return;
    }

    const sorted = [...this.records].sort((a, b) => new Date(b.date) - new Date(a.date));

    list.innerHTML = sorted.map(r => `
      <div class="growth-card">
        <span class="growth-card-date">${Utils.formatDateShort(r.date)}</span>
        <div class="growth-card-values">
          <div class="growth-card-item">
            <div class="growth-card-item-label">Peso</div>
            <div class="growth-card-item-value">${r.weight ? r.weight + ' kg' : '-'}</div>
          </div>
          <div class="growth-card-item">
            <div class="growth-card-item-label">Altura</div>
            <div class="growth-card-item-value">${r.height ? r.height + ' cm' : '-'}</div>
          </div>
        </div>
        <div class="growth-card-actions">
          <button class="reminder-action-btn" onclick="GrowthModule.showAddModal('${r.id}')" title="Editar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="reminder-action-btn delete" onclick="GrowthModule.deleteRecord('${r.id}')" title="Eliminar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </div>
    `).join('');
  }
};
