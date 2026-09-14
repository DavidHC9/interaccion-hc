/* ==========================================================================
   EPS SURA - Asistente Virtual Interactivo "Tibot"
   ========================================================================== */

const SURA_TIBOT = (function () {
  const faqDatabase = {
    'citas': "Puedes agendar, consultar y cancelar tus citas de Medicina General, Odontología y Pediatría directamente desde la sección 'Servicios a un Clic' o haciendo clic en el botón 'Solicitar Cita' del menú superior.",
    'autorizaciones': "Para tramitar o consultar una autorización médica, dirígete a la pestaña 'Autorizaciones', donde podrás ingresar con tu número de radicado o subir tu orden clínica.",
    'certificados': "Tus certificados de afiliación al Plan de Beneficios en Salud (PBS) o Plan Complementario (PAC) se descargan de forma inmediata en la sección 'Certificados' con código QR oficial.",
    'urgencias': "Si requieres atención médica de urgencias 24/7, comunícate inmediatamente a nuestra línea nacional 01 8000 519 519 o dirígete a la sede más cercana indicada en nuestro 'Directorio de Red'.",
    'turnos': "Puedes solicitar tu Turno Virtual para ser atendido en nuestras oficinas presenciales o vía videoatención sin necesidad de hacer filas."
  };

  function init() {
    bindEvents();
  }

  function bindEvents() {
    const toggleBtn = document.getElementById('tibot-toggle-btn');
    const closeBtn = document.getElementById('tibot-close-btn');
    const sendBtn = document.getElementById('tibot-send-btn');
    const input = document.getElementById('tibot-input');

    if (toggleBtn) toggleBtn.addEventListener('click', toggleChat);
    if (closeBtn) closeBtn.addEventListener('click', closeChat);
    if (sendBtn) sendBtn.addEventListener('click', handleSendMessage);

    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
      });
    }

    // Quick chip buttons inside chat
    const chips = document.querySelectorAll('.tibot-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        const topic = e.currentTarget.getAttribute('data-topic');
        sendUserMessage(e.currentTarget.textContent, topic);
      });
    });
  }

  function toggleChat() {
    const box = document.getElementById('tibot-box');
    if (box) {
      box.classList.toggle('active');
    }
  }

  function closeChat() {
    const box = document.getElementById('tibot-box');
    if (box) {
      box.classList.remove('active');
    }
  }

  function handleSendMessage() {
    const input = document.getElementById('tibot-input');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    sendUserMessage(text);
  }

  function sendUserMessage(text, topicKey = null) {
    const chatContainer = document.getElementById('tibot-chat-messages');
    if (!chatContainer) return;

    // Agregar mensaje del usuario
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user';
    userMsg.textContent = text;
    chatContainer.appendChild(userMsg);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Simular respuesta inteligente de Tibot
    setTimeout(() => {
      const botMsg = document.createElement('div');
      botMsg.className = 'chat-msg bot';

      let reply = "Hola, soy **Tibot**, tu asistente virtual EPS SURA. ¿En qué trámite puedo guiarte hoy? Puedes seleccionar Citas, Autorizaciones o Certificados.";
      const lower = text.toLowerCase();

      if (topicKey && faqDatabase[topicKey]) {
        reply = faqDatabase[topicKey];
      } else if (lower.includes('cita') || lower.includes('médico') || lower.includes('hora')) {
        reply = faqDatabase['citas'];
      } else if (lower.includes('autoriza') || lower.includes('orden') || lower.includes('examen')) {
        reply = faqDatabase['autorizaciones'];
      } else if (lower.includes('certifica') || lower.includes('carné') || lower.includes('descarga')) {
        reply = faqDatabase['certificados'];
      } else if (lower.includes('urgencia') || lower.includes('emergencia') || lower.includes('dolor')) {
        reply = faqDatabase['urgencias'];
      } else if (lower.includes('hola') || lower.includes('buenas')) {
        reply = "¡Hola! Con gusto te colaboro. ¿Qué gestión deseas realizar en tu portal de EPS SURA?";
      }

      botMsg.innerHTML = reply;
      chatContainer.appendChild(botMsg);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 600);
  }

  return {
    init: init,
    toggleChat: toggleChat
  };
})();

document.addEventListener('DOMContentLoaded', SURA_TIBOT.init);
