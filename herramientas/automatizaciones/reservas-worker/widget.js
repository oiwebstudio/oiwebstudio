/**
 * Widget de reservas · OI Studio
 *
 * Uso: pegar en la web del cliente:
 * <div id="oi-reservas"></div>
 * <script src="https://oi-reservas.oi-studio-web.workers.dev/widget.js"
 *         data-negocio="errotatxo"></script>
 */
(function () {
  const script = document.currentScript;
  const slug = script?.getAttribute('data-negocio');
  const API = 'https://oi-reservas.oi-studio-web.workers.dev/api';
  const root = document.getElementById('oi-reservas') || script?.parentElement;

  if (!slug || !root) return;

  root.innerHTML = `
    <style>
      .oi-r{font-family:system-ui,sans-serif;max-width:420px;margin:0 auto}
      .oi-r *{box-sizing:border-box}
      .oi-r label{display:block;margin:0.6em 0 0.2em;font-size:0.9em;font-weight:500}
      .oi-r input,.oi-r select,.oi-r textarea{width:100%;padding:0.6em;border:1px solid #ccc;border-radius:6px;font-size:1em}
      .oi-r input:focus,.oi-r select:focus,.oi-r textarea:focus{outline:none;border-color:#2563eb}
      .oi-r button{margin-top:1em;width:100%;padding:0.8em;background:#2563eb;color:#fff;border:none;border-radius:8px;font-size:1em;font-weight:600;cursor:pointer}
      .oi-r button:hover{background:#1d4ed8}
      .oi-r button:disabled{opacity:0.5;cursor:not-allowed}
      .oi-r .huecos{display:flex;flex-wrap:wrap;gap:0.4em;margin-top:0.4em}
      .oi-r .hueco{padding:0.4em 0.8em;border:1px solid #2563eb;border-radius:6px;cursor:pointer;font-size:0.9em;background:#fff;transition:all 0.15s}
      .oi-r .hueco:hover,.oi-r .hueco.sel{background:#2563eb;color:#fff}
      .oi-r .msg{padding:1em;border-radius:8px;margin-top:1em;text-align:center}
      .oi-r .msg.ok{background:#dcfce7;color:#166534}
      .oi-r .msg.err{background:#fee2e2;color:#991b1b}
      .oi-r .cargando{text-align:center;padding:1em;color:#666}
    </style>
    <div class="oi-r">
      <div id="oi-r-cargando" class="cargando">Cargando...</div>
      <form id="oi-r-form" style="display:none" autocomplete="on">
        <div id="oi-r-servicios-wrap"></div>
        <label>Fecha</label>
        <input type="date" id="oi-r-fecha" required min="">
        <div id="oi-r-huecos-wrap" style="display:none">
          <label>Hora disponible</label>
          <div class="huecos" id="oi-r-huecos"></div>
        </div>
        <input type="hidden" id="oi-r-hora" value="">
        <label>Nombre</label>
        <input type="text" id="oi-r-nombre" required placeholder="Tu nombre">
        <label>Teléfono (WhatsApp)</label>
        <input type="tel" id="oi-r-tel" required placeholder="600 000 000">
        <label>Email <span style="color:#999">(opcional)</span></label>
        <input type="email" id="oi-r-email" placeholder="tu@email.com">
        <label>Nota <span style="color:#999">(opcional)</span></label>
        <textarea id="oi-r-nota" rows="2" placeholder="Algo que debamos saber..."></textarea>
        <button type="submit" id="oi-r-btn">Reservar</button>
      </form>
      <div id="oi-r-msg" style="display:none"></div>
    </div>
  `;

  const form = root.querySelector('#oi-r-form');
  const cargando = root.querySelector('#oi-r-cargando');
  const serviciosWrap = root.querySelector('#oi-r-servicios-wrap');
  const fechaInput = root.querySelector('#oi-r-fecha');
  const huecosWrap = root.querySelector('#oi-r-huecos-wrap');
  const huecosDiv = root.querySelector('#oi-r-huecos');
  const horaInput = root.querySelector('#oi-r-hora');
  const msgDiv = root.querySelector('#oi-r-msg');
  const btn = root.querySelector('#oi-r-btn');

  let servicios = [];
  let duracionActual = 60;

  // Cargar servicios
  fetch(`${API}/${slug}/servicios`)
    .then(r => r.json())
    .then(data => {
      servicios = data.servicios || [];
      if (servicios.length > 0) {
        serviciosWrap.innerHTML = '<label>Servicio</label><select id="oi-r-servicio">'
          + servicios.map(s =>
            `<option value="${s.id}" data-dur="${s.duracion}">${s.nombre}${s.precio ? ` · ${s.precio} €` : ''}</option>`
          ).join('') + '</select>';
        duracionActual = servicios[0].duracion;
        root.querySelector('#oi-r-servicio').addEventListener('change', function () {
          duracionActual = parseInt(this.selectedOptions[0].dataset.dur) || 60;
          if (fechaInput.value) cargarHuecos(fechaInput.value);
        });
      }
      const hoy = new Date().toISOString().slice(0, 10);
      fechaInput.min = hoy;
      cargando.style.display = 'none';
      form.style.display = 'block';
    })
    .catch(() => {
      cargando.textContent = 'No se pudo cargar. Inténtalo de nuevo.';
    });

  // Al elegir fecha, cargar huecos
  fechaInput.addEventListener('change', function () {
    if (this.value) cargarHuecos(this.value);
  });

  function cargarHuecos(fecha) {
    huecosDiv.innerHTML = '<span class="cargando">Buscando huecos...</span>';
    huecosWrap.style.display = 'block';
    horaInput.value = '';

    fetch(`${API}/${slug}/huecos?fecha=${fecha}&duracion=${duracionActual}`)
      .then(r => r.json())
      .then(data => {
        if (data.cerrado) {
          huecosDiv.innerHTML = '<span style="color:#991b1b">Cerrado este día</span>';
          return;
        }
        if (!data.huecos || data.huecos.length === 0) {
          huecosDiv.innerHTML = '<span style="color:#991b1b">No hay huecos disponibles</span>';
          return;
        }
        huecosDiv.innerHTML = data.huecos.map(h =>
          `<span class="hueco" data-hora="${h}">${h}</span>`
        ).join('');
        huecosDiv.querySelectorAll('.hueco').forEach(el => {
          el.addEventListener('click', function () {
            huecosDiv.querySelectorAll('.hueco').forEach(e => e.classList.remove('sel'));
            this.classList.add('sel');
            horaInput.value = this.dataset.hora;
          });
        });
      });
  }

  // Enviar reserva
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!horaInput.value) {
      msgDiv.className = 'msg err';
      msgDiv.textContent = 'Elige una hora disponible';
      msgDiv.style.display = 'block';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Reservando...';
    msgDiv.style.display = 'none';

    const servicioSelect = root.querySelector('#oi-r-servicio');

    fetch(`${API}/${slug}/reservar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: root.querySelector('#oi-r-nombre').value,
        telefono: root.querySelector('#oi-r-tel').value,
        email: root.querySelector('#oi-r-email').value || undefined,
        fecha: fechaInput.value,
        hora: horaInput.value,
        servicio_id: servicioSelect ? parseInt(servicioSelect.value) : undefined,
        nota: root.querySelector('#oi-r-nota').value || undefined,
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          form.style.display = 'none';
          msgDiv.className = 'msg ok';
          msgDiv.innerHTML = '✓ Reserva confirmada. Te hemos enviado la confirmación por WhatsApp.';
          msgDiv.style.display = 'block';
        } else if (data.motivo === 'ocupado') {
          msgDiv.className = 'msg err';
          msgDiv.innerHTML = 'Esa hora ya está ocupada.'
            + (data.alternativas?.length ? '<br>Prueba con: ' + data.alternativas.join(', ') : '');
          msgDiv.style.display = 'block';
          btn.disabled = false;
          btn.textContent = 'Reservar';
        } else {
          throw new Error(data.error || 'Error');
        }
      })
      .catch(() => {
        msgDiv.className = 'msg err';
        msgDiv.textContent = 'Error al reservar. Inténtalo de nuevo.';
        msgDiv.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Reservar';
      });
  });
})();
