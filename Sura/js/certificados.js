/* ==========================================================================
   EPS SURA - Generador e Impresor de Certificados en Línea
   ========================================================================== */

const SURA_CERTIFICADOS = (function () {
  function init() {
    bindEvents();
  }

  function bindEvents() {
    const certButtons = document.querySelectorAll('.btn-generate-cert');
    certButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const certType = e.currentTarget.getAttribute('data-cert-type');
        generateCertificate(certType);
      });
    });
  }

  function generateCertificate(type) {
    const user = (window.SURA_PORTAL && window.SURA_PORTAL.getUser()) || {};
    const nombre = user.nombre || "MARÍA ALEJANDRA GÓMEZ PÉREZ";
    const tipoDoc = user.tipoDoc || "CC";
    const numDoc = user.numDoc || "1.020.456.789";

    const certViewer = document.getElementById('certificate-viewer-content');
    if (!certViewer) return;

    const fechaActual = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
    const hashValidacion = Math.random().toString(36).substring(2, 12).toUpperCase();

    let certTitle = "CERTIFICADO DE AFILIACIÓN";
    let certBodyText = "";

    if (type === 'pbs') {
      certTitle = "CERTIFICADO DE AFILIACIÓN AL PLAN DE BENEFICIOS EN SALUD (PBS)";
      certBodyText = `
        Que <strong>${nombre}</strong>, identificado(a) con <strong>${tipoDoc} No. ${numDoc}</strong>,
        se encuentra afiliado(a) a <strong>EPS SURA S.A.</strong> en calidad de <strong>COTIZANTE ACTIVO</strong>,
        disfrutando de todos los derechos y coberturas establecidos por el Sistema General de Seguridad Social en Salud de Colombia.
      `;
    } else if (type === 'pac') {
      certTitle = "CERTIFICADO DE PLAN COMPLEMENTARIO EN SALUD (PAC)";
      certBodyText = `
        Que <strong>${nombre}</strong>, identificado(a) con <strong>${tipoDoc} No. ${numDoc}</strong>,
        cuenta con cobertura activa del <strong>PLAN COMPLEMENTARIO SURA - COBERTURA PREFERENCIAL</strong>,
        con acceso a la red VIP de atención y especialistas directos.
      `;
    } else if (type === 'pagos') {
      certTitle = "CERTIFICADO DE APORTES Y PAGOS DE CUOTAS MODERADORAS";
      certBodyText = `
        EPS SURA certifica que el cotizante <strong>${nombre}</strong> (${tipoDoc} ${numDoc})
        se encuentra al día en sus cotizaciones de ley para el periodo actual 2026.
      `;
    }

    certViewer.innerHTML = `
      <div style="background:#FFFFFF; color:#1E293B; border:2px solid var(--sura-navy); border-radius:var(--radius-md); padding:2.5rem; font-family:serif; position:relative; box-shadow:var(--shadow-lg);">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--sura-navy); padding-bottom:1rem; margin-bottom:2rem;">
          <div style="display:flex; align-items:center; gap:0.8rem;">
            <div style="width:44px; height:44px; border-radius:10px; overflow:hidden; flex-shrink:0; background:var(--sura-blue);">
              <img src="imagenes/ala.png" alt="EPS SURA" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <div>
              <h3 style="font-family:sans-serif; color:var(--sura-navy); margin:0; font-size:1.15rem; font-weight:800; line-height:1;">EPS SURA</h3>
              <small style="font-family:sans-serif; color:#64748B; font-weight:600; font-size:0.75rem;">ENTIDAD PROMOTORA DE SALUD SURAMERICANA S.A.</small>
            </div>
          </div>
          <div style="text-align:right; font-family:sans-serif; font-size:0.8rem; color:#64748B;">
            <strong>Código de Verificación:</strong><br>
            <span style="font-family:monospace; color:var(--sura-blue); font-weight:700;">${hashValidacion}</span>
          </div>
        </div>

        <h3 style="text-align:center; font-family:sans-serif; color:#002B49; letter-spacing:0.5px; margin-bottom:2rem; text-transform:uppercase;">
          ${certTitle}
        </h3>

        <p style="font-size:1.05rem; line-height:1.8; text-align:justify; margin-bottom:1.5rem;">
          HACE CONSTAR:
        </p>

        <p style="font-size:1.05rem; line-height:1.8; text-align:justify; margin-bottom:2.5rem;">
          ${certBodyText}
        </p>

        <p style="font-size:0.95rem; margin-bottom:3rem;">
          El presente certificado se expide a solicitud del interesado(a) en la ciudad de Medellín, con fecha de expedición <strong>${fechaActual}</strong>.
        </p>

        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top:1px solid #CBD5E1; padding-top:1.5rem; font-family:sans-serif;">
          <div>
            <div style="font-family:cursive; font-size:1.5rem; color:#002B49; font-weight:bold; margin-bottom:0.2rem;">Firma Digital SURA</div>
            <strong style="color:#002B49; font-size:0.9rem;">GERENCIA DE AFILIACIONES Y RECAUDO</strong><br>
            <span style="font-size:0.8rem; color:#64748B;">EPS SURAMERICANA S.A.</span>
          </div>
          <div style="text-align:center;">
            <div style="background:#F8FAFC; border:1px solid #CBD5E1; padding:0.5rem; border-radius:6px; display:inline-block;">
              <i class="fas fa-qrcode" style="font-size:2.8rem; color:#002B49;"></i>
            </div>
            <p style="font-size:0.7rem; color:#94A3B8; margin-top:0.2rem;">Documento firmado digitalmente</p>
          </div>
        </div>
      </div>
    `;

    if (window.SURA_APP) {
      window.SURA_APP.openModal('modal-certificate-viewer');
    }
  }

  function printCertificate() {
    window.print();
  }

  return {
    init: init,
    generateCertificate: generateCertificate,
    printCertificate: printCertificate
  };
})();

document.addEventListener('DOMContentLoaded', SURA_CERTIFICADOS.init);
