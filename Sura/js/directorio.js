/* ==========================================================================
   EPS SURA - Directorio de Red Médica, Sedes y Urgencias
   ========================================================================== */

const SURA_DIRECTORIO = (function () {
  const sedesData = [
    {
      id: 1,
      nombre: "Sede Salud SURA San Diego",
      ciudad: "Medellín",
      tipo: "Urgencias y Consulta Externa",
      direccion: "Calle 33 # 42-65 (Centro Comercial San Diego)",
      telefono: "(604) 448 6115",
      horario: "Urgencias 24 Horas | Consulta 6:00 AM - 8:00 PM",
      servicios: ["Urgencias Adultos", "Medicina General", "Laboratorio Clínico", "Farmacia Cruz Verde", "Radiología"],
      destacado: true
    },
    {
      id: 2,
      nombre: "Sede Salud SURA El Poblado",
      ciudad: "Medellín",
      tipo: "Especialidades y PAC",
      direccion: "Carrera 43A # 1-85",
      telefono: "(604) 448 6115",
      horario: "Lunes a Viernes 7:00 AM - 7:00 PM | Sábados 7:00 AM - 1:00 PM",
      servicios: ["Medicina Especializada", "Plan Complementario (PAC)", "Pediatría", "Ginecología", "Ecografía"],
      destacado: true
    },
    {
      id: 3,
      nombre: "Clínica SURA Calle 100",
      ciudad: "Bogotá",
      tipo: "Urgencias y Alta Complejidad",
      direccion: "Calle 100 # 19-54",
      telefono: "(601) 489 7941",
      horario: "Atención de Urgencias 24/7",
      servicios: ["Urgencias 24H", "Hospitalización", "Cirugía", "Cuidados Intensivos", "Imágenes Diagnósticas"],
      destacado: true
    },
    {
      id: 4,
      nombre: "Sede Odontológica SURA Laureles",
      ciudad: "Medellín",
      tipo: "Odontología",
      direccion: "Transversal 39 # 74-21",
      telefono: "(604) 448 6115",
      horario: "Lunes a Viernes 6:30 AM - 7:30 PM",
      servicios: ["Odontología General", "Ortodoncia", "Endodoncia", "Urgencias Odontológicas"],
      destacado: false
    },
    {
      id: 5,
      nombre: "Sede Salud SURA Chía",
      ciudad: "Bogotá / Chía",
      tipo: "Consulta Externa",
      direccion: "Km 2 Variante Chía - Cota",
      telefono: "(601) 489 7941",
      horario: "Lunes a Sábado 7:00 AM - 6:00 PM",
      servicios: ["Medicina Familiar", "Laboratorio", "Terapia Física", "Vacunación"],
      destacado: false
    },
    {
      id: 6,
      nombre: "Sede SURA Pie de la Popa",
      ciudad: "Cartagena",
      tipo: "Urgencias y Consulta",
      direccion: "Calle 30 # 21-45",
      telefono: "(605) 693 2100",
      horario: "Urgencias 24 Horas",
      servicios: ["Urgencias", "Consulta Externa", "Medicina Laboral"],
      destacado: false
    }
  ];

  function init() {
    bindEvents();
    renderSedes(sedesData);
  }

  function bindEvents() {
    const cityFilter = document.getElementById('directory-city-filter');
    const typeFilter = document.getElementById('directory-type-filter');
    const searchInput = document.getElementById('directory-search-input');

    if (cityFilter) cityFilter.addEventListener('change', applyFilters);
    if (typeFilter) typeFilter.addEventListener('change', applyFilters);
    if (searchInput) searchInput.addEventListener('input', applyFilters);
  }

  function applyFilters() {
    const city = document.getElementById('directory-city-filter')?.value || '';
    const type = document.getElementById('directory-type-filter')?.value || '';
    const query = document.getElementById('directory-search-input')?.value.toLowerCase() || '';

    const filtered = sedesData.filter(sede => {
      const matchCity = !city || sede.ciudad.toLowerCase().includes(city.toLowerCase());
      const matchType = !type || sede.tipo.toLowerCase().includes(type.toLowerCase());
      const matchQuery = !query || sede.nombre.toLowerCase().includes(query) || sede.direccion.toLowerCase().includes(query) || sede.servicios.some(s => s.toLowerCase().includes(query));
      return matchCity && matchType && matchQuery;
    });

    renderSedes(filtered);
  }

  function renderSedes(list) {
    const grid = document.getElementById('directory-grid-container');
    if (!grid) return;

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding:3rem; background:var(--bg-card); border-radius:var(--radius-md);">
          <i class="fas fa-search-location" style="font-size:2.5rem; color:var(--text-muted); margin-bottom:1rem;"></i>
          <h3>No encontramos sedes coincidentes</h3>
          <p style="color:var(--text-secondary);">Intenta cambiar los filtros de ciudad o tipo de atención.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = list.map(sede => `
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.5rem; display:flex; flex-direction:column; justify-content:space-between; box-shadow:var(--shadow-sm); transition:var(--transition);" class="sede-item-card">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
            <span class="badge ${sede.tipo.includes('Urgencias') ? 'badge-warning' : 'badge-info'}">
              <i class="fas ${sede.tipo.includes('Urgencias') ? 'fa-ambulance' : 'fa-clinic-medical'}"></i> ${sede.tipo}
            </span>
            <small style="color:var(--sura-blue); font-weight:700;">${sede.ciudad}</small>
          </div>
          <h4 style="color:var(--sura-navy); font-size:1.15rem; margin-bottom:0.4rem;">${sede.nombre}</h4>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:0.4rem;">
            <i class="fas fa-map-marker-alt" style="color:var(--sura-yellow);"></i> ${sede.direccion}
          </p>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:0.8rem;">
            <i class="fas fa-phone-alt" style="color:var(--sura-blue);"></i> ${sede.telefono}
          </p>
          <div style="font-size:0.8rem; background:var(--bg-main); padding:0.5rem 0.75rem; border-radius:var(--radius-sm); color:var(--text-primary); margin-bottom:1rem;">
            <i class="far fa-clock"></i> <strong>Horario:</strong> ${sede.horario}
          </div>
        </div>

        <div>
          <div style="display:flex; flex-wrap:wrap; gap:0.3rem; margin-bottom:1rem;">
            ${sede.servicios.slice(0, 3).map(s => `<span style="font-size:0.7rem; background:rgba(0,51,102,0.06); color:var(--sura-navy); padding:0.15rem 0.5rem; border-radius:4px;">${s}</span>`).join('')}
            ${sede.servicios.length > 3 ? `<span style="font-size:0.7rem; color:var(--sura-blue); padding:0.15rem 0.3rem;">+${sede.servicios.length - 3} más</span>` : ''}
          </div>
          <button class="btn-outline" style="width:100%; justify-content:center; padding:0.5rem; font-size:0.85rem;" onclick="SURA_DIRECTORIO.openSedeDetail(${sede.id})">
            <i class="fas fa-directions"></i> Ver Mapa y Detalles
          </button>
        </div>
      </div>
    `).join('');
  }

  function openSedeDetail(id) {
    const sede = sedesData.find(s => s.id === id);
    if (!sede) return;

    const modalContent = document.getElementById('sede-detail-content');
    if (modalContent) {
      modalContent.innerHTML = `
        <div>
          <div style="background:linear-gradient(135deg, var(--sura-navy), var(--sura-navy-light)); color:#FFF; padding:1.5rem; border-radius:var(--radius-md); margin-bottom:1.5rem;">
            <span class="badge badge-warning" style="margin-bottom:0.5rem;">${sede.tipo}</span>
            <h3 style="color:#FFF; font-size:1.4rem;">${sede.nombre}</h3>
            <p style="color:#E2E8F0; font-size:0.9rem;"><i class="fas fa-map-marker-alt" style="color:var(--sura-yellow);"></i> ${sede.direccion} - ${sede.ciudad}</p>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
            <div style="background:var(--bg-main); padding:1rem; border-radius:var(--radius-sm);">
              <strong><i class="fas fa-phone"></i> Teléfono Directo:</strong>
              <p style="color:var(--sura-blue); font-weight:700;">${sede.telefono}</p>
            </div>
            <div style="background:var(--bg-main); padding:1rem; border-radius:var(--radius-sm);">
              <strong><i class="far fa-clock"></i> Horario de Atención:</strong>
              <p style="color:var(--text-primary); font-size:0.85rem;">${sede.horario}</p>
            </div>
          </div>

          <h4 style="color:var(--sura-navy); margin-bottom:0.8rem;">Servicios Disponibles en esta Sede</h4>
          <ul style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; list-style:none; margin-bottom:1.5rem;">
            ${sede.servicios.map(serv => `<li style="font-size:0.9rem;"><i class="fas fa-check-circle" style="color:var(--sura-green);"></i> ${serv}</li>`).join('')}
          </ul>

          <div style="height:200px; background:#E2E8F0; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; flex-direction:column; color:var(--text-secondary); border:2px dashed var(--border-color);">
            <i class="fas fa-map-marked-alt" style="font-size:2.5rem; color:var(--sura-blue); margin-bottom:0.5rem;"></i>
            <strong>Vista de Mapa Interactivo SIMULADA</strong>
            <small>Ubicación GPS: Lat 6.2442, Long -75.5812</small>
          </div>
        </div>
      `;
    }

    if (window.SURA_APP) window.SURA_APP.openModal('modal-sede-detail');
  }

  return {
    init: init,
    openSedeDetail: openSedeDetail
  };
})();

document.addEventListener('DOMContentLoaded', SURA_DIRECTORIO.init);
