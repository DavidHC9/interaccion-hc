/* ==========================================================================
   EPS SURA - Módulo del Portal de Afiliados y Autenticación
   ========================================================================== */

const SURA_PORTAL = (function () {
  // Estado inicial simulado de afiliado activo
  let currentUser = {
    isLoggedIn: false,
    nombre: "MARÍA ALEJANDRA GÓMEZ PÉREZ",
    tipoDoc: "CC",
    numDoc: "1.020.456.789",
    fechaNacimiento: "14/08/1992",
    plan: "Plan Beneficios en Salud (PBS)",
    estado: "Activo (Cotizante)",
    ipsAsignada: "SURA San Diego - Medellín",
    medicoFamilia: "Dr. Roberto Carlos Mendoza",
    email: "maria.gomez@email.com",
    telefono: "300 456 7890"
  };

  function init() {
    bindEvents();
    updateUIState();
  }

  function bindEvents() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLoginSubmit);
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }

    // Permitir que cualquier elemento con la clase btn-open-digital-card abra el carné
    document.querySelectorAll('.btn-open-digital-card').forEach(btn => {
      btn.addEventListener('click', showDigitalCardModal);
    });
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    const docType = document.getElementById('login-doc-type').value;
    const docNum = document.getElementById('login-doc-num').value.trim();

    if (!docNum) {
      alert('Por favor ingresa un número de documento válido.');
      return;
    }

    // Simulación de inicio de sesión exitoso
    currentUser.isLoggedIn = true;
    currentUser.tipoDoc = docType;
    currentUser.numDoc = formatDocNumber(docNum);

    // Cerrar modal de login y actualizar vista
    if (window.SURA_APP) {
      window.SURA_APP.closeModal('modal-login');
      window.SURA_APP.showNotification(`¡Bienvenido(a), ${currentUser.nombre}!`, 'success');
    }

    updateUIState();
  }

  function handleLogout() {
    currentUser.isLoggedIn = false;
    if (window.SURA_APP) {
      window.SURA_APP.showNotification('Sesión cerrada correctamente.', 'info');
    }
    updateUIState();
  }

  function updateUIState() {
    const loginBtn = document.getElementById('btn-open-login');
    const userBadge = document.getElementById('user-badge-container');
    const heroUserName = document.getElementById('hero-user-name');
    const heroUserDoc = document.getElementById('hero-user-doc');
    const heroUserPlan = document.getElementById('hero-user-plan');
    const dashboardContainer = document.getElementById('affiliate-dashboard');

    if (currentUser.isLoggedIn) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (userBadge) userBadge.style.display = 'flex';
      if (heroUserName) heroUserName.textContent = currentUser.nombre;
      if (heroUserDoc) heroUserDoc.textContent = `${currentUser.tipoDoc} ${currentUser.numDoc}`;
      if (heroUserPlan) heroUserPlan.textContent = currentUser.plan;
      if (dashboardContainer) dashboardContainer.style.display = 'block';
    } else {
      if (loginBtn) loginBtn.style.display = 'inline-flex';
      if (userBadge) userBadge.style.display = 'none';
      if (heroUserName) heroUserName.textContent = "Afiliado EPS SURA";
      if (heroUserDoc) heroUserDoc.textContent = "Ingresa para ver tus servicios";
      if (heroUserPlan) heroUserPlan.textContent = "PBS / PAC";
      if (dashboardContainer) dashboardContainer.style.display = 'none';
    }
  }

  function showDigitalCardModal() {
    const cardContent = document.getElementById('digital-card-render');
    if (cardContent) {
      cardContent.innerHTML = `
        <div class="digital-card">
          <div class="digital-card-header">
            <div class="brand-logo" style="color: #fff; display:flex; align-items:center; gap:0.6rem;">
              <div class="logo-wing-badge" style="width:40px; height:40px; border-radius:10px;">
                <img src="imagenes/ala.png" alt="EPS SURA">
              </div>
              <div class="logo-text">
                <span style="color:#fff; font-weight:800; font-size:1.1rem; line-height:1;">EPS SURA</span>
                <span style="color:#FFC72C; font-size:0.7rem; font-weight:600; letter-spacing:1px; margin-top:2px;">CARNÉ VIRTUAL DE AFILIACIÓN</span>
              </div>
            </div>
            <div class="qr-code-box">
              <i class="fas fa-qrcode" style="font-size: 2.5rem; color: #002B49;"></i>
            </div>
          </div>
          <div class="digital-card-body">
            <p style="font-size:0.75rem; text-transform:uppercase; color:#CBD5E1;">Nombre del Afiliado(a)</p>
            <h3>${currentUser.nombre}</h3>
            <div class="digital-card-info">
              <div>
                <span>Documento</span>
                <strong>${currentUser.tipoDoc} ${currentUser.numDoc}</strong>
              </div>
              <div>
                <span>Tipo de Afiliación</span>
                <strong>${currentUser.estado}</strong>
              </div>
              <div>
                <span>Plan de Salud</span>
                <strong>${currentUser.plan}</strong>
              </div>
              <div>
                <span>IPS Asignada</span>
                <strong>${currentUser.ipsAsignada}</strong>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (window.SURA_APP) {
      window.SURA_APP.openModal('modal-digital-card');
    }
  }

  function formatDocNumber(val) {
    return val.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  return {
    init: init,
    getUser: () => currentUser,
    isLoggedIn: () => currentUser.isLoggedIn
  };
})();

document.addEventListener('DOMContentLoaded', SURA_PORTAL.init);
