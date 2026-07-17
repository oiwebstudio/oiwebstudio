(function () {
  "use strict";

  var scriptEl = document.currentScript;
  var businessSlug = scriptEl.getAttribute("data-business");
  var apiBase = scriptEl.getAttribute("data-api") || new URL(scriptEl.src).origin;

  if (!businessSlug) {
    console.error("[booking-widget] falta data-business en el <script>");
    return;
  }

  var STYLE = "" +
    ".oib-bubble{position:fixed;right:20px;bottom:20px;width:56px;height:56px;border-radius:50%;" +
    "background:#1e1e1e;color:#fff;display:flex;align-items:center;justify-content:center;" +
    "cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.25);z-index:99998;font-size:24px;border:none}" +
    ".oib-panel{position:fixed;right:20px;bottom:88px;width:320px;max-width:calc(100vw - 40px);" +
    "height:440px;max-height:calc(100vh - 140px);background:#fff;border-radius:14px;" +
    "box-shadow:0 20px 60px rgba(0,0,0,.3);display:none;flex-direction:column;overflow:hidden;" +
    "z-index:99999;font-family:system-ui,-apple-system,sans-serif}" +
    ".oib-panel.oib-open{display:flex}" +
    ".oib-head{background:#1e1e1e;color:#fff;padding:12px 14px;font-size:14px;font-weight:600}" +
    ".oib-body{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;background:#f7f6f3}" +
    ".oib-msg{max-width:85%;padding:8px 11px;border-radius:9px;font-size:13.5px;line-height:1.4}" +
    ".oib-msg.bot{align-self:flex-start;background:#fff;border:1px solid #eee}" +
    ".oib-msg.user{align-self:flex-end;background:#dff3d8}" +
    ".oib-quick{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}" +
    ".oib-quick button{border:1px solid #1e1e1e;background:#fff;border-radius:20px;padding:5px 10px;" +
    "font-size:12.5px;cursor:pointer}" +
    ".oib-quick button:hover{background:#1e1e1e;color:#fff}" +
    ".oib-input{display:flex;border-top:1px solid #eee;padding:8px}" +
    ".oib-input input{flex:1;border:1px solid #ddd;border-radius:20px;padding:7px 12px;font-size:13px}" +
    ".oib-input button{margin-left:6px;border:none;background:#1e1e1e;color:#fff;border-radius:20px;" +
    "padding:7px 14px;font-size:13px;cursor:pointer}";

  var styleTag = document.createElement("style");
  styleTag.textContent = STYLE;
  document.head.appendChild(styleTag);

  var bubble = document.createElement("button");
  bubble.className = "oib-bubble";
  bubble.setAttribute("aria-label", "Abrir chat de reservas");
  bubble.textContent = "💬";

  var panel = document.createElement("div");
  panel.className = "oib-panel";
  panel.innerHTML =
    '<div class="oib-head">Reservar cita</div>' +
    '<div class="oib-body" id="oib-body"></div>' +
    '<div class="oib-input">' +
    '<input id="oib-text" type="text" placeholder="Escribe aquí..." />' +
    '<button id="oib-send">Enviar</button>' +
    "</div>";

  document.body.appendChild(bubble);
  document.body.appendChild(panel);

  var bodyEl = panel.querySelector("#oib-body");
  var textEl = panel.querySelector("#oib-text");
  var sendBtn = panel.querySelector("#oib-send");

  var sessionId = null;
  var expectsFreeText = false;

  bubble.addEventListener("click", function () {
    var isOpen = panel.classList.toggle("oib-open");
    if (isOpen && !sessionId) startSession();
  });

  sendBtn.addEventListener("click", submitText);
  textEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") submitText();
  });

  function submitText() {
    var value = textEl.value.trim();
    if (!value) return;
    textEl.value = "";
    sendInput(value);
  }

  function addMessage(role, text) {
    var el = document.createElement("div");
    el.className = "oib-msg " + role;
    el.textContent = text;
    bodyEl.appendChild(el);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function addQuickReplies(options) {
    if (!options || options.length === 0) return;
    var wrap = document.createElement("div");
    wrap.className = "oib-quick";
    options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.textContent = opt.label;
      btn.addEventListener("click", function () {
        addMessage("user", opt.label);
        sendInput(opt.value);
      });
      wrap.appendChild(btn);
    });
    bodyEl.appendChild(wrap);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function renderBotMessages(messages) {
    expectsFreeText = false;
    messages.forEach(function (m) {
      addMessage("bot", m.text);
      if (m.quickReplies && m.quickReplies.length) addQuickReplies(m.quickReplies);
      if (m.expectsFreeText) expectsFreeText = true;
    });
  }

  function startSession() {
    fetch(apiBase + "/api/chat/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessSlug: businessSlug }),
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        if (!data.sessionId) {
          addMessage("bot", "No se pudo iniciar el chat. Inténtalo más tarde.");
          return;
        }
        sessionId = data.sessionId;
        renderBotMessages(data.messages || []);
      })
      .catch(function () {
        addMessage("bot", "No se pudo conectar. Inténtalo más tarde.");
      });
  }

  function sendInput(value) {
    if (!sessionId) return;
    fetch(apiBase + "/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sessionId, input: value }),
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        renderBotMessages(data.messages || []);
      })
      .catch(function () {
        addMessage("bot", "Hubo un problema enviando tu respuesta. Inténtalo de nuevo.");
      });
  }
})();
