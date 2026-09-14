/* ==========================================================================
   EPS SURA - Módulo Interactivo de Agendamiento de Citas Médicas
   ========================================================================== */

const SURA_CITAS = (function () {
  let currentStep = 1;
  let selectedAppointment = {
    especialidad: '',
    profesional: '',
    sede: '',
    fecha: '',
    hora: ''
  };

  // Citas agendadas en memoria simulada
  let userAppointments = [
    {
      id: 'CIT-98421',
      especialidad: 'Medicina General',
      profesional: 'Dr. Alejandro Restrepo',
      sede: 'SURA San Diego - Piso 3',
      fecha: '25 de Agosto, 2026',
      hora: '09:30 AM',
      estado: 'Confirmada'
    },
    {
      id: 'CIT-76120',
      especialidad: 'Odontología General',
      profesional: 'Dra. Carolina Villegas',
      sede: 'SURA Poblado',
      fecha: '02 de Septiembre, 2026',
      hora: '03:15 PM',
      estado: 'Confirmada'
    }
  ];

  function init() {
    bindEvents();
    renderAppointmentsList();
  }

  function bindEvents() {
    const startWizardBtn = document.getElementById('open-citas-wizard');
    if (startWizardBtn) {
      startWizardBtn.addEventListener('click', () => {
        resetWizard();
        if (window.SURA_APP) window.SURA_APP.openModal('modal-citas-wizard');
      });
    }

    const nextStepBtn = document.getElementById('citas-next-btn');
    if (nextStepBtn) {
      nextStepBtn.addEventListener('click', handleNextStep);
    }

    const prevStepBtn = document.getElementById('citas-prev-btn');
    if (prevStepBtn) {
      prevStepBtn.addEventListener('click', handlePrevStep);
    }

    const specSelect = document.getElementById('cita-especialidad');
    if (specSelect) {
      specSelect.addEventListener('change', updateDoctorOptions);
    }
  }

  function resetWizard() {
    currentStep = 1;
    selectedAppointment = { especialidad: '', profesional: '', sede: '', fecha: '', hora: '' };
    updateStepUI();
  }

  function updateStepUI() {
    // Actualizar barra de progreso (Steppers)
    for (let i = 1; i <= 3; i++) {
      const stepItem = document.getElementById(`step-indicator-${i}`);
      if (stepItem) {
        stepItem.classList.remove('active', 'completed');
        if (i < currentStep) stepItem.classList.add('completed');
        if (i === currentStep) stepItem.classList.add('active');
      }

      const stepContent = document.getElementById(`wizard-step-${i}`);
      if (stepContent) {
        stepContent.style.display = i === currentStep ? 'block' : 'none';
      }
    }

    const prevBtn = document.getElementById('citas-prev-btn');
    const nextBtn = document.getElementById('citas-next-btn');

    if (prevBtn) prevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
    if (nextBtn) {
      nextBtn.textContent = currentStep === 3 ? 'Confirmar y Agendar Cita' : 'Siguiente';
    }

    if (currentStep === 2) {
      renderCalendarSlots();
    } else if (currentStep === 3) {
      renderSummary();
    }
  }

  function updateDoctorOptions() {
    const spec = document.getElementById('cita-especialidad').value;
    const docSelect = document.getElementById('cita-profesional');
    docSelect.innerHTML = '<option value="">-- Selecciona Profesional --</option>';

    let doctors = [];
    if (spec === 'medicina_general') {
      doctors = ['Dr. Alejandro Restrepo', 'Dra. María Paula Jaramillo', 'Dr. Roberto Mendoza'];
    } else if (spec === 'odontologia') {
      doctors = ['Dra. Carolina Villegas', 'Dr. Felipe Morales'];
    } else if (spec === 'pediatria') {
      doctors = ['Dra. Andrea Londoño', 'Dr. Carlos Alberto Ruiz'];
    } else if (spec === 'optometria') {
      doctors = ['Dr. Santiago Gaviria'];
    }

    doctors.forEach(doc => {
      const opt = document.createElement('option');
      opt.value = doc;
      opt.textContent = doc;
      docSelect.appendChild(opt);
    });
  }

  function renderCalendarSlots() {
    const calendarContainer = document.getElementById('calendar-slots-grid');
    if (!calendarContainer) return;

    calendarContainer.innerHTML = '';

    const hours = ['07:00 AM', '08:30 AM', '09:15 AM', '10:45 AM', '02:00 PM', '03:30 PM', '04:45 PM', '05:30 PM'];
    const dates = ['Mañana (21 Ago)', 'Viernes 22 Ago', 'Lunes 25 Ago', 'Martes 26 Ago'];

    dates.forEach((dateStr) => {
      const dateHeader = document.createElement('div');
      dateHeader.className = 'calendar-day-header';
      dateHeader.style.gridColumn = 'span 7';
      dateHeader.style.textAlign = 'left';
      dateHeader.style.marginTop = '0.5rem';
      dateHeader.style.color = 'var(--sura-navy)';
      dateHeader.innerHTML = `<strong><i class="far fa-calendar-alt"></i> ${dateStr}</strong>`;
      calendarContainer.appendChild(dateHeader);

      hours.slice(0, 4).forEach((hr, idx) => {
        const slot = document.createElement('div');
        slot.className = 'calendar-slot' + (idx === 2 ? ' disabled' : '');
        slot.textContent = hr;
        if (idx !== 2) {
          slot.addEventListener('click', () => {
            document.querySelectorAll('.calendar-slot').forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            selectedAppointment.fecha = dateStr;
            selectedAppointment.hora = hr;
          });
        }
        calendarContainer.appendChild(slot);
      });
    });
  }

  function handleNextStep() {
    if (currentStep === 1) {
      const spec = document.getElementById('cita-especialidad').value;
      const doc = document.getElementById('cita-profesional').value;
      const sede = document.getElementById('cita-sede').value;

      if (!spec || !doc || !sede) {
        alert('Por favor completa todos los campos para continuar.');
        return;
      }

      selectedAppointment.especialidad = document.getElementById('cita-especialidad').options[document.getElementById('cita-especialidad').selectedIndex].text;
      selectedAppointment.profesional = doc;
      selectedAppointment.sede = document.getElementById('cita-sede').options[document.getElementById('cita-sede').selectedIndex].text;

      currentStep = 2;
      updateStepUI();
    } else if (currentStep === 2) {
      if (!selectedAppointment.fecha || !selectedAppointment.hora) {
        alert('Por favor selecciona una fecha y horario disponible.');
        return;
      }
      currentStep = 3;
      updateStepUI();
    } else if (currentStep === 3) {
      // Finalizar agendamiento
      const newId = `CIT-${Math.floor(10000 + Math.random() * 90000)}`;
      userAppointments.unshift({
        id: newId,
        especialidad: selectedAppointment.especialidad,
        profesional: selectedAppointment.profesional,
        sede: selectedAppointment.sede,
        fecha: selectedAppointment.fecha,
        hora: selectedAppointment.hora,
        estado: 'Confirmada'
      });

      renderAppointmentsList();

      if (window.SURA_APP) {
        window.SURA_APP.closeModal('modal-citas-wizard');
        window.SURA_APP.showNotification(`¡Cita agendada con éxito! Radicado: ${newId}`, 'success');
      }
    }
  }

  function handlePrevStep() {
    if (currentStep > 1) {
      currentStep--;
      updateStepUI();
    }
  }

  function renderSummary() {
    const summaryBox = document.getElementById('cita-summary-box');
    if (summaryBox) {
      const user = window.SURA_PORTAL ? window.SURA_PORTAL.getUser() : {};
      summaryBox.innerHTML = `
        <div style="background: rgba(0,163,224,0.08); padding:1.2rem; border-radius: var(--radius-md); border:1px solid var(--sura-blue);">
          <h4 style="color:var(--sura-navy); margin-bottom:0.8rem;"><i class="fas fa-file-medical"></i> Resumen de la Cita a Agendar</h4>
          <p><strong>Paciente:</strong> ${user.nombre || 'Afiliado Cotizante'}</p>
          <p><strong>Especialidad:</strong> ${selectedAppointment.especialidad}</p>
          <p><strong>Profesional:</strong> ${selectedAppointment.profesional}</p>
          <p><strong>Sede de Atención:</strong> ${selectedAppointment.sede}</p>
          <p><strong>Fecha y Hora:</strong> ${selectedAppointment.fecha} a las ${selectedAppointment.hora}</p>
          <p style="margin-top:0.6rem; font-size:0.85rem; color:var(--text-secondary);">Recuerda llegar 15 minutos antes de la hora programada y presentar tu documento de identidad.</p>
        </div>
      `;
    }
  }

  function renderAppointmentsList() {
    const container = document.getElementById('appointments-list-container');
    if (!container) return;

    if (userAppointments.length === 0) {
      container.innerHTML = `<p style="color:var(--text-secondary); text-align:center; padding:1.5rem;">No tienes citas programadas actualmente.</p>`;
      return;
    }

    container.innerHTML = userAppointments.map(cita => `
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.2rem; margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.3rem;">
            <span class="badge badge-success"><i class="fas fa-check-circle"></i> ${cita.estado}</span>
            <small style="color:var(--text-muted); font-weight:600;">Ref: ${cita.id}</small>
          </div>
          <h4 style="color:var(--sura-navy);">${cita.especialidad}</h4>
          <p style="font-size:0.88rem; color:var(--text-secondary);"><i class="fas fa-user-md" style="color:var(--sura-blue);"></i> ${cita.profesional}</p>
          <p style="font-size:0.85rem; color:var(--text-muted);"><i class="fas fa-map-marker-alt" style="color:var(--sura-yellow);"></i> ${cita.sede} | <i class="far fa-clock"></i> ${cita.fecha} - ${cita.hora}</p>
        </div>
        <div>
          <button class="btn-outline" style="padding:0.4rem 0.8rem; font-size:0.8rem; border-color:var(--sura-red); color:var(--sura-red);" onclick="SURA_CITAS.cancelAppointment('${cita.id}')">
            <i class="fas fa-times"></i> Cancelar
          </button>
        </div>
      </div>
    `).join('');
  }

  function cancelAppointment(id) {
    if (confirm(`¿Estás seguro de cancelar la cita con radicado ${id}?`)) {
      userAppointments = userAppointments.filter(c => c.id !== id);
      renderAppointmentsList();
      if (window.SURA_APP) window.SURA_APP.showNotification(`La cita ${id} ha sido cancelada.`, 'info');
    }
  }

  return {
    init: init,
    cancelAppointment: cancelAppointment
  };
})();

document.addEventListener('DOMContentLoaded', SURA_CITAS.init);
