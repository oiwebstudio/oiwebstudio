(function () {
  "use strict";

  var scriptEl = document.currentScript;
  var businessSlug = scriptEl.getAttribute("data-business");
  var apiBase = scriptEl.getAttribute("data-api") || new URL(scriptEl.src).origin;
  var launchLabel = scriptEl.getAttribute("data-label") || "Reservar cita";

  if (!businessSlug) {
    console.error("[booking-widget] falta data-business en el <script>");
    return;
  }

  var STYLE = "" +
    ":root{--oib-ink:#17151c;--oib-ink2:#232028;--oib-accent:#e8623d;--oib-accent2:#d4522f;" +
    "--oib-cream:#faf7f2;--oib-line:#eee9e1;--oib-radius:22px}" +

    /* ---- Botón lanzador: píldora con icono + texto ---- */
    ".oib-launch{position:fixed;right:20px;bottom:20px;z-index:99998;display:flex;align-items:center;gap:10px;" +
    "background:var(--oib-ink);color:#fff;border:none;cursor:pointer;border-radius:999px;" +
    "padding:14px 22px 14px 16px;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;" +
    "font-size:15px;font-weight:600;letter-spacing:.01em;" +
    "box-shadow:0 6px 18px rgba(23,21,28,.28),0 22px 45px -18px rgba(23,21,28,.45);" +
    "transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s ease}" +
    ".oib-launch:hover{transform:translateY(-2px) scale(1.03);box-shadow:0 10px 24px rgba(23,21,28,.32),0 30px 55px -18px rgba(23,21,28,.5)}" +
    ".oib-launch:active{transform:scale(.97)}" +
    ".oib-launch:focus-visible{outline:3px solid var(--oib-accent);outline-offset:3px}" +
    ".oib-launch .oib-ico{width:38px;height:38px;border-radius:50%;background:var(--oib-accent);display:flex;" +
    "align-items:center;justify-content:center;flex:none;position:relative}" +
    ".oib-launch .oib-ico svg{width:20px;height:20px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}" +
    ".oib-launch .oib-dot{position:absolute;top:-1px;right:-1px;width:11px;height:11px;border-radius:50%;" +
    "background:#3ddc84;border:2px solid var(--oib-ink)}" +
    "@media(prefers-reduced-motion:no-preference){" +
    ".oib-launch .oib-dot{animation:oib-pulse 2.2s ease-in-out infinite}" +
    "@keyframes oib-pulse{0%,100%{box-shadow:0 0 0 0 rgba(61,220,132,.55)}55%{box-shadow:0 0 0 7px rgba(61,220,132,0)}}}" +
    ".oib-launch.oib-hide{display:none}" +

    /* ---- Panel ---- */
    ".oib-panel{position:fixed;right:20px;bottom:20px;z-index:99999;width:372px;max-width:calc(100vw - 24px);" +
    "height:560px;max-height:calc(100vh - 48px);background:var(--oib-cream);border-radius:var(--oib-radius);" +
    "box-shadow:0 12px 30px rgba(23,21,28,.18),0 45px 90px -25px rgba(23,21,28,.4);" +
    "display:none;flex-direction:column;overflow:hidden;" +
    "font-family:system-ui,-apple-system,'Segoe UI',sans-serif;transform-origin:bottom right}" +
    ".oib-panel.oib-open{display:flex}" +
    "@media(prefers-reduced-motion:no-preference){" +
    ".oib-panel.oib-open{animation:oib-in .32s cubic-bezier(.22,1.2,.36,1) both}" +
    "@keyframes oib-in{from{opacity:0;transform:translateY(14px) scale(.94)}to{opacity:1;transform:none}}}" +
    "@media(max-width:480px){.oib-panel{right:12px;left:12px;width:auto;bottom:12px;height:min(600px,calc(100vh - 24px))}}" +

    /* ---- Cabecera ---- */
    ".oib-head{background:linear-gradient(135deg,var(--oib-ink) 0%,var(--oib-ink2) 100%);color:#fff;" +
    "padding:18px 18px 16px;display:flex;align-items:center;gap:12px;flex:none}" +
    ".oib-avatar{width:42px;height:42px;border-radius:14px;background:var(--oib-accent);flex:none;display:flex;" +
    "align-items:center;justify-content:center}" +
    ".oib-avatar svg{width:22px;height:22px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}" +
    ".oib-head-txt{flex:1;min-width:0}" +
    ".oib-head-txt strong{display:block;font-size:15.5px;font-weight:700;letter-spacing:.01em;white-space:nowrap;" +
    "overflow:hidden;text-overflow:ellipsis}" +
    ".oib-status{display:flex;align-items:center;gap:6px;font-size:12px;color:rgba(255,255,255,.62);margin-top:2px}" +
    ".oib-status::before{content:'';width:7px;height:7px;border-radius:50%;background:#3ddc84;flex:none}" +
    ".oib-close{background:rgba(255,255,255,.1);border:none;color:#fff;width:32px;height:32px;border-radius:10px;" +
    "cursor:pointer;font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;" +
    "transition:background .2s}" +
    ".oib-close:hover{background:rgba(255,255,255,.22)}" +

    /* ---- Cuerpo ---- */
    ".oib-body{flex:1;overflow-y:auto;padding:18px 16px 10px;display:flex;flex-direction:column;gap:10px;" +
    "scroll-behavior:smooth;overscroll-behavior:contain}" +
    ".oib-body::-webkit-scrollbar{width:5px}" +
    ".oib-body::-webkit-scrollbar-thumb{background:#ddd5c9;border-radius:3px}" +
    ".oib-msg{max-width:84%;padding:11px 14px;font-size:14px;line-height:1.5;position:relative;" +
    "word-wrap:break-word}" +
    "@media(prefers-reduced-motion:no-preference){" +
    ".oib-msg,.oib-quick{animation:oib-msg .3s cubic-bezier(.22,1,.36,1) both}" +
    "@keyframes oib-msg{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}}" +
    ".oib-msg.bot{align-self:flex-start;background:#fff;color:#2a2732;border:1px solid var(--oib-line);" +
    "border-radius:16px 16px 16px 5px;box-shadow:0 2px 6px rgba(23,21,28,.05)}" +
    ".oib-msg.user{align-self:flex-end;background:var(--oib-ink);color:#fff;border-radius:16px 16px 5px 16px}" +

    /* ---- Escribiendo… ---- */
    ".oib-typing{align-self:flex-start;background:#fff;border:1px solid var(--oib-line);border-radius:16px 16px 16px 5px;" +
    "padding:13px 16px;display:flex;gap:5px;align-items:center;box-shadow:0 2px 6px rgba(23,21,28,.05)}" +
    ".oib-typing i{width:7px;height:7px;border-radius:50%;background:#b8ae9f;display:block}" +
    "@media(prefers-reduced-motion:no-preference){" +
    ".oib-typing i{animation:oib-b 1.1s infinite ease-in-out}" +
    ".oib-typing i:nth-child(2){animation-delay:.15s}.oib-typing i:nth-child(3){animation-delay:.3s}" +
    "@keyframes oib-b{0%,60%,100%{transform:translateY(0);opacity:.45}30%{transform:translateY(-5px);opacity:1}}}" +

    /* ---- Respuestas rápidas ---- */
    ".oib-quick{display:flex;flex-wrap:wrap;gap:8px;align-self:flex-start;max-width:95%}" +
    ".oib-quick button{border:1.5px solid var(--oib-ink);background:transparent;color:var(--oib-ink);" +
    "border-radius:999px;padding:8px 15px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;" +
    "transition:background .18s,color .18s,transform .18s}" +
    ".oib-quick button:hover{background:var(--oib-ink);color:#fff;transform:translateY(-1px)}" +
    ".oib-quick button:active{transform:scale(.96)}" +
    ".oib-quick button:focus-visible{outline:2px solid var(--oib-accent);outline-offset:2px}" +

    /* ---- Confirmación final ---- */
    ".oib-msg.oib-done{background:linear-gradient(135deg,#2e7d4f,#37945d);color:#fff;border:none;" +
    "border-radius:16px;font-weight:600}" +

    /* ---- Entrada ---- */
    ".oib-foot{flex:none;padding:12px 14px 14px;background:var(--oib-cream);border-top:1px solid var(--oib-line)}" +
    ".oib-input{display:flex;gap:8px;background:#fff;border:1.5px solid var(--oib-line);border-radius:999px;" +
    "padding:5px 5px 5px 18px;transition:border-color .2s,box-shadow .2s}" +
    ".oib-input:focus-within{border-color:var(--oib-ink);box-shadow:0 0 0 3px rgba(23,21,28,.07)}" +
    ".oib-input input{flex:1;border:none;outline:none;background:transparent;font-size:14px;font-family:inherit;" +
    "color:#2a2732;min-width:0}" +
    ".oib-input input::placeholder{color:#b0a798}" +
    ".oib-send{width:38px;height:38px;border-radius:50%;border:none;background:var(--oib-accent);cursor:pointer;" +
    "display:flex;align-items:center;justify-content:center;flex:none;transition:background .2s,transform .15s}" +
    ".oib-send:hover{background:var(--oib-accent2)}" +
    ".oib-send:active{transform:scale(.92)}" +
    ".oib-send svg{width:17px;height:17px;stroke:#fff;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}" +
    ".oib-brand{text-align:center;font-size:10.5px;color:#b0a798;margin-top:8px;letter-spacing:.04em}";

  var ICO_CAL = '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18M9 15l2 2 4-4"/></svg>';
  var ICO_SEND = '<svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg>';

  var styleTag = document.createElement("style");
  styleTag.textContent = STYLE;
  document.head.appendChild(styleTag);

  var launch = document.createElement("button");
  launch.className = "oib-launch";
  launch.setAttribute("aria-label", "Abrir chat: " + launchLabel);
  launch.innerHTML = '<span class="oib-ico">' + ICO_CAL + '<span class="oib-dot"></span></span><span>' + launchLabel + '</span>';

  var panel = document.createElement("div");
  panel.className = "oib-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Chat de reservas");
  panel.innerHTML =
    '<div class="oib-head">' +
    '<span class="oib-avatar">' + ICO_CAL + "</span>" +
    '<div class="oib-head-txt"><strong>' + launchLabel + '</strong>' +
    '<span class="oib-status">Asistente en línea</span></div>' +
    '<button class="oib-close" aria-label="Cerrar chat">✕</button>' +
    "</div>" +
    '<div class="oib-body"></div>' +
    '<div class="oib-foot">' +
    '<div class="oib-input">' +
    '<input type="text" placeholder="Escribe aquí…" aria-label="Escribe tu mensaje"/>' +
    '<button class="oib-send" aria-label="Enviar mensaje">' + ICO_SEND + "</button>" +
    "</div>" +
    '<div class="oib-brand">Reservas por OI Studio</div>' +
    "</div>";

  document.body.appendChild(launch);
  document.body.appendChild(panel);

  var bodyEl = panel.querySelector(".oib-body");
  var textEl = panel.querySelector("input");
  var sendBtn = panel.querySelector(".oib-send");
  var closeBtn = panel.querySelector(".oib-close");

  var sessionId = null;
  var busy = false;

  function openPanel() {
    panel.classList.add("oib-open");
    launch.classList.add("oib-hide");
    if (!sessionId) startSession();
    else textEl.focus();
  }
  function closePanel() {
    panel.classList.remove("oib-open");
    launch.classList.remove("oib-hide");
  }

  launch.addEventListener("click", openPanel);
  closeBtn.addEventListener("click", closePanel);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("oib-open")) closePanel();
  });

  sendBtn.addEventListener("click", submitText);
  textEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") submitText();
  });

  function submitText() {
    var value = textEl.value.trim();
    if (!value || busy) return;
    textEl.value = "";
    addMessage("user", value);
    sendInput(value);
  }

  function addMessage(role, text, extraClass) {
    var el = document.createElement("div");
    el.className = "oib-msg " + role + (extraClass ? " " + extraClass : "");
    el.textContent = text;
    bodyEl.appendChild(el);
    scrollDown();
    return el;
  }

  function showTyping() {
    var el = document.createElement("div");
    el.className = "oib-typing";
    el.innerHTML = "<i></i><i></i><i></i>";
    bodyEl.appendChild(el);
    scrollDown();
    return el;
  }

  function clearQuickReplies() {
    bodyEl.querySelectorAll(".oib-quick").forEach(function (q) { q.remove(); });
  }

  function addQuickReplies(options) {
    if (!options || options.length === 0) return;
    var wrap = document.createElement("div");
    wrap.className = "oib-quick";
    options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = opt.label;
      btn.addEventListener("click", function () {
        if (busy) return;
        clearQuickReplies();
        addMessage("user", opt.label);
        sendInput(opt.value);
      });
      wrap.appendChild(btn);
    });
    bodyEl.appendChild(wrap);
    scrollDown();
  }

  function scrollDown() {
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function renderBotMessages(messages, status) {
    var i = 0;
    function next() {
      if (i >= messages.length) return;
      var m = messages[i];
      var typing = showTyping();
      setTimeout(function () {
        typing.remove();
        var isFinal = status === "COMPLETED" && i === messages.length - 1;
        addMessage("bot", m.text, isFinal ? "oib-done" : "");
        if (m.quickReplies && m.quickReplies.length) addQuickReplies(m.quickReplies);
        if (m.expectsFreeText) textEl.focus();
        i++;
        next();
      }, Math.min(350 + m.text.length * 6, 900));
    }
    next();
  }

  function startSession() {
    busy = true;
    var typing = showTyping();
    fetch(apiBase + "/api/chat/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessSlug: businessSlug }),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        typing.remove();
        busy = false;
        if (!data.sessionId) {
          addMessage("bot", "Ahora mismo no puedo atenderte. Vuelve a intentarlo en un momento.");
          return;
        }
        sessionId = data.sessionId;
        renderBotMessages(data.messages || []);
      })
      .catch(function () {
        typing.remove();
        busy = false;
        addMessage("bot", "No he podido conectar. Revisa tu conexión e inténtalo de nuevo.");
      });
  }

  function sendInput(value) {
    if (!sessionId || busy) return;
    busy = true;
    fetch(apiBase + "/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sessionId, input: value }),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        busy = false;
        renderBotMessages(data.messages || [], data.status);
      })
      .catch(function () {
        busy = false;
        addMessage("bot", "Ha habido un problema al enviar tu respuesta. Inténtalo otra vez.");
      });
  }
})();
