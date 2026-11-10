/* Google Analytics 4 con consentimiento (10/11/2026, pedido por Oier: ID G-J452T22NF8).
   No se carga NADA de Google hasta que la persona pulsa «Aceptar»; «Rechazar» pesa igual que «Aceptar».
   La elección se guarda en este navegador (localStorage, clave oi_cookies) y se puede cambiar desde
   el aviso legal (window.OI_COOKIES.abrir()). Solo cuenta visitas en oiwebstudio.com: en vistas
   previas y workers.dev ni carga Google ni enseña el aviso (en localhost solo el aviso, para probarlo). */
(function () {
  var ID = 'G-J452T22NF8';
  var CLAVE = 'oi_cookies';
  var h = location.hostname;
  var real = h === 'oiwebstudio.com' || h === 'www.oiwebstudio.com';
  var local = h === 'localhost' || h === '127.0.0.1';
  if (!real && !local) return;

  var eu = (document.documentElement.lang || '').toLowerCase().indexOf('eu') === 0;
  var T = eu ? {
    t: 'Cookieak',
    p: 'Google Analytics-en cookieak erabiltzen ditut zein orrialde bisitatzen diren jakiteko eta webgunea hobetzeko. Onartzen ez badituzu, ez da Googletik ezer kargatzen.',
    si: 'Onartu', no: 'Baztertu', mas: 'Informazio gehiago'
  } : {
    t: 'Cookies',
    p: 'Uso las cookies de Google Analytics solo para saber qué páginas se visitan y mejorar la web. Si no las aceptas, no se carga nada de Google.',
    si: 'Aceptar', no: 'Rechazar', mas: 'Más información'
  };

  var leer = function () { try { return localStorage.getItem(CLAVE); } catch (e) { return null; } };
  var guardar = function (v) { try { localStorage.setItem(CLAVE, v); } catch (e) {} };

  var cargado = false;
  var cargarGoogle = function () {
    if (cargado || !real) return;
    cargado = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', ID, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(s);
  };

  var aviso = null;
  var cerrar = function () { if (aviso) { aviso.remove(); aviso = null; } };
  var elegir = function (v) { guardar(v); cerrar(); if (v === 'si') cargarGoogle(); };

  var estilo = function () {
    if (document.getElementById('oi-cookies-css')) return;
    var st = document.createElement('style');
    st.id = 'oi-cookies-css';
    st.textContent =
      '.oi-ck{position:fixed;z-index:2147483000;left:16px;bottom:16px;max-width:380px;box-sizing:border-box;padding:20px 20px 18px;' +
      'background:#fff;color:#191712;border:1px solid #d8d6cf;border-radius:18px;box-shadow:0 14px 40px rgba(25,23,18,.16);' +
      'font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;animation:oi-ck-in .6s cubic-bezier(.2,.75,.25,1) both}' +
      '.oi-ck__t{margin:0 0 6px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}' +
      '.oi-ck__p{margin:0 0 14px;color:#46443f}' +
      '.oi-ck__p a{color:inherit;text-decoration:underline;text-underline-offset:2px}' +
      '.oi-ck__b{display:flex;gap:8px}' +
      '.oi-ck__b button{flex:1;min-height:44px;padding:0 16px;border:1px solid #191712;border-radius:999px;background:#fff;color:#191712;' +
      'font:600 13px/1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;transition:background .2s,color .2s}' +
      '.oi-ck__b button:hover,.oi-ck__b button:focus-visible{background:#191712;color:#fff;outline:0}' +
      '@keyframes oi-ck-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}' +
      '@media (max-width:480px){.oi-ck{left:10px;right:10px;bottom:10px;max-width:none}}' +
      '@media (prefers-reduced-motion:reduce){.oi-ck{animation:none}}';
    document.head.appendChild(st);
  };

  var abrir = function () {
    if (aviso) return;
    estilo();
    aviso = document.createElement('div');
    aviso.className = 'oi-ck';
    aviso.setAttribute('role', 'dialog');
    aviso.setAttribute('aria-label', T.t);
    aviso.innerHTML =
      '<p class="oi-ck__t">' + T.t + '</p>' +
      '<p class="oi-ck__p">' + T.p + ' <a href="/legal.html#cookies">' + T.mas + '</a></p>' +
      '<div class="oi-ck__b"><button type="button" data-v="no">' + T.no + '</button><button type="button" data-v="si">' + T.si + '</button></div>';
    aviso.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('button[data-v]');
      if (b) elegir(b.getAttribute('data-v'));
    });
    document.body.appendChild(aviso);
  };

  window.OI_COOKIES = { abrir: abrir, estado: leer };

  var v = leer();
  if (v === 'si') cargarGoogle();
  else if (v !== 'no') {
    var ir = function () { setTimeout(abrir, 1200); };
    if (document.readyState === 'complete') ir(); else window.addEventListener('load', ir, { once: true });
  }
})();
