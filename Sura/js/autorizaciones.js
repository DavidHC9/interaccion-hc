/* ==========================================================================
   EPS SURA - Módulo de Radicación y Seguimiento de Autorizaciones
   ========================================================================== */

const SURA_AUTORIZACIONES = (function () {
  // Base de datos simulada de autorizaciones
  let authorizationsDB = {
    'AUT-2026-8819': {
      id: 'AUT-2026-8819',
      servicio: 'Resonancia Magnética de Rodilla Izquierda',
      ordenante: 'Dr. Roberto Mendoza (Ortopedia)',
      fechaRadicacion: '18 de Agosto, 2026',
      estado: 'Aprobado',
      prestador: 'Ayudas Diagnósticas SURA S.A.S.',
      vigencia: '18/08/2026 al 18/11/2026',
      steps: [
        { label: 'Radicado Exitosamente', status: 'done', detail: '18 Ago 2026 - 08:30 AM' },
        { label: 'Auditoría Médica Completa', status: 'done', detail: '18 Ago 2026 - 11:15 AM' },
        { label: 'Autorización Aprobada', status: 'done', detail: '18 Ago 2026 - 02:40 PM' },
        { label: 'Disponible para Impresión / Cita', status: 'current', detail: 'Listo para agendar' }
      ]
    },
    'AUT-2026-9042': {
      id: 'AUT-2026-9042',
      servicio: 'Terapia Física Integral (10 Sesiones)',
      ordenante: 'Dra. María Jaramillo',
      fechaRadicacion: '19 de Agosto, 2026',
      estado: 'En Validación',
      prestador: 'IPS Fisiomed SURA',
      vigencia: 'En proceso de aprobación',
      steps: [
        { label: 'Radicado Exitosamente', status: 'done', detail: '19 Ago 2026 - 09:00 AM' },
        { label: 'En Evaluación Auditoría Médica', status: 'current', detail: 'Tiempo estimado: 24 - 48 horas' },
        { label: 'Aprobación y Generación de Orden', status: 'pending', detail: 'Pendiente' }
      ]
    }
  };

  function init() {
    bindEvents();
  }

  function bindEvents() {
    const searchForm = document.getElementById('search-auth-form');
    if (searchForm) {
      searchForm.addEventListener('submit', handleSearchAuth);
    }

    const newAuthForm = document.getElementById('new-auth-form');
    if (newAuthForm) {
      newAuthForm.addEventListener('submit', handleNewAuthSubmit);
    }
  }

  function handleSearchAuth(e) {
    e.preventDefault();
    const codeInput = document.getElementById('auth-search-code').value.trim().toUpperCase();
    const resultBox = document.getElementById('auth-search-result');

    if (!codeInput) {
      alert('Ingresa el código de radicado para realizar la consulta.');
      return;
    }

    const auth = authorizationsDB[codeInput];
    if (!auth) {
      if (resultBox) {
        resultBox.innerHTML = `
          <div style="padding:1.5rem; text-align:center; background:rgba(224,60,49,0.1); border-radius:var(--radius-md); border:1px solid var(--sura-red); color:var(--sura-red);">
            <i class="fas fa-exclamation-triangle" style="font-size:1.5rem; margin-bottom:0.5rem;"></i>
            <p><strong>Radicado no encontrado:</strong> No hallamos información para el número ${codeInput}. Por favor verifica el número o radica una nueva solicitud.</p>
          </div>
        `;
      }
      return;
    }

    renderAuthDetails(auth, resultBox);
  }

  function renderAuthDetails(auth, container) {
    if (!container) return;

    let badgeClass = 'badge-info';
    if (auth.estado === 'Aprobado') badgeClass = 'badge-success';
    if (auth.estado === 'En Validación') badgeClass = 'badge-warning';

    container.innerHTML = `
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.5rem; margin-top:1rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border-color); padding-bottom:0.75rem;">
          <div>
            <span class="badge ${badgeClass}"><i class="fas fa-info-circle"></i> Estado: ${auth.estado}</span>
            <h4 style="color:var(--sura-navy); margin-top:0.3rem;">${auth.servicio}</h4>
            <small style="color:var(--text-muted);">Radicado: <strong>${auth.id}</strong> | Radicado el: ${auth.fechaRadicacion}</small>
          </div>
          ${auth.estado === 'Aprobado' ? `
            <button class="btn-primary" style="padding:0.5rem 1rem; font-size:0.85rem;" onclick="SURA_AUTORIZACIONES.downloadPDF('${auth.id}')">
              <i class="fas fa-download"></i> Descargar Orden
            </button>
          ` : ''}
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; font-size:0.9rem; margin-bottom:1.5rem;">
          <div><strong>Médico Ordenante:</strong> <br><span style="color:var(--text-secondary);">${auth.ordenante}</span></div>
          <div><strong>IPS / Prestador Asignado:</strong> <br><span style="color:var(--text-secondary);">${auth.prestador}</span></div>
          <div><strong>Vigencia del Servicio:</strong> <br><span style="color:var(--text-secondary);">${auth.vigencia}</span></div>
        </div>

        <h5 style="color:var(--sura-navy); margin-bottom:0.5rem;">Línea de Tiempo de Auditoría</h5>
        <div class="tracking-timeline">
          ${auth.steps.map(s => `
            <div class="timeline-item ${s.status}">
              <div class="timeline-icon"><i class="fas ${s.status === 'done' ? 'fa-check' : 'fa-clock'}"></i></div>
              <div class="timeline-content">
                <h5>${s.label}</h5>
                <p>${s.detail}</p>
              </div>
            </div>
          `).map(item => item).join('')}
        </div>
      </div>
    `;
  }

  function handleNewAuthSubmit(e) {
    e.preventDefault();
    const serviceName = document.getElementById('new-auth-service').value;
    const doctorName = document.getElementById('new-auth-doctor').value;

    if (!serviceName || !doctorName) {
      alert('Completa los campos obligatorios para radicar la autorización.');
      return;
    }

    const newCode = `AUT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    authorizationsDB[newCode] = {
      id: newCode,
      servicio: serviceName,
      ordenante: doctorName,
      fechaRadicacion: 'Hoy (19 de Agosto, 2026)',
      estado: 'En Validación',
      prestador: 'IPS Especializada SURA',
      vigencia: 'En proceso de aprobación auditoría',
      steps: [
        { label: 'Radicado Exitosamente', status: 'done', detail: 'Hoy - Radicado en línea' },
        { label: 'Auditoría Médica EPS SURA', status: 'current', detail: 'En revisión clínica (24h)' },
        { label: 'Aprobación Final', status: 'pending', detail: 'Pendiente' }
      ]
    };

    if (window.SURA_APP) {
      window.SURA_APP.closeModal('modal-radicar-auth');
      window.SURA_APP.showNotification(`¡Solicitud radicada con éxito! Tu código es ${newCode}`, 'success');
    }

    // Auto cargar resultado en la vista
    document.getElementById('auth-search-code').value = newCode;
    renderAuthDetails(authorizationsDB[newCode], document.getElementById('auth-search-result'));
  }

  function downloadPDF(id) {
    if (window.SURA_APP) {
      window.SURA_APP.showNotification(`Generando descarga de orden médica ${id}...`, 'info');
    }
  }

  return {
    init: init,
    downloadPDF: downloadPDF
  };
})();

document.addEventListener('DOMContentLoaded', SURA_AUTORIZACIONES.init);
