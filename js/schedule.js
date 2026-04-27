/* Artesana del Barro - Schedule JS */

const schedules = [
  {
    id: 1,
    day: 'LUNES',
    timeRange: 'TARDE/NOCHE',
    category: 'Modelado',
    startTime: '14:00',
    endTime: '16:00',
    status: 'DISPONIBLE',
    availablePlaces: 7,
    maxPlaces: 10,
    level: 'Todos los niveles'
  },
  {
    id: 2,
    day: 'LUNES',
    timeRange: 'TARDE/NOCHE',
    category: 'Modelado',
    startTime: '18:30',
    endTime: '20:30',
    status: 'ULTIMO_CUPO',
    availablePlaces: 1,
    maxPlaces: 10,
    level: 'Todos los niveles'
  },
  {
    id: 3,
    day: 'MARTES',
    timeRange: 'MAÑANA',
    category: 'Alfarería',
    startTime: '09:30',
    endTime: '11:30',
    status: 'TURNO_COMPLETO',
    availablePlaces: 0,
    maxPlaces: 3,
    level: 'Inicial / Intermedio'
  },
  {
    id: 4,
    day: 'MARTES',
    timeRange: 'TARDE/NOCHE',
    category: 'Modelado',
    startTime: '18:30',
    endTime: '20:30',
    status: 'POCOS_CUPOS',
    availablePlaces: 3,
    maxPlaces: 10,
    level: 'Todos los niveles'
  },
  {
    id: 5,
    day: 'MIÉRCOLES',
    timeRange: 'TARDE/NOCHE',
    category: 'Modelado',
    startTime: '16:00',
    endTime: '18:00',
    status: 'ULTIMO_CUPO',
    availablePlaces: 1,
    maxPlaces: 10,
    level: 'Todos los niveles'
  },
  {
    id: 6,
    day: 'MIÉRCOLES',
    timeRange: 'TARDE/NOCHE',
    category: 'Modelado',
    startTime: '18:00',
    endTime: '20:00',
    status: 'POCOS_CUPOS',
    availablePlaces: 3,
    maxPlaces: 10,
    level: 'Todos los niveles'
  },
  {
    id: 7,
    day: 'JUEVES',
    timeRange: 'TARDE/NOCHE',
    category: 'Modelado',
    startTime: '15:30',
    endTime: '17:30',
    status: 'TURNO_COMPLETO',
    availablePlaces: 0,
    maxPlaces: 10,
    level: 'Todos los niveles'
  },
  {
    id: 8,
    day: 'JUEVES',
    timeRange: 'TARDE/NOCHE',
    category: 'Modelado',
    startTime: '18:00',
    endTime: '20:00',
    status: 'ULTIMO_CUPO',
    availablePlaces: 1,
    maxPlaces: 10,
    level: 'Todos los niveles'
  },
  {
    id: 9,
    day: 'VIERNES',
    timeRange: 'TARDE/NOCHE',
    category: 'Alfarería',
    startTime: '14:00',
    endTime: '16:00',
    status: 'ULTIMO_CUPO',
    availablePlaces: 1,
    maxPlaces: 4,
    level: 'Intermedio'
  },
  {
    id: 10,
    day: 'VIERNES',
    timeRange: 'TARDE/NOCHE',
    category: 'Modelado',
    startTime: '18:30',
    endTime: '20:30',
    status: 'TURNO_COMPLETO',
    availablePlaces: 0,
    maxPlaces: 7,
    level: 'Todos los niveles'
  },
  {
    id: 11,
    day: 'SÁBADO',
    timeRange: 'MAÑANA',
    category: 'Modelado',
    startTime: '11:00',
    endTime: '13:00',
    status: 'TURNO_COMPLETO',
    availablePlaces: 0,
    maxPlaces: 10,
    level: 'Todos los niveles'
  },
  {
    id: 12,
    day: 'SÁBADO',
    timeRange: 'TARDE/NOCHE',
    category: 'Modelado',
    startTime: '14:00',
    endTime: '16:00',
    status: 'TURNO_COMPLETO',
    availablePlaces: 0,
    maxPlaces: 10,
    level: 'Todos los niveles'
  }
];

const DAYS = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];

/* Map status codes to display labels with correct accents */
function statusLabel(status) {
  const labels = {
    'DISPONIBLE':    'Disponible',
    'POCOS_CUPOS':   'Pocos Cupos',
    'ÚLTIMO_CUPO':   'Último Cupo',
    'ULTIMO_CUPO':   'Último Cupo',
    'TURNO_COMPLETO':'Turno Completo'
  };
  return labels[status] || status.replace(/_/g, ' ');
}

let currentCategory = 'Todos';
let currentTimeRange = 'Todos';

function initSchedule() {
  const categoryFilters = document.querySelectorAll('[data-filter-cat]');
  const timeFilters = document.querySelectorAll('[data-filter-time]');

  categoryFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter-cat');
      render();
    });
  });

  timeFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      timeFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTimeRange = btn.getAttribute('data-filter-time');
      render();
    });
  });

  render();
}

function filterSchedules() {
  return schedules.filter(item => {
    const catMatch = currentCategory === 'Todos' || item.category.includes(currentCategory);
    const timeMatch = currentTimeRange === 'Todos' || item.timeRange === currentTimeRange;
    return catMatch && timeMatch;
  });
}

function render() {
  const filtered = filterSchedules();
  renderDesktop(filtered);
  renderMobile(filtered);
}

function renderDesktop(data) {
  const weekView = document.getElementById('week-view');
  if (!weekView) return;
  weekView.innerHTML = '';

  DAYS.forEach(day => {
    const dayColumn = document.createElement('div');
    dayColumn.className = 'day-column animate-fade-in';

    const daySchedules = data.filter(s => s.day === day);

    const header = document.createElement('div');
    header.className = 'day-header';
    header.innerHTML = `<h3>${day}</h3>`;
    dayColumn.appendChild(header);

    ['MAÑANA', 'TARDE/NOCHE'].forEach(range => {
      const rangeSchedules = daySchedules.filter(s => s.timeRange === range);
      if (rangeSchedules.length > 0) {
        rangeSchedules.forEach(s => {
          const card = document.createElement('div');
          card.className = `schedule-card card-status-${s.status.toLowerCase()}`;
          card.onclick = () => openModal(s);
          card.innerHTML = `
            <div>
              <div class="card-time">${s.startTime} - ${s.endTime}</div>
              <div class="card-category">${s.category}</div>
            </div>
            <div class="status-badge status-${s.status.toLowerCase()}">
              <span class="status-dot"></span>
              ${statusLabel(s.status)}
            </div>
          `;
          dayColumn.appendChild(card);
        });
      }
    });

    weekView.appendChild(dayColumn);
  });
}

function renderMobile(data) {
  const container = document.getElementById('day-accordion-list'); // Keeping existing ID for compatibility
  if (!container) return;
  container.innerHTML = '';

  DAYS.forEach(day => {
    const daySchedules = data.filter(s => s.day === day);
    if (daySchedules.length === 0) return; // Hide empty days

    const daySection = document.createElement('div');
    daySection.className = 'mobile-day-section';

    const header = document.createElement('div');
    header.className = 'mobile-day-header';
    header.innerHTML = `<h3>${day}</h3>`;
    daySection.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'mobile-grid';

    daySchedules.forEach(s => {
      const card = document.createElement('div');
      card.className = `schedule-card card-status-${s.status.toLowerCase()}`;
      card.onclick = () => openModal(s);
      card.innerHTML = `
        <div class="card-time">${s.startTime} - ${s.endTime}</div>
        <div class="card-category">${s.category}</div>
        <div class="status-badge status-${s.status.toLowerCase()}">
          ${statusLabel(s.status)}
        </div>
      `;
      grid.appendChild(card);
    });

    daySection.appendChild(grid);
    container.appendChild(daySection);
  });
}

let selectedSchedule = null;

function openModal(schedule) {
  selectedSchedule = schedule;
  const modal = document.getElementById('schedule-modal');
  
  // Fill text fields
  document.getElementById('m-title').innerText = schedule.category;
  document.getElementById('m-subtitle').innerText = `${schedule.day} de ${schedule.startTime} - ${schedule.endTime}hs`;
  
  // Set plan static text
  const planDisplay = document.getElementById('m-plan-display');
  
  if (schedule.category.toLowerCase().includes('modelado')) {
    planDisplay.innerText = 'Plan Taller ($72.000)';
  } else if (schedule.category.toLowerCase().includes('alfarería') || schedule.category.toLowerCase().includes('alfareria')) {
    planDisplay.innerText = 'Plan Fusión ($84.000)';
  } else {
    planDisplay.innerText = 'Consultar Plan';
  }
  
  // Reset form
  document.getElementById('modal-form').reset();

  modal.classList.add('active');
}

function handleBooking(event) {
  event.preventDefault();

  var name     = document.getElementById('m-name').value;
  var email    = document.getElementById('m-email').value;
  var whatsapp = document.getElementById('m-whatsapp').value;
  var plan     = document.getElementById('m-plan-display').innerText;

  if (!selectedSchedule) return;

  var message = '\u00a1Hola! Me gustar\u00eda reservar un lugar:\n\n'
    + '\uD83D\uDC64 Nombre: ' + name + '\n'
    + '\u2709\uFE0F Email: ' + email + '\n'
    + '\uD83D\uDCF1 WhatsApp: ' + whatsapp + '\n'
    + '\uD83C\uDFA8 Clase: ' + selectedSchedule.category + '\n'
    + '\uD83D\uDCC5 D\u00eda: ' + selectedSchedule.day + '\n'
    + '\u23F0 Horario: ' + selectedSchedule.startTime + ' - ' + selectedSchedule.endTime + 'hs\n'
    + '\uD83D\uDC8E Plan: ' + plan;

  try {
    var waUrl = 'https://wa.me/5491156206435?text=' + encodeURIComponent(message);
    window.open(waUrl, '_blank');
    closeModal();
  } catch(err) {
    console.error('Error:', err);
  }
}

function closeModal() {
  document.getElementById('schedule-modal').classList.remove('active');
}

window.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
document.addEventListener('click', e => {
  const modal = document.getElementById('schedule-modal');
  if (e.target === modal) closeModal();
});

document.addEventListener('DOMContentLoaded', initSchedule);
