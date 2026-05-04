/* ========================================
   BebeCare - Utility Functions
   ======================================== */

const Utils = {
  calculateAge(birthDate) {
    const now = new Date();
    const birth = new Date(birthDate);
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  },

  getAgeInMonths(birthDate) {
    const age = this.calculateAge(birthDate);
    return age.years * 12 + age.months + (age.days / 30);
  },

  getAgeInDays(birthDate) {
    const now = new Date();
    const birth = new Date(birthDate);
    const diff = now.getTime() - birth.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  },

  formatAge(birthDate) {
    const age = this.calculateAge(birthDate);
    const parts = [];
    if (age.years > 0) parts.push(`${age.years} ${age.years === 1 ? 'ano' : 'anos'}`);
    if (age.months > 0) parts.push(`${age.months} ${age.months === 1 ? 'mes' : 'meses'}`);
    if (age.days > 0 || parts.length === 0) parts.push(`${age.days} ${age.days === 1 ? 'dia' : 'dias'}`);
    return parts.join(', ');
  },

  formatShortAge(birthDate) {
    const age = this.calculateAge(birthDate);
    if (age.years > 0) return `${age.years}a ${age.months}m`;
    if (age.months > 0) return `${age.months}m ${age.days}d`;
    return `${age.days} dias`;
  },

  formatDate(dateStr) {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  },

  formatDateShort(dateStr) {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  },

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
  },

  getVaccineDueDate(birthDate, ageMonths, ageDays) {
    const birth = new Date(birthDate);
    const dueDate = new Date(birth);
    dueDate.setMonth(dueDate.getMonth() + ageMonths);
    dueDate.setDate(dueDate.getDate() + ageDays);
    return dueDate;
  },

  isOverdue(dueDate) {
    return new Date() > new Date(dueDate);
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
      info: '💡',
      success: '✓',
      warning: '⚠',
      error: '✕'
    };

    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s ease-out forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },

  getTodayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  getDailyTip() {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
  }
};
