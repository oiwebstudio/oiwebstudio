/* Portada · oferta en tres líneas (27/10/2026): lo que reacciona al tocar y lo que entra al bajar.
   Sin JS se ve todo, una cosa debajo de otra. Con movimiento reducido o sin GSAP, todo quieto y visible.
   Los textos que cambia el JS salen de [data-k] del HTML, así la versión en euskera los lleva traducidos. */
(function () {
  var quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raiz = document.querySelector('.l3');
  if (!raiz) return;
  document.documentElement.classList.add('js-l3');
  var esperas = [];
  function espera(fn, ms) { esperas.push(setTimeout(fn, quieto ? 0 : ms)); }
  function salta(el) { if (quieto || !el) return; el.classList.remove('l3-salta'); void el.offsetWidth; el.classList.add('l3-salta'); }
  function txt(k) { var el = document.querySelector('[data-k="' + k + '"]'); return el ? el.textContent.trim() : ''; }

  function girar(antes, despues) {
    var a = antes ? [].slice.call(antes.querySelectorAll('.l3-num')) : [];
    [].slice.call(despues.querySelectorAll('.l3-num')).forEach(function (el, i) {
      var fin = +el.dataset.n, ini = a[i] ? +a[i].dataset.n : fin;
      if (quieto || !window.gsap || ini === fin) { el.textContent = fin; return; }
      var o = { v: ini };
      gsap.to(o, { v: fin, duration: 0.7, ease: 'power3.out', onUpdate: function () { el.textContent = Math.round(o.v); } });
    });
  }

  function ticket(p) {
    [].slice.call(p.querySelectorAll('.ticket')).forEach(function (t) {
      if (quieto || t.offsetParent === null) return;
      t.classList.add('is-escribiendo');
      espera(function () {
        t.classList.remove('is-escribiendo');
        if (window.gsap) gsap.from(t.querySelector('.ticket__txt'), { y: 10, opacity: 0, duration: 0.45, ease: 'expo.out', clearProps: 'transform,opacity' });
        salta(t);
      }, 750);
    });
  }

  function pestanas(lista, alCambiar) {
    if (!lista) return;
    var tabs = [].slice.call(lista.querySelectorAll('[role="tab"]'));
    var paneles = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    var actual = 0;
    function elegir(i, foco) {
      if (i === actual) return;
      var antes = paneles[actual];
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        t.classList.toggle('is-on', on);
        paneles[j].hidden = !on;
      });
      if (foco) tabs[i].focus();
      salta(tabs[i]);
      if (lista.scrollWidth > lista.clientWidth) lista.scrollTo({ left: tabs[i].getBoundingClientRect().left - lista.getBoundingClientRect().left + lista.scrollLeft - 4, behavior: quieto ? 'auto' : 'smooth' });
      actual = i;
      if (alCambiar) alCambiar(antes, paneles[i]);
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { elegir(i, false); });
      t.addEventListener('keydown', function (e) {
        var n = tabs.length, d = 0;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') d = 1;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') d = -1;
        else if (e.key === 'Home') { e.preventDefault(); return elegir(0, true); }
        else if (e.key === 'End') { e.preventDefault(); return elegir(n - 1, true); }
        if (d) { e.preventDefault(); elegir((i + d + n) % n, true); }
      });
    });
    lista.hidden = false;
    paneles.forEach(function (p, j) { p.hidden = j !== 0; });
  }

  function entraPanel(antes, p) {
    girar(antes, p);
    ticket(p);
    if (quieto || !window.gsap) return;
    var vista = p.querySelector('.rm__vista, .rmtel') || p;
    gsap.fromTo(vista, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.out', clearProps: 'clipPath' });
    var img = p.querySelector('.rmtel img');
    if (img) gsap.from(img, { scale: 1.12, duration: 1.1, ease: 'expo.out', clearProps: 'transform' });
    gsap.from(p.querySelectorAll('.rm__marca, .rm__frase, .rm__ia, .rm__precio, .rm__acc, h3, p'), { y: 14, opacity: 0, duration: 0.5, ease: 'expo.out', stagger: 0.03, clearProps: 'transform,opacity' });
  }

  pestanas(document.querySelector('.l3-au .ramas'), function (a, p) { entraPanel(a, p); if (p.id === 'rm-google') comprobar(); });
  pestanas(document.querySelector('.l3-au .rm__vista > .sub'), entraPanel);

  /* Google y las IAs: el informe se va comprobando línea a línea */
  var inf = document.getElementById('inf');
  function comprobar() {
    if (!inf || quieto) return;
    var lis = [].slice.call(inf.querySelectorAll('li'));
    lis.forEach(function (li) { var em = li.querySelector('em'); em.dataset.r = em.dataset.r || em.textContent; em.textContent = txt('ej_mirando'); li.classList.add('is-mirando'); });
    lis.forEach(function (li, i) {
      espera(function () { var em = li.querySelector('em'); em.textContent = em.dataset.r; li.classList.remove('is-mirando'); salta(em); }, 450 + i * 420);
    });
  }
  var bi = document.getElementById('inf-otra');
  if (bi) bi.addEventListener('click', comprobar);

  /* Reseñas: borrador, revisión, «vale» y «la publico yo» */
  var rs = document.getElementById('rs');
  if (rs) {
    var R = [
      { n: 'Ane G.', c: rs.querySelector('.rs-cuando').textContent, e: '★★★★★', l: '5/5', t: rs.querySelector('.rs-txt').textContent, b: rs.querySelector('.rs-bor').textContent },
      { n: 'Jon M.', c: txt('rs_c2'), e: '★★★☆☆', l: '3/5', t: txt('rs_t2'), b: txt('rs_b2') }
    ];
    var ri = 0, hecho = document.getElementById('rs-hecho');
    var p2 = rs.querySelector('.rs-p2'), p3 = rs.querySelector('.rs-p3'), p4 = rs.querySelector('.rs-p4');
    document.getElementById('rs-vale').addEventListener('click', function () {
      p3.classList.add('is-ok'); salta(p3);
      espera(function () { p4.classList.add('is-ok'); salta(p4); }, 450);
      hecho.textContent = txt('rs_hecho');
    });
    document.getElementById('rs-otra').addEventListener('click', function () {
      ri = (ri + 1) % R.length; var r = R[ri];
      rs.querySelector('.rs-nombre').textContent = r.n;
      rs.querySelector('.rs-cuando').textContent = r.c;
      var e = rs.querySelector('.rs-est'); e.textContent = r.e; e.setAttribute('aria-label', r.l);
      rs.querySelector('.rs-txt').textContent = r.t;
      rs.querySelector('.rs-bor').textContent = r.b;
      p2.classList.remove('is-ok'); p3.classList.remove('is-ok'); p4.classList.remove('is-ok'); hecho.textContent = '';
      salta(rs.querySelector('.rs__res'));
      ticket(rs);
      espera(function () { p2.classList.add('is-ok'); salta(p2); }, 1300);
    });
  }

  /* Apps: al tocar una, la barra dice su condición (y, en «Ya lo conecto», qué la usa) */
  var FORMA = { webs: '', reservas: '', google: ' l3-f--c', resenas: ' l3-f--t' };
  var COLOR = { webs: 'var(--l-webs)', reservas: 'var(--r-reservas)', google: 'var(--r-google)', resenas: 'var(--r-resenas)' };
  var aps = [].slice.call(document.querySelectorAll('.l3-apps .ap'));
  var pt = document.getElementById('cx-pide-t'), pa = document.getElementById('cx-pide-a'), pu = document.getElementById('cx-usa');
  aps.forEach(function (m) {
    m.addEventListener('click', function () {
      aps.forEach(function (x) { x.classList.toggle('is-on', x === m); x.setAttribute('aria-pressed', x === m ? 'true' : 'false'); });
      var n = (m.querySelector('.ap__n') || m).textContent.trim(), info = m.dataset.i ? txt(m.dataset.i) : '', usa = m.dataset.usa;
      if (usa) {
        pt.textContent = n + (info ? ': ' + info : '');
        var r = usa.split(' ');
        pu.innerHTML = '';
        var k = document.createElement('span'); k.textContent = txt(r.length > 1 ? 'lo_usan' : 'lo_usa'); pu.appendChild(k);
        r.forEach(function (x, i) {
          var s = document.createElement('span'); s.className = 'cx__usa-r';
          s.innerHTML = '<i class="l3-f' + FORMA[x] + '" style="--m:' + COLOR[x] + '" aria-hidden="true"></i>';
          s.appendChild(document.createTextNode(txt('rama_' + x)));
          pu.appendChild(s);
          setTimeout(function () { salta(s); }, i * 90);
        });
        pu.hidden = false;
      } else {
        pt.textContent = txt('pide').replace('{app}', n) + (info ? ' (' + info.replace(/\.$/, '') + ')' : '');
        pu.hidden = true;
      }
      pa.href = 'https://wa.me/34611497409?text=' + encodeURIComponent(txt('pide_wa').replace('{app}', n));
      salta(m); salta(pt);
    });
  });

  /* Branding: el nivel que se toca se marca y su precio salta */
  var bn = [].slice.call(document.querySelectorAll('.br__n'));
  bn.forEach(function (b) {
    b.addEventListener('click', function () {
      bn.forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      salta(b.querySelector('.br__np'));
    });
  });
})();

/* Texto y paneles al hacer scroll (solo en las secciones .l3) */
window.addEventListener('load', function () {
  if (!window.gsap || !window.SplitText || !window.ScrollTrigger) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  document.fonts.ready.then(function () {
    document.querySelectorAll('.l3 h2.tt').forEach(function (h) {
      var s = SplitText.create(h, { type: 'lines', mask: 'lines', aria: 'auto' });
      gsap.from(s.lines, { yPercent: 105, duration: 0.9, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: h, start: 'top 90%', once: true } });
    });
    gsap.utils.toArray('.au__lede, .br__lede, .pr__lede, .pr__gar').forEach(function (p) {
      gsap.from(p, { y: 20, opacity: 0, duration: 0.8, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: p, start: 'top 92%', once: true } });
    });
    gsap.utils.toArray('.ln__f').forEach(function (f) {
      var tl = gsap.timeline({ scrollTrigger: { trigger: f, start: 'top 88%', once: true } });
      tl.from(f.querySelector('.ln__marca'), { scaleX: 0, duration: 0.8, ease: 'expo.out' })
        .from(f.querySelectorAll('.ln__n, .ln__p, .ln__pr, .l3-a'), { y: 22, opacity: 0, duration: 0.7, ease: 'expo.out', stagger: 0.06, clearProps: 'transform,opacity' }, '<0.1');
    });
    gsap.from('.l3-au .ramas button', { y: 18, opacity: 0, duration: 0.6, ease: 'expo.out', stagger: 0.07, clearProps: 'transform,opacity', scrollTrigger: { trigger: '.l3-au .ramas', start: 'top 90%', once: true } });
    var vivo = document.querySelector('.l3-au .rm:not([hidden])');
    if (vivo) {
      gsap.fromTo(vivo.querySelector('.rm__vista'), { clipPath: 'inset(14% 0% 0% 0%)', y: 40 }, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1, ease: 'expo.out', clearProps: 'clipPath,transform', scrollTrigger: { trigger: vivo, start: 'top 85%', once: true } });
      var im = vivo.querySelector('.rmtel img');
      if (im) gsap.from(im, { scale: 1.12, duration: 1.4, ease: 'expo.out', clearProps: 'transform', scrollTrigger: { trigger: vivo, start: 'top 85%', once: true } });
    }
    var fin = document.getElementById('au-fin');
    if (fin) {
      var w = SplitText.create(fin, { type: 'words', aria: 'none' });
      gsap.fromTo(w.words, { opacity: 0.18 }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: fin, start: 'top 85%', end: 'bottom 55%', scrub: true } });
    }
    ScrollTrigger.batch('.l3-apps .ag', { start: 'top 92%', once: true, onEnter: function (b) { b.forEach(function (g, k) { gsap.from(g.querySelector('.ag__n'), { x: -14, opacity: 0, duration: 0.5, delay: k * 0.06, ease: 'expo.out', clearProps: 'transform,opacity' }); gsap.from(g.querySelectorAll('.ap'), { y: 16, scale: 0.92, opacity: 0, duration: 0.5, delay: 0.08 + k * 0.06, ease: 'back.out(1.6)', stagger: 0.04, clearProps: 'transform,opacity' }); }); } });
    gsap.from('.br__niv li', { x: -20, opacity: 0, duration: 0.6, ease: 'expo.out', stagger: 0.08, clearProps: 'transform,opacity', scrollTrigger: { trigger: '.br__niv', start: 'top 90%', once: true } });
    var hoja = document.querySelector('.l3-br .hoja');
    if (hoja) gsap.fromTo(hoja, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.out', clearProps: 'clipPath', scrollTrigger: { trigger: hoja, start: 'top 88%', once: true } });
    gsap.utils.toArray('.l3-pr .pr__col').forEach(function (c, i) {
      gsap.from(c, { y: 34, opacity: 0, duration: 0.8, delay: i * 0.08, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.l3-pr .pr__tres', start: 'top 88%', once: true } });
    });
    var cu = document.getElementById('cuota');
    if (cu) gsap.fromTo(cu, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'expo.out', clearProps: 'clipPath', scrollTrigger: { trigger: cu, start: 'top 90%', once: true } });
    gsap.utils.toArray('.l3 .l3-num').forEach(function (el) {
      if (el.closest('.pz-res')) return;
      var fin = +el.dataset.n, o = { v: 0 };
      ScrollTrigger.create({ trigger: el, start: 'top 95%', once: true, onEnter: function () { gsap.to(o, { v: fin, duration: 0.9, ease: 'power3.out', onUpdate: function () { el.textContent = Math.round(o.v); } }); } });
    });
    ScrollTrigger.refresh();
  });
});
