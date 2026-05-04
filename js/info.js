/* ========================================
   BebeCare - Information Module
   ======================================== */

const InfoModule = {
  currentCategory: null,

  init() {
    this.bindEvents();
  },

  bindEvents() {
    document.querySelectorAll('.info-card').forEach(card => {
      card.addEventListener('click', () => {
        const category = card.dataset.info;
        this.showCategory(category);

        document.querySelectorAll('.info-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });
  },

  showCategory(category) {
    this.currentCategory = category;
    const data = INFO_CONTENT[category];
    if (!data) return;

    const content = document.getElementById('info-content');

    content.innerHTML = `
      <button class="info-back-btn" onclick="InfoModule.hideCategory()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Volver a categorias
      </button>
      <h3 style="font-size: 20px; font-weight: 800; margin-bottom: 20px;">${data.title}</h3>
      ${data.sections.map(section => `
        <div class="info-section">
          <h3>${section.title}</h3>
          ${section.content}
        </div>
      `).join('')}
    `;

    document.getElementById('info-categories').style.display = 'none';
    content.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  hideCategory() {
    this.currentCategory = null;
    document.getElementById('info-content').innerHTML = '';
    document.getElementById('info-categories').style.display = '';
    document.querySelectorAll('.info-card').forEach(c => c.classList.remove('active'));
  }
};
