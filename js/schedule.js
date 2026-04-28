/* Artesana del Barro - schedule.js (optimizado) */

const schedules = [
  { id: 1,  day: 'LUNES',     timeRange: 'TARDE/NOCHE', category: 'Modelado',  startTime: '14:00', endTime: '16:00', status: 'DISPONIBLE',    availablePlaces: 7, maxPlaces: 10, level: 'Todos los niveles' },
  { id: 2,  day: 'LUNES',     timeRange: 'TARDE/NOCHE', category: 'Modelado',  startTime: '18:30', endTime: '20:30', status: 'ULTIMO_CUPO',    availablePlaces: 1, maxPlaces: 10, level: 'Todos los niveles' },
  { id: 3,  day: 'MARTES',    timeRange: 'MAÑANA',       category: 'Alfarería', startTime: '09:30', endTime: '11:30', status: 'TURNO_COMPLETO', availablePlaces: 0, maxPlaces: 3,  level: 'Inicial / Intermedio' },
  { id: 4,  day: 'MARTES',    timeRange: 'TARDE/NOCHE', category: 'Modelado',  startTime: '18:30', endTime: '20:30', status: 'POCOS_CUPOS',   availablePlaces: 3, maxPlaces: 10, level: 'Todos los niveles' },
  { id: 5,  day: 'MIÉRCOLES', timeRange: 'TARDE/NOCHE', category: 'Modelado',  startTime: '16:00', endTime: '18:00', status: 'ULTIMO_CUPO',    availablePlaces: 1, maxPlaces: 10, level: 'Todos los niveles' },
  { id: 6,  day: 'MIÉRCOLES', timeRange: 'TARDE/NOCHE', category: 'Modelado',  startTime: '18:00', endTime: '20:00', status: 'POCOS_CUPOS',   availablePlaces: 3, maxPlaces: 10, level: 'Todos los niveles' },
  { id: 7,  day: 'JUEVES',    timeRange: 'TARDE/NOCHE', category: 'Modelado',  startTime: '15:30', endTime: '17:30', status: 'TURNO_COMPLETO', availablePlaces: 0, maxPlaces: 10, level: 'Todos los niveles' },
  { id: 8,  day: 'JUEVES',    timeRange: 'TARDE/NOCHE', category: 'Modelado',  startTime: '18:00', endTime: '20:00', status: 'ULTIMO_CUPO',    availablePlaces: 1, maxPlaces: 10, level: 'Todos los niveles' },
  { id: 9,  day: 'VIERNES',   timeRange: 'TARDE/NOCHE', category: 'Alfarería', startTime: '14:00', endTime: '16:00', status: 'ULTIMO_CUPO',    availablePlaces: 1, maxPlaces: 4,  level: 'Intermedio' },
  { id: 10, day: 'VIERNES',   timeRange: 'TARDE/NOCHE', category: 'Modelado',  startTime: '18:30', endTime: '20:30', status: 'TURNO_COMPLETO', availablePlaces: 0, maxPlaces: 7,  level: 'Todos los niveles' },
  { id: 11, day: 'SÁBADO',    timeRange: 'MAÑANA',       category: 'Modelado',  startTime: '11:00', endTime: '13:00', status: 'TURNO_COMPLETO', availablePlaces: 0, maxPlaces: 10, level: 'Todos los niveles' },
  { id: 12, day: 'SÁBADO',    timeRange: 'TARDE/NOCHE', category: 'Modelado',  startTime: '14:00', endTime: '16:00', status: 'TURNO_COMPLETO', availablePlaces: 0, maxPlaces: 10, level: 'Todos los niveles' }
];

const DAYS = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];

const STATUS_LABELS = {
  'DISPONIBLE':    'Disponible',
  'POCOS_CUPOS':   'Pocos Cupos',
  'ÚLTIMO_CUPO':   'Último Cupo',
  'ULTIMO_CUPO':   'Último Cupo',
  'TURNO_COMPLETO':'Turno Completo'
};

function statusLabel(status) {
  return STATUS_LABELS[status] || status.replace(/_/g, ' ');
}

// ── Estado de filtros ────────────────────────────────────────────────────────
let currentCategory  = 'Todos';
let currentTimeRange = 'Todos';

// ── Init ─────────────────────────────────────────────────────────────────────
function initSchedule() {
  // Filtros por categoría
  document.querySelectorAll('[data-filter-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter-cat]').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      currentCategory = btn.getAttribute('data-filter-cat');
      render();
    });
  });

  // Filtros por turno
  document.querySelectorAll('[data-filter-time]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter-time]').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      currentTimeRange = btn.getAttribute('data-filter-time');
      render();
    });
  });

  render();
}

function filterSchedules() {
  return schedules.filter(item => {
    const catMatch  = currentCategory  === 'Todos' || item.category.includes(currentCategory);
    const timeMatch = currentTimeRange === 'Todos' || item.timeRange === currentTimeRange;
    return catMatch && timeMatch;
  });
}

function render() {
  const filtered = filterSchedules();
  renderDesktop(filtered);
  renderMobile(filtered);
}

// ── Construcción de card (reutilizable) ──────────────────────────────────────
function buildCard(s) {
  const card = document.createElement('div');
  card.className = `schedule-card card-status-${s.status.toLowerCase()}`;
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `${s.category} ${s.day} ${s.startTime} - ${s.endTime} - ${statusLabel(s.status)}`);
  card.innerHTML = `
    <div>
      <div class="card-time">${s.startTime} - ${s.endTime}</div>
      <div class="card-category">${s.category}</div>
    </div>
    <div class="status-badge status-${s.status.toLowerCase()}">
      <span class="status-dot" aria-hidden="true"></span>
      ${statusLabel(s.status)}
    </div>`;

  const open = () => openModal(s);
  card.addEventListener('click', open);
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  return card;
}

// ── Desktop ──────────────────────────────────────────────────────────────────
function renderDesktop(data) {
  const weekView = document.getElementById('week-view');
  if (!weekView) return;

  // Usar fragment para un solo reflow
  const frag = document.createDocumentFragment();

  DAYS.forEach(day => {
    const col = document.createElement('div');
    col.className = 'day-column animate-fade-in';
    col.setAttribute('role', 'rowgroup');

    const header = document.createElement('div');
    header.className = 'day-header';
    header.innerHTML = `<h3>${day}</h3>`;
    col.appendChild(header);

    data.filter(s => s.day === day).forEach(s => col.appendChild(buildCard(s)));
    frag.appendChild(col);
  });

  weekView.innerHTML = '';
  weekView.appendChild(frag);
}

// ── Mobile ───────────────────────────────────────────────────────────────────
function renderMobile(data) {
  const container = document.getElementById('day-accordion-list');
  if (!container) return;

  const frag = document.createDocumentFragment();

  DAYS.forEach(day => {
    const daySchedules = data.filter(s => s.day === day);
    if (!daySchedules.length) return;

    const section = document.createElement('div');
    section.className = 'mobile-day-section';

    const header = document.createElement('div');
    header.className = 'mobile-day-header';
    header.innerHTML = `<h3>${day}</h3>`;
    section.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'mobile-grid';
    daySchedules.forEach(s => grid.appendChild(buildCard(s)));
    section.appendChild(grid);
    frag.appendChild(section);
  });

  container.innerHTML = '';
  container.appendChild(frag);
}

// ── Modal ─────────────────────────────────────────────────────────────────────
window.selectedSchedule = null;

function openModal(schedule) {
  window.selectedSchedule = schedule;
  const modal = document.getElementById('schedule-modal');

  document.getElementById('m-title').textContent   = schedule.category;
  document.getElementById('m-subtitle').textContent = `${schedule.day} de ${schedule.startTime} - ${schedule.endTime}hs`;

  const planDisplay = document.getElementById('m-plan-display');
  const cat = schedule.category.toLowerCase();
  if (cat.includes('modelado')) {
    planDisplay.textContent = 'Plan Taller ($72.000)';
  } else if (cat.includes('alfarería') || cat.includes('alfareria')) {
    planDisplay.textContent = 'Plan Fusión ($84.000)';
  } else {
    planDisplay.textContent = 'Consultar Plan';
  }

  document.getElementById('modal-form').reset();
  modal.classList.add('active');

  // Focus al primer campo para accesibilidad
  setTimeout(() => document.getElementById('m-name').focus(), 100);
}

window.closeModal = function () {
  document.getElementById('schedule-modal').classList.remove('active');
};

// Cerrar con Escape o click fuera
window.addEventListener('keydown', e => { if (e.key === 'Escape') window.closeModal(); });
document.addEventListener('click', e => {
  const modal = document.getElementById('schedule-modal');
  if (e.target === modal) window.closeModal();
});

document.addEventListener('DOMContentLoaded', initSchedule);
