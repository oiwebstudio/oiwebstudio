(function() {
  'use strict';

  // Detectar qué negocio es basado en el dominio o parámetro
  function detectarNegocio() {
    const host = window.location.host;
    const path = window.location.pathname;

    if (host.includes('gimnasio') || path.includes('/gimnasio')) return 'gimnasio';
    if (host.includes('panaderia') || path.includes('/panaderia')) return 'panaderia';
    if (host.includes('floristeria') || path.includes('/floristeria')) return 'floristeria';
    if (host.includes('cafeteria') || path.includes('/cafeteria')) return 'cafeteria';
    if (host.includes('restaurante') || path.includes('/restaurante')) return 'restaurante';
    if (host.includes('peluqueria') || path.includes('/peluqueria')) return 'peluqueria';
    if (host.includes('taller') || path.includes('/taller')) return 'taller';
    if (host.includes('veterinaria') || path.includes('/veterinaria')) return 'veterinaria';

    // Fallback: buscar en la carpeta URL
    const match = path.match(/\/([^\/]+)\//);
    return match ? match[1] : 'gimnasio';
  }

  const negocio = detectarNegocio();
  const config = CHATBOT_CONFIG[negocio];

  if (!config) {
    console.warn('Chatbot: configuración no encontrada para', negocio);
    return;
  }

  // Determinar colores del tema
  const isDark = config.colorBg === config.color ||
                 (config.colorBg && parseInt(config.colorBg.replace('#', ''), 16) < 0x808080);

  const styles = `
    .chatbot-float {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    }

    .chatbot-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      background: ${config.color};
      color: ${isDark ? '#fff' : '#000'};
    }

    .chatbot-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .chatbot-btn.open {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .chatbot-modal {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      display: none;
      align-items: flex-end;
      justify-content: flex-end;
      z-index: 9998;
      padding: 0;
      animation: fadeIn 0.3s ease;
    }

    .chatbot-modal.active {
      display: flex;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .chatbot-box {
      width: 100%;
      max-width: 400px;
      height: 600px;
      background: ${config.colorBg};
      border-radius: 16px 16px 0 0;
      display: flex;
      flex-direction: column;
      box-shadow: -8px -8px 24px rgba(0, 0, 0, 0.2);
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .chatbot-header {
      background: ${config.color};
      color: ${isDark ? '#fff' : '#000'};
      padding: 16px;
      border-radius: 16px 16px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chatbot-header-title {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .chatbot-header-title h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .chatbot-header-title small {
      font-size: 12px;
      opacity: 0.9;
    }

    .chatbot-close {
      background: none;
      border: none;
      color: ${isDark ? '#fff' : '#000'};
      cursor: pointer;
      font-size: 24px;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s;
    }

    .chatbot-close:hover {
      opacity: 0.7;
    }

    .chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      color: ${config.colorText || '#333'};
    }

    .message {
      display: flex;
      gap: 8px;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .message.bot .content {
      background: ${config.color};
      color: ${isDark ? '#fff' : '#000'};
      border-radius: 8px;
      padding: 10px 12px;
      max-width: 85%;
      word-wrap: break-word;
      font-size: 14px;
      line-height: 1.4;
    }

    .message.user {
      justify-content: flex-end;
    }

    .message.user .content {
      background: ${config.color};
      color: ${isDark ? '#fff' : '#000'};
      border-radius: 8px;
      padding: 10px 12px;
      max-width: 85%;
      word-wrap: break-word;
      font-size: 14px;
      line-height: 1.4;
    }

    .quick-replies {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 8px;
    }

    .quick-reply {
      background: ${config.color};
      color: ${isDark ? '#fff' : '#000'};
      border: none;
      border-radius: 6px;
      padding: 8px 10px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: opacity 0.2s;
      text-align: center;
    }

    .quick-reply:hover {
      opacity: 0.8;
    }

    .chatbot-footer {
      padding: 12px;
      display: flex;
      gap: 8px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    .chatbot-input {
      flex: 1;
      border: 1px solid ${config.color};
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 14px;
      font-family: inherit;
      background: ${config.colorBg};
      color: ${config.colorText || '#333'};
    }

    .chatbot-input::placeholder {
      color: ${config.colorText || '#999'};
      opacity: 0.6;
    }

    .chatbot-send {
      background: ${config.color};
      color: ${isDark ? '#fff' : '#000'};
      border: none;
      border-radius: 6px;
      width: 40px;
      height: 40px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      transition: opacity 0.2s;
    }

    .chatbot-send:hover {
      opacity: 0.8;
    }

    .chatbot-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    .action-btn {
      background: ${config.color};
      color: ${isDark ? '#fff' : '#000'};
      border: none;
      border-radius: 6px;
      padding: 10px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: opacity 0.2s;
    }

    .action-btn:hover {
      opacity: 0.8;
    }

    @media (max-width: 480px) {
      .chatbot-box {
        max-width: 100%;
        height: 100vh;
        border-radius: 0;
      }
      .chatbot-modal {
        padding: 0;
      }
    }
  `;

  // Inyectar estilos
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // HTML del widget
  const html = `
    <div class="chatbot-float">
      <button class="chatbot-btn" id="chatbot-toggle">${config.emoji}</button>
    </div>
    <div class="chatbot-modal" id="chatbot-modal">
      <div class="chatbot-box">
        <div class="chatbot-header">
          <div class="chatbot-header-title">
            <h3>${config.nombre}</h3>
            <small>${config.tipo}</small>
          </div>
          <button class="chatbot-close" id="chatbot-close">✕</button>
        </div>
        <div class="chatbot-messages" id="chatbot-messages"></div>
        <div class="chatbot-actions" id="chatbot-actions"></div>
        <div class="chatbot-footer">
          <input type="text" class="chatbot-input" id="chatbot-input" placeholder="Escribe tu pregunta...">
          <button class="chatbot-send" id="chatbot-send">→</button>
        </div>
      </div>
    </div>
  `;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // Inyectar HTML
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    const toggleBtn = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const modal = document.getElementById('chatbot-modal');
    const messagesContainer = document.getElementById('chatbot-messages');
    const input = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');
    const actionsDiv = document.getElementById('chatbot-actions');

    // Evento del toggle
    toggleBtn.addEventListener('click', () => {
      modal.classList.add('active');
      toggleBtn.classList.add('open');
      // Mostrar saludo inicial
      if (messagesContainer.children.length === 0) {
        showBotMessage(config.respuestas.saludo);
        showQuickReplies();
      }
      input.focus();
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      toggleBtn.classList.remove('open');
    });

    // Cerrar al hacer click fuera
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeBtn.click();
      }
    });

    // Enviar mensaje
    sendBtn.addEventListener('click', handleSendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSendMessage();
    });

    function handleSendMessage() {
      const text = input.value.trim();
      if (!text) return;

      showUserMessage(text);
      input.value = '';

      // Respuesta del bot
      setTimeout(() => {
        const response = getResponse(text.toLowerCase());
        showBotMessage(response);
      }, 300);
    }

    function showUserMessage(text) {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'message user';
      msgDiv.innerHTML = `<div class="content">${escapeHtml(text)}</div>`;
      messagesContainer.appendChild(msgDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showBotMessage(text) {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'message bot';
      msgDiv.innerHTML = `<div class="content">${escapeHtml(text).replace(/\n/g, '<br>')}</div>`;
      messagesContainer.appendChild(msgDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showQuickReplies() {
      actionsDiv.innerHTML = '';
      const replies = ['Planes', 'Horario', 'Ubicación', 'Contacto'];
      const repliesHTML = replies.map(r => `<button class="action-btn">${r}</button>`).join('');
      actionsDiv.innerHTML = repliesHTML;

      actionsDiv.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const text = btn.textContent;
          showUserMessage(text);
          setTimeout(() => {
            const response = getResponse(text.toLowerCase());
            showBotMessage(response);
          }, 300);
        });
      });
    }

    function getResponse(text) {
      const keywords = {
        'plan': config.respuestas.planes || 'Cuéntame más sobre los planes.',
        'precio': config.respuestas.planes || 'Tenemos diferentes opciones de precios.',
        'horario': config.respuestas.horario || 'Consulta nuestro horario.',
        'ubicación': config.respuestas.ubicacion || 'Estamos ubicados en la dirección que te muestro.',
        'contacto': config.respuestas.contacto || 'Puedes contactarnos en el teléfono o email.',
        'reserva': `¿Deseas hacer una reserva? Puedo ayudarte.\n\n📞 ${config.telefono}\n\n¿Prefieres WhatsApp?`,
        'reservar': `¿Deseas hacer una reserva? Puedo ayudarte.\n\n📞 ${config.telefono}\n\n¿Prefieres WhatsApp?`,
        'whatsapp': `¡Perfecto! Aquí está nuestro WhatsApp:\n\n💬 https://wa.me/${config.whatsapp}\n\n¡Te esperamos!`,
      };

      for (const [key, response] of Object.entries(keywords)) {
        if (text.includes(key)) return response;
      }

      // Default response
      return `Entendido. Para más información sobre ${config.tipo.toLowerCase()}, puedes:\n\n📞 Llamar: ${config.telefono}\n📧 Email: ${config.email}\n\n¿Hay algo más que quieras saber?`;
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  // Ejecutar si DOM ya está listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
