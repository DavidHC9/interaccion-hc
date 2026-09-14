/* ==========================================================================
   EPS SURA - Controlador Principal de Navegación, Modales y Notificaciones
   ========================================================================== */

window.SURA_APP = (function () {
  // Contenido de Diapositivas Informativas del Banner Hero
  const heroSlides = [
    {
      title: 'Consulta las sedes habilitadas<br>en las zonas afectadas <span class="highlight-blue">por el sismo</span>',
      desc: 'Si te encuentras en Cali, Armenia, Manizales o Pereira, consulta las farmacias, IPS Básicas y oficinas de atención al usuario de EPS SURA que prestan servicios a partir del 18 de agosto.',
      ctaText: 'INGRESA AQUÍ',
      ctaAction: () => switchToTab('directorio')
    },
    {
      title: 'Tu cita médica general y con especialistas<br><span class="highlight-blue">a un solo clic de distancia</span>',
      desc: 'Programa consultas presenciales o virtuales con médicos de familia, pediatras y odontólogos en nuestras sedes preferenciales con confirmación al instante.',
      ctaText: 'AGENDAR CITA',
      ctaAction: () => switchToTab('citas')
    },
    {
      title: 'Jornada Nacional de Vacunación<br>y Protección Integral <span class="highlight-blue">en Sedes SURA</span>',
      desc: 'Ponte al día con tu esquema de vacunación y el de tus hijos. Consulta los puntos habilitados sin necesidad de cita previa en todas nuestras IPS básicas.',
      ctaText: 'VER PUNTOS DE ATENCIÓN',
      ctaAction: () => switchToTab('directorio')
    },
    {
      title: 'Ahorra tiempo en tus trámites presenciales<br>con el <span class="highlight-blue">Turno Virtual EPS SURA</span>',
      desc: 'Genera tu turno de atención antes de salir de casa, monitorea el tiempo de espera en vivo y recibe notificación cuando sea tu turno en la taquilla.',
      ctaText: 'SOLICITAR TURNO',
      ctaAction: () => openModal('modal-turno-virtual')
    }
  ];

  let currentSlideIndex = 0;
  let slideTimer = null;

  function init() {
    bindEvents();
    setupTabs();
    setupThemeToggle();
    setupMobileDrawer();
    setupHeroCarousel();
    setupGlobalSearch();
    setupKeyboardShortcuts();
  }

  function bindEvents() {
    // Abrir modales generales
    document.querySelectorAll('[data-open-modal]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        const modalId = e.currentTarget.getAttribute('data-open-modal');
        openModal(modalId);
      });
    });

    // Cerrar modales con botones de cierre
    document.querySelectorAll('.modal-close, [data-close-modal]').forEach(closeBtn => {
      closeBtn.addEventListener('click', (e) => {
        const modal = e.currentTarget.closest('.modal-overlay');
        if (modal) {
          closeModal(modal.id);
        }
      });
    });

    // Cerrar al hacer clic en el backdrop/overlay
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeModal(overlay.id);
        }
      });
    });

    // Cambiar de pestaña al hacer clic en las tarjetas de "Opciones a un clic"
    document.querySelectorAll('[data-tab-switch]').forEach(card => {
      card.addEventListener('click', (e) => {
        const targetTab = e.currentTarget.getAttribute('data-tab-switch');
        switchToTab(targetTab);
      });
    });
  }

  function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetId = e.currentTarget.getAttribute('data-tab-target');
        switchToTab(targetId);
      });
    });
  }

  function switchToTab(tabId) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(b => {
      const isTarget = b.getAttribute('data-tab-target') === tabId;
      b.classList.toggle('active', isTarget);
      b.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    tabContents.forEach(c => {
      if (c.id === tabId) {
        c.style.display = 'block';
      } else {
        c.style.display = 'none';
      }
    });

    // Desplazamiento suave hacia la sección de trámites
    const targetSection = document.getElementById(tabId) || document.querySelector('.tramites-nav-container');
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function setupThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (!themeBtn) return;

    // Detectar preferencia guardada o preferencia del sistema
    const savedTheme = localStorage.getItem('sura-theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      updateThemeIcon(true);
    }

    themeBtn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-theme');
      localStorage.setItem('sura-theme', isDark ? 'dark' : 'light');
      updateThemeIcon(isDark);
      showNotification(isDark ? 'Modo Oscuro activado' : 'Modo Claro activado', 'info');
    });
  }

  function updateThemeIcon(isDark) {
    const icon = document.querySelector('#theme-toggle-btn i');
    if (icon) {
      icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
      icon.style.color = isDark ? '#FFC72C' : '#FFFFFF';
    }
  }

  function setupMobileDrawer() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const closeBtn = document.getElementById('mobile-menu-close');
    const drawer = document.getElementById('mobile-nav-drawer');

    if (toggleBtn && drawer) {
      toggleBtn.addEventListener('click', () => {
        drawer.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    if (closeBtn && drawer) {
      closeBtn.addEventListener('click', () => {
        drawer.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    if (drawer) {
      drawer.addEventListener('click', (e) => {
        if (e.target === drawer) {
          drawer.classList.remove('active');
          document.body.style.overflow = '';
        }
      });

      drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          drawer.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }
  }

  function setupHeroCarousel() {
    const dotsContainer = document.getElementById('hero-dots-container');
    if (!dotsContainer) return;

    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const slideIndex = parseInt(e.currentTarget.getAttribute('data-slide'), 10);
        goToSlide(slideIndex);
        resetSlideTimer();
      });
    });

    startSlideTimer();
  }

  function goToSlide(index) {
    if (index < 0 || index >= heroSlides.length) return;
    currentSlideIndex = index;

    const dots = document.querySelectorAll('#hero-dots-container .dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    const titleEl = document.getElementById('hero-banner-title');
    const descEl = document.getElementById('hero-banner-desc');
    const ctaBtn = document.getElementById('btn-hero-primary');

    if (titleEl && descEl && ctaBtn) {
      titleEl.style.opacity = '0';
      descEl.style.opacity = '0';

      setTimeout(() => {
        titleEl.innerHTML = heroSlides[index].title;
        descEl.textContent = heroSlides[index].desc;
        ctaBtn.innerHTML = `${heroSlides[index].ctaText} <i class="fas fa-arrow-right"></i>`;
        ctaBtn.onclick = (e) => {
          e.preventDefault();
          heroSlides[index].ctaAction();
        };

        titleEl.style.opacity = '1';
        descEl.style.opacity = '1';
      }, 200);
    }
  }

  function startSlideTimer() {
    slideTimer = setInterval(() => {
      const nextIndex = (currentSlideIndex + 1) % heroSlides.length;
      goToSlide(nextIndex);
    }, 7000);
  }

  function resetSlideTimer() {
    if (slideTimer) clearInterval(slideTimer);
    startSlideTimer();
  }

  function setupGlobalSearch() {
    const searchInput = document.getElementById('global-search-input');
    const resultsContainer = document.getElementById('global-search-results');
    const quickChips = document.querySelectorAll('.search-quick-chip');

    if (!searchInput || !resultsContainer) return;

    const items = [
      { term: 'citas agendar medicas medicina especialista doctor', tab: 'citas', title: 'Agendamiento de Citas en Línea', desc: 'Agenda medicina general, pediatría u odontología.' },
      { term: 'autorizaciones ordenes examenes cirugias laboratorio formula radicado', tab: 'autorizaciones', title: 'Consulta y Radicación de Autorizaciones', desc: 'Rastrea radicados o radica una nueva orden médica.' },
      { term: 'certificados afiliacion pbs pac carnet carné aportes cotizacion', tab: 'certificados', title: 'Certificados de Afiliación PBS y PAC', desc: 'Genera tu certificado oficial con validación QR inmediata.' },
      { term: 'directorio sedes clinicas urgencias medicos farmacias direccion', tab: 'directorio', title: 'Directorio Médico y Sedes de Urgencias', desc: 'Ubica sedes con urgencias 24h y consulta externa en todo el país.' },
      { term: 'reembolsos pagos cuota moderadora pse copago factura', modal: 'modal-reembolsos', title: 'Pagos en Línea y Reembolsos', desc: 'Paga cuotas moderadoras por PSE o solicita reembolsos.' },
      { term: 'turno virtual fila turno presencial taquilla', modal: 'modal-turno-virtual', title: 'Turno Virtual para Sedes', desc: 'Solicita tu turno en taquilla antes de salir de casa.' },
      { term: 'lengua de señas accesibilidad sordo interprete lsc', modal: 'modal-lengua-senas', title: 'Atención en Lengua de Señas (LSC)', desc: 'Videollamada con intérprete oficial para comunidad sorda.' }
    ];

    function filterResults(query) {
      const q = query.trim().toLowerCase();
      if (!q) {
        renderResults(items);
        return;
      }

      const filtered = items.filter(item => item.term.includes(q) || item.title.toLowerCase().includes(q));
      renderResults(filtered);
    }

    function renderResults(list) {
      if (list.length === 0) {
        resultsContainer.innerHTML = `
          <div style="text-align:center; padding:1.5rem; color:var(--text-secondary);">
            <i class="fas fa-search" style="font-size:2rem; opacity:0.3; margin-bottom:0.5rem; display:block;"></i>
            No encontramos trámites que coincidan con tu búsqueda.
          </div>
        `;
        return;
      }

      resultsContainer.innerHTML = list.map(item => `
        <div class="search-result-item" onclick="SURA_APP.handleSearchResultClick('${item.tab || ''}', '${item.modal || ''}')">
          <i class="${item.tab === 'citas' ? 'fas fa-calendar-check' : item.tab === 'autorizaciones' ? 'fas fa-clipboard-check' : item.tab === 'certificados' ? 'fas fa-file-download' : 'fas fa-chevron-right'}"></i>
          <div>
            <strong>${item.title}</strong>
            <p style="font-size:0.82rem; color:var(--text-secondary); margin:0;">${item.desc}</p>
          </div>
        </div>
      `).join('');
    }

    searchInput.addEventListener('input', (e) => {
      filterResults(e.target.value);
    });

    quickChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        const term = e.currentTarget.getAttribute('data-search-term');
        searchInput.value = term;
        filterResults(term);
      });
    });
  }

  function handleSearchResultClick(tabId, modalId) {
    closeModal('modal-buscar');
    if (tabId) {
      switchToTab(tabId);
    } else if (modalId) {
      openModal(modalId);
    }
  }

  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openModal('modal-buscar');
        const input = document.getElementById('global-search-input');
        if (input) setTimeout(() => input.focus(), 150);
      }
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
        const drawer = document.getElementById('mobile-nav-drawer');
        if (drawer && drawer.classList.contains('active')) {
          drawer.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  }

  function simulatePayment() {
    closeModal('modal-reembolsos');
    showNotification('Redirigiendo a pasarela segura PSE SURA...', 'info');
    setTimeout(() => {
      showNotification('¡Pago de cuota moderadora ($4.500 COP) procesado exitosamente!', 'success');
    }, 1500);
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.top = '24px';
    toast.style.right = '24px';
    toast.style.zIndex = '3000';
    toast.style.padding = '0.9rem 1.4rem';
    toast.style.borderRadius = 'var(--radius-md)';
    toast.style.color = '#FFFFFF';
    toast.style.fontWeight = '700';
    toast.style.fontSize = '0.92rem';
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.25)';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '0.75rem';
    toast.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    toast.style.transform = 'translateY(-15px)';
    toast.style.opacity = '0';

    if (type === 'success') {
      toast.style.background = 'linear-gradient(135deg, #00A859, #008747)';
      toast.innerHTML = `<i class="fas fa-check-circle" style="font-size:1.15rem;"></i> <span>${message}</span>`;
    } else if (type === 'error') {
      toast.style.background = 'linear-gradient(135deg, #E03C31, #B8251C)';
      toast.innerHTML = `<i class="fas fa-exclamation-circle" style="font-size:1.15rem;"></i> <span>${message}</span>`;
    } else {
      toast.style.background = 'linear-gradient(135deg, #1A232E, #0056E0)';
      toast.innerHTML = `<i class="fas fa-info-circle" style="font-size:1.15rem; color:#FFC72C;"></i> <span>${message}</span>`;
    }

    document.body.appendChild(toast);

    // Animación de entrada
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    // Desaparición
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-15px)';
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }

  return {
    init: init,
    openModal: openModal,
    closeModal: closeModal,
    switchToTab: switchToTab,
    showNotification: showNotification,
    showToast: showNotification,
    simulatePayment: simulatePayment,
    handleSearchResultClick: handleSearchResultClick
  };
})();

// Alias para compatibilidad total con cualquier script legado
window.App = window.SURA_APP;

document.addEventListener('DOMContentLoaded', SURA_APP.init);
