/* ==========================================================================
   EPS SURA - Controlador Principal de Navegación, Modales y Notificaciones
   ========================================================================== */

window.SURA_APP = (function () {
  function init() {
    bindEvents();
    setupTabs();
    setupThemeToggle();
  }

  function bindEvents() {
    // Abrir modales generales
    document.querySelectorAll('[data-open-modal]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        const modalId = e.currentTarget.getAttribute('data-open-modal');
        openModal(modalId);
      });
    });

    // Cerrar modales
    document.querySelectorAll('.modal-close, [data-close-modal]').forEach(closeBtn => {
      closeBtn.addEventListener('click', (e) => {
        const modal = e.currentTarget.closest('.modal-overlay');
        if (modal) {
          closeModal(modal.id);
        }
      });
    });

    // Cerrar al dar clic en overlay
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeModal(overlay.id);
        }
      });
    });

    // Menú Hamburguesa Móvil
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('main-nav-links');
    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active-mobile');
      });
    }
  }

  function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetId = e.currentTarget.getAttribute('data-tab-target');

        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.style.display = 'none');

        e.currentTarget.classList.add('active');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.style.display = 'block';
        }
      });
    });
  }

  function setupThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (!themeBtn) return;

    // Detectar preferencia guardada
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
    const label = document.querySelector('#theme-toggle-btn span');
    if (icon) {
      icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
    if (label) {
      label.textContent = isDark ? 'Modo Claro' : 'Modo Oscuro';
    }
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
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '3000';
    toast.style.padding = '0.9rem 1.4rem';
    toast.style.borderRadius = 'var(--radius-md)';
    toast.style.color = '#FFFFFF';
    toast.style.fontWeight = '600';
    toast.style.fontSize = '0.9rem';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '0.6rem';
    toast.style.transition = 'all 0.4s ease';

    if (type === 'success') {
      toast.style.background = 'linear-gradient(135deg, #00A859, #008747)';
      toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    } else if (type === 'error') {
      toast.style.background = 'linear-gradient(135deg, #E03C31, #B8251C)';
      toast.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    } else {
      toast.style.background = 'linear-gradient(135deg, #002B49, #1B5299)';
      toast.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    }

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  return {
    init: init,
    openModal: openModal,
    closeModal: closeModal,
    showNotification: showNotification
  };
})();

document.addEventListener('DOMContentLoaded', SURA_APP.init);
