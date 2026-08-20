/* Panel de finanzas — lee datos/Finanzas.xlsx y lo convierte en cuadro de mando.
   Sin build, sin backend, sin peticiones externas. El Excel es la fuente de la verdad. */

(() => {
  'use strict';

  const RUTA_POR_DEFECTO = 'datos/Finanzas.xlsx';
  const HOJA = 'Movimientos';
  const POR_PAGINA = 25;
  const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const $ = (sel) => document.querySelector(sel);

  // ── Estado ──────────────────────────────────────────────────────────────────
  const estado = {
    movimientos: [],
    origen: '',
    orden: { col: 'fecha', dir: 'desc' },
    pagina: 1,
    filtroGrafico: null, // categoría clicada en el gráfico
  };

  const graficos = {};

  // ── Formato ─────────────────────────────────────────────────────────────────
  // useGrouping 'always': si no, es-ES deja "8624 €" junto a "18.800 €" y no cuadra la vista.
  const fmtEuro = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, useGrouping: 'always' });
  const fmtEuroDec = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' });
  const fmtPct = new Intl.NumberFormat('es-ES', { style: 'percent', maximumFractionDigits: 1 });
  const fmtFecha = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const euro = (n) => fmtEuro.format(n || 0);
  const euroDec = (n) => fmtEuroDec.format(n || 0);

  // ── Lectura del Excel ───────────────────────────────────────────────────────
  const normalizar = (s) =>
    String(s ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();

  // Alias de cabecera → clave interna. Tolera renombres razonables.
  const ALIAS = {
    fecha: 'fecha',
    tipo: 'tipo',
    concepto: 'concepto',
    descripcion: 'concepto',
    categoria: 'categoria',
    'cliente / proveedor': 'quien',
    'cliente/proveedor': 'quien',
    cliente: 'quien',
    proveedor: 'quien',
    base: 'base',
    'base imponible': 'base',
    importe: 'base',
    'iva %': 'ivaPct',
    iva: 'ivaPct',
    'iva €': 'ivaEur',
    total: 'total',
    metodo: 'metodo',
    'metodo de pago': 'metodo',
    estado: 'estado',
    deducible: 'deducible',
    notas: 'notas',
  };

  // Acepta 1450, "1.450,00 €" (es) y "1,450.00 €" (en): manda el último separador.
  function aNumero(v) {
    if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
    if (v == null || v === '') return 0;

    let s = String(v).replace(/[^\d,.-]/g, '');
    if (!s) return 0;

    const ultimaComa = s.lastIndexOf(',');
    const ultimoPunto = s.lastIndexOf('.');
    if (ultimaComa > -1 && ultimoPunto > -1) {
      const decimal = ultimaComa > ultimoPunto ? ',' : '.';
      const miles = decimal === ',' ? '.' : ',';
      s = s.split(miles).join('').replace(decimal, '.');
    } else if (ultimaComa > -1) {
      // Una sola coma: decimal salvo que separe grupos de tres (1,450)
      s = /,\d{3}(\D|$)/.test(s) ? s.split(',').join('') : s.replace(',', '.');
    } else if (ultimoPunto > -1 && /\.\d{3}(\D|$)/.test(s) && !/\.\d{1,2}$/.test(s)) {
      s = s.split('.').join('');
    }

    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  }

  function aFecha(v) {
    if (v instanceof Date && !isNaN(v)) return v;
    if (typeof v === 'number') {
      const d = XLSX.SSF.parse_date_code(v);
      return d ? new Date(d.y, d.m - 1, d.d) : null;
    }
    if (typeof v === 'string') {
      const m = v.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
      if (m) return new Date(Number(m[3].length === 2 ? '20' + m[3] : m[3]), Number(m[2]) - 1, Number(m[1]));
      const d = new Date(v);
      if (!isNaN(d)) return d;
    }
    return null;
  }

  function parsearLibro(buffer, origen) {
    const libro = XLSX.read(buffer, { type: 'array', cellDates: true });
    const nombreHoja = libro.SheetNames.find((n) => normalizar(n) === normalizar(HOJA)) || libro.SheetNames[0];
    const hoja = libro.Sheets[nombreHoja];
    // raw: true → números y fechas nativos. Con raw:false llegan ya formateados
    // en inglés ("1,450.00") y se leerían mal.
    const matriz = XLSX.utils.sheet_to_json(hoja, { header: 1, raw: true, cellDates: true, defval: null });
    if (!matriz.length) throw new Error('La hoja está vacía.');

    const cabecera = matriz[0].map((h) => ALIAS[normalizar(h)] || null);
    if (!cabecera.includes('fecha') || !cabecera.includes('base')) {
      throw new Error(`La hoja "${nombreHoja}" no tiene las columnas Fecha y Base.`);
    }

    const filas = [];
    for (let i = 1; i < matriz.length; i++) {
      const cruda = {};
      cabecera.forEach((clave, c) => {
        if (clave) cruda[clave] = matriz[i][c];
      });

      const fecha = aFecha(cruda.fecha);
      const base = aNumero(cruda.base);
      // Fila vacía o de relleno: la hoja llega hasta 1000 filas preparadas.
      if (!fecha || !base) continue;

      let ivaPct = aNumero(cruda.ivaPct);
      if (ivaPct > 1) ivaPct /= 100; // admite 21 o 0,21

      const tipo = normalizar(cruda.tipo).startsWith('ing') ? 'Ingreso' : 'Gasto';
      const ivaEur = base * ivaPct;

      filas.push({
        // Fila real en la hoja: es lo que identifica el movimiento al borrarlo.
        filaExcel: i + 1,
        fecha,
        anio: fecha.getFullYear(),
        mes: fecha.getMonth(),
        trim: 'T' + (Math.floor(fecha.getMonth() / 3) + 1),
        tipo,
        concepto: String(cruda.concepto ?? '').trim(),
        categoria: String(cruda.categoria ?? 'Sin categoría').trim() || 'Sin categoría',
        quien: String(cruda.quien ?? '').trim(),
        base,
        ivaPct,
        ivaEur,
        total: base + ivaEur,
        metodo: String(cruda.metodo ?? '').trim(),
        estado: String(cruda.estado ?? '').trim(),
        deducible: !normalizar(cruda.deducible).startsWith('n'), // por defecto, deducible
      });
    }

    if (!filas.length) throw new Error('No hay movimientos con fecha e importe.');
    estado.movimientos = filas;
    estado.origen = origen;
    return filas;
  }

  // ── Filtros ─────────────────────────────────────────────────────────────────
  function leerFiltros() {
    return {
      anio: $('#fAnio').value,
      trim: $('#fTrim').value,
      tipo: $('#fTipo').value,
      cat: $('#fCat').value,
      estado: $('#fEstado').value,
      buscar: normalizar($('#fBuscar').value),
    };
  }

  function aplicar(movs, f, { ignorarTipo = false } = {}) {
    return movs.filter((m) => {
      if (f.anio && String(m.anio) !== f.anio) return false;
      if (f.trim && m.trim !== f.trim) return false;
      if (!ignorarTipo && f.tipo && m.tipo !== f.tipo) return false;
      if (f.cat && m.categoria !== f.cat) return false;
      if (f.estado && m.estado !== f.estado) return false;
      if (estado.filtroGrafico && m.categoria !== estado.filtroGrafico) return false;
      if (f.buscar) {
        const heno = normalizar(`${m.concepto} ${m.quien} ${m.categoria} ${m.metodo}`);
        if (!heno.includes(f.buscar)) return false;
      }
      return true;
    });
  }

  // Mismo filtro, periodo anterior: sirve para las variaciones de los KPIs.
  function periodoAnterior(f) {
    const anterior = { ...f };
    if (f.trim) {
      const t = Number(f.trim[1]);
      if (t === 1) {
        anterior.trim = 'T4';
        anterior.anio = String(Number(f.anio) - 1);
      } else {
        anterior.trim = 'T' + (t - 1);
      }
    } else if (f.anio) {
      anterior.anio = String(Number(f.anio) - 1);
    } else {
      return null;
    }
    return anterior;
  }

  const suma = (movs, tipo, campo = 'base') =>
    movs.reduce((acc, m) => (tipo && m.tipo !== tipo ? acc : acc + m[campo]), 0);

  // ── KPIs ────────────────────────────────────────────────────────────────────
  function pintarKpis(movs, movsAnt) {
    const ing = suma(movs, 'Ingreso');
    const gas = suma(movs, 'Gasto');
    const neto = ing - gas;
    const margen = ing ? neto / ing : 0;
    const pendiente = movs
      .filter((m) => m.tipo === 'Ingreso' && normalizar(m.estado) === 'pendiente')
      .reduce((a, m) => a + m.total, 0);
    const ivaRep = suma(movs.filter((m) => m.tipo === 'Ingreso'), null, 'ivaEur');
    const ivaSop = suma(movs.filter((m) => m.tipo === 'Gasto' && m.deducible), null, 'ivaEur');

    let ant = null;
    if (movsAnt) {
      const iA = suma(movsAnt, 'Ingreso');
      const gA = suma(movsAnt, 'Gasto');
      ant = { ing: iA, gas: gA, neto: iA - gA, margen: iA ? (iA - gA) / iA : 0 };
    }

    const delta = (actual, previo) => {
      if (ant === null || previo === undefined) return '';
      if (!previo) return '<span>sin referencia previa</span>';
      const v = (actual - previo) / Math.abs(previo);
      const cls = v >= 0 ? 'pos' : 'neg';
      const signo = v >= 0 ? '+' : '';
      return `<b class="${cls}">${signo}${fmtPct.format(v)}</b> vs periodo anterior`;
    };

    const tarjetas = [
      { etq: 'Ingresos', valor: euro(ing), cls: 'pos', pie: delta(ing, ant?.ing) },
      { etq: 'Gastos', valor: euro(gas), cls: 'neg', pie: delta(gas, ant?.gas) },
      { etq: 'Beneficio neto', valor: euro(neto), cls: neto >= 0 ? 'pos' : 'neg', pie: delta(neto, ant?.neto) },
      {
        etq: 'Margen neto',
        valor: fmtPct.format(margen),
        cls: margen >= 0 ? '' : 'neg',
        pie: ant ? `antes ${fmtPct.format(ant.margen)}` : '',
      },
      {
        etq: 'Pendiente de cobro',
        valor: euro(pendiente),
        cls: pendiente > 0 ? 'aviso' : '',
        pie: `${movs.filter((m) => m.tipo === 'Ingreso' && normalizar(m.estado) === 'pendiente').length} factura(s) sin cobrar`,
      },
      {
        etq: 'IVA a liquidar',
        valor: euro(ivaRep - ivaSop),
        cls: ivaRep - ivaSop > 0 ? 'neg' : 'pos',
        pie: `${euro(ivaRep)} repercutido · ${euro(ivaSop)} soportado`,
      },
    ];

    $('#kpis').innerHTML = tarjetas
      .map(
        (t) => `<article class="kpi">
          <div class="kpi-etq">${t.etq}</div>
          <div class="kpi-cifra ${t.cls}">${t.valor}</div>
          <div class="kpi-delta">${t.pie || '&nbsp;'}</div>
        </article>`
      )
      .join('');
  }

  // ── Gráficos ────────────────────────────────────────────────────────────────
  // El canvas no entiende color-mix(): las transparencias hay que darlas en rgba.
  function conAlfa(color, alfa) {
    const c = color.trim();
    const hex = c.match(/^#([0-9a-f]{6})$/i);
    if (hex) {
      const n = parseInt(hex[1], 16);
      return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alfa})`;
    }
    const rgb = c.match(/^rgba?\(([^)]+)\)$/i);
    if (rgb) {
      const [r, g, b] = rgb[1].split(/[,\s/]+/).map(Number);
      return `rgba(${r}, ${g}, ${b}, ${alfa})`;
    }
    return c;
  }

  function tema() {
    const cs = getComputedStyle(document.documentElement);
    const v = (n) => cs.getPropertyValue(n).trim();
    return {
      texto: v('--text'),
      muted: v('--muted'),
      linea: v('--line'),
      acento: v('--acento'),
      pos: v('--pos'),
      neg: v('--neg'),
      alerta: v('--alerta'),
      surface: v('--surface'),
    };
  }

  function baseOpciones(t) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 320 },
      plugins: {
        legend: {
          display: false,
          labels: { color: t.muted, boxWidth: 10, boxHeight: 10, font: { size: 11 } },
        },
        tooltip: {
          backgroundColor: t.surface,
          borderColor: t.linea,
          borderWidth: 1,
          titleColor: t.texto,
          bodyColor: t.texto,
          padding: 10,
          displayColors: true,
          callbacks: {
            label: (c) => ` ${c.dataset.label ? c.dataset.label + ': ' : ''}${euroDec(c.parsed.y ?? c.parsed.x ?? c.parsed)}`,
          },
        },
      },
      scales: {
        x: { grid: { display: false }, border: { color: t.linea }, ticks: { color: t.muted, font: { size: 11 } } },
        y: {
          grid: { color: t.linea, drawTicks: false },
          border: { display: false },
          ticks: { color: t.muted, font: { size: 11 }, callback: (v) => euro(v) },
        },
      },
    };
  }

  function dibujar(id, config) {
    if (graficos[id]) graficos[id].destroy();
    graficos[id] = new Chart(document.getElementById(id), config);
  }

  function pintarGraficos(movs, todosDelPeriodo) {
    const t = tema();

    // 1 · Ingresos vs gastos por mes
    const ing = new Array(12).fill(0);
    const gas = new Array(12).fill(0);
    movs.forEach((m) => (m.tipo === 'Ingreso' ? (ing[m.mes] += m.base) : (gas[m.mes] += m.base)));

    dibujar('gMensual', {
      type: 'bar',
      data: {
        labels: MESES,
        datasets: [
          { label: 'Ingresos', data: ing, backgroundColor: t.pos, borderRadius: 3, maxBarThickness: 22 },
          { label: 'Gastos', data: gas, backgroundColor: t.neg, borderRadius: 3, maxBarThickness: 22 },
        ],
      },
      options: {
        ...baseOpciones(t),
        plugins: { ...baseOpciones(t).plugins, legend: { display: true, position: 'bottom', labels: { color: t.muted, boxWidth: 10, boxHeight: 10, font: { size: 11 } } } },
      },
    });

    // 2 · Neto acumulado
    let acc = 0;
    const acumulado = ing.map((v, i) => (acc += v - gas[i]));
    dibujar('gAcumulado', {
      type: 'line',
      data: {
        labels: MESES,
        datasets: [
          {
            label: 'Neto acumulado',
            data: acumulado,
            borderColor: t.acento,
            backgroundColor: conAlfa(t.acento, 0.16),
            fill: true,
            tension: 0.32,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
        ],
      },
      options: baseOpciones(t),
    });
    $('#notaAcum').textContent = acumulado.length ? euro(acumulado[acumulado.length - 1]) : '';

    // 3 · Gasto por categoría (clic = filtro)
    const porCat = new Map();
    todosDelPeriodo.filter((m) => m.tipo === 'Gasto').forEach((m) => porCat.set(m.categoria, (porCat.get(m.categoria) || 0) + m.base));
    const cats = [...porCat.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

    dibujar('gCategorias', {
      type: 'bar',
      data: {
        labels: cats.map((c) => c[0]),
        datasets: [{ label: 'Gasto', data: cats.map((c) => c[1]), backgroundColor: t.neg, borderRadius: 3, maxBarThickness: 16 }],
      },
      options: {
        ...baseOpciones(t),
        indexAxis: 'y',
        scales: {
          x: { grid: { color: t.linea, drawTicks: false }, border: { display: false }, ticks: { color: t.muted, font: { size: 11 }, callback: (v) => euro(v) } },
          y: { grid: { display: false }, border: { color: t.linea }, ticks: { color: t.muted, font: { size: 11 } } },
        },
        onClick: (_e, elementos) => {
          const entrada = elementos.length && cats[elementos[0].index];
          if (!entrada) return;
          const cat = entrada[0];
          estado.filtroGrafico = estado.filtroGrafico === cat ? null : cat;
          estado.pagina = 1;
          refrescar();
        },
      },
    });

    // 4 · Top clientes por facturación
    const porCliente = new Map();
    todosDelPeriodo
      .filter((m) => m.tipo === 'Ingreso' && m.quien)
      .forEach((m) => porCliente.set(m.quien, (porCliente.get(m.quien) || 0) + m.base));
    const clientes = [...porCliente.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

    dibujar('gClientes', {
      type: 'bar',
      data: {
        labels: clientes.map((c) => c[0]),
        datasets: [{ label: 'Facturado', data: clientes.map((c) => c[1]), backgroundColor: t.acento, borderRadius: 3, maxBarThickness: 16 }],
      },
      options: {
        ...baseOpciones(t),
        indexAxis: 'y',
        scales: {
          x: { grid: { color: t.linea, drawTicks: false }, border: { display: false }, ticks: { color: t.muted, font: { size: 11 }, callback: (v) => euro(v) } },
          y: { grid: { display: false }, border: { color: t.linea }, ticks: { color: t.muted, font: { size: 11 } } },
        },
      },
    });

    // 5 · IVA por trimestre
    const trims = ['T1', 'T2', 'T3', 'T4'];
    const rep = trims.map((tr) => todosDelPeriodo.filter((m) => m.trim === tr && m.tipo === 'Ingreso').reduce((a, m) => a + m.ivaEur, 0));
    const sop = trims.map((tr) => todosDelPeriodo.filter((m) => m.trim === tr && m.tipo === 'Gasto' && m.deducible).reduce((a, m) => a + m.ivaEur, 0));

    dibujar('gIva', {
      type: 'bar',
      data: {
        labels: trims,
        datasets: [
          { label: 'Repercutido', data: rep, backgroundColor: t.pos, borderRadius: 3, maxBarThickness: 26 },
          { label: 'Soportado', data: sop, backgroundColor: t.muted, borderRadius: 3, maxBarThickness: 26 },
          { label: 'A liquidar', data: rep.map((v, i) => v - sop[i]), backgroundColor: t.alerta, borderRadius: 3, maxBarThickness: 26 },
        ],
      },
      options: {
        ...baseOpciones(t),
        plugins: { ...baseOpciones(t).plugins, legend: { display: true, position: 'bottom', labels: { color: t.muted, boxWidth: 10, boxHeight: 10, font: { size: 11 } } } },
      },
    });
  }

  // ── Tabla ───────────────────────────────────────────────────────────────────
  function pintarTabla(movs) {
    const { col, dir } = estado.orden;
    const signo = dir === 'asc' ? 1 : -1;
    const ordenados = [...movs].sort((a, b) => {
      const x = a[col], y = b[col];
      if (x instanceof Date) return (x - y) * signo;
      if (typeof x === 'number') return (x - y) * signo;
      return String(x).localeCompare(String(y), 'es') * signo;
    });

    const paginas = Math.max(1, Math.ceil(ordenados.length / POR_PAGINA));
    estado.pagina = Math.min(estado.pagina, paginas);
    const desde = (estado.pagina - 1) * POR_PAGINA;
    const pagina = ordenados.slice(desde, desde + POR_PAGINA);

    $('#tbody').innerHTML = pagina
      .map((m) => {
        const esIng = m.tipo === 'Ingreso';
        const pendiente = normalizar(m.estado) === 'pendiente';
        return `<tr>
          <td class="num">${fmtFecha.format(m.fecha)}</td>
          <td><span class="chip ${esIng ? 'ingreso' : 'gasto'}">${m.tipo}</span></td>
          <td class="ancho">${escapar(m.concepto)}</td>
          <td>${escapar(m.categoria)}</td>
          <td>${escapar(m.quien)}</td>
          <td class="num ${esIng ? 'pos' : 'neg'}">${esIng ? '' : '−'}${euroDec(m.base)}</td>
          <td class="num">${euroDec(m.ivaEur)}</td>
          <td class="num">${euroDec(m.total)}</td>
          <td>${escapar(m.metodo)}</td>
          <td><span class="chip ${pendiente ? 'pendiente' : ''}">${escapar(m.estado)}</span></td>
          <td class="acciones">
            <button class="borrar" data-fila="${m.filaExcel}" title="Borrar este movimiento" aria-label="Borrar ${escapar(m.concepto)}">✕</button>
          </td>
        </tr>`;
      })
      .join('');

    $('#infoPag').textContent = `${ordenados.length} movimiento(s) · página ${estado.pagina} de ${paginas}`;
    $('#btnPrev').disabled = estado.pagina <= 1;
    $('#btnNext').disabled = estado.pagina >= paginas;
    $('#notaTabla').textContent = `${ordenados.length} de ${estado.movimientos.length}`;

    document.querySelectorAll('#tabla thead th[data-col]').forEach((th) => {
      th.setAttribute('aria-sort', th.dataset.col === col ? (dir === 'asc' ? 'ascending' : 'descending') : 'none');
    });
  }

  const escapar = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ── Orquestación ────────────────────────────────────────────────────────────
  function refrescar() {
    const f = leerFiltros();
    const movs = aplicar(estado.movimientos, f);
    // Los gráficos de reparto ignoran el filtro de Tipo: si no, media pantalla queda vacía.
    const delPeriodo = aplicar(estado.movimientos, f, { ignorarTipo: true });

    const fAnt = periodoAnterior(f);
    const movsAnt = fAnt ? aplicar(estado.movimientos, fAnt) : null;

    pintarKpis(movs, movsAnt);
    pintarGraficos(movs, delPeriodo);
    pintarTabla(movs);

    const aviso = $('#avisoFiltro');
    if (estado.filtroGrafico) {
      aviso.classList.add('visible');
      $('#avisoTexto').textContent = `Filtrando por categoría: ${estado.filtroGrafico}`;
    } else {
      aviso.classList.remove('visible');
    }
  }

  function poblarFiltros() {
    const anios = [...new Set(estado.movimientos.map((m) => m.anio))].sort((a, b) => b - a);
    $('#fAnio').innerHTML = ['<option value="">Todos los años</option>', ...anios.map((a) => `<option value="${a}">${a}</option>`)].join('');
    const actual = new Date().getFullYear();
    $('#fAnio').value = anios.includes(actual) ? String(actual) : String(anios[0] ?? '');

    const cats = [...new Set(estado.movimientos.map((m) => m.categoria))].sort((a, b) => a.localeCompare(b, 'es'));
    $('#fCat').innerHTML = ['<option value="">Todas</option>', ...cats.map((c) => `<option>${escapar(c)}</option>`)].join('');

    const estados = [...new Set(estado.movimientos.map((m) => m.estado).filter(Boolean))].sort();
    $('#fEstado').innerHTML = ['<option value="">Todos</option>', ...estados.map((e) => `<option>${escapar(e)}</option>`)].join('');
  }

  function mostrarPanel() {
    $('#vacio').classList.add('oculto');
    $('#panel').classList.remove('oculto');
    $('#origen').textContent = estado.origen;
    $('#pieOrigen').textContent = `Origen: ${estado.origen} · ${estado.movimientos.length} movimientos`;
  }

  function mostrarVacio(mensaje) {
    $('#panel').classList.add('oculto');
    $('#vacio').classList.remove('oculto');
    $('#origen').textContent = 'sin datos';
    if (mensaje) $('#vacioTexto').innerHTML = mensaje;
  }

  async function cargarDesdeBuffer(buffer, origen) {
    parsearLibro(buffer, origen);
    poblarFiltros();
    estado.filtroGrafico = null;
    estado.pagina = 1;
    mostrarPanel();
    refrescar();
  }

  async function cargarPorDefecto() {
    let respuesta;
    try {
      respuesta = await fetch(RUTA_POR_DEFECTO, { cache: 'no-store' });
      if (!respuesta.ok) throw new Error('no encontrado');
    } catch {
      mostrarVacio(
        `No he podido leer <code>${RUTA_POR_DEFECTO}</code>. Genéralo con <code>npm run excel</code>, o arrastra aquí tu propio archivo.`
      );
      return;
    }
    try {
      await cargarDesdeBuffer(await respuesta.arrayBuffer(), RUTA_POR_DEFECTO);
    } catch {
      // El libro existe pero aún no tiene movimientos.
      estado.movimientos = [];
      mostrarVacio('Todavía no hay movimientos. Pulsa <b>+ Movimiento</b> arriba para apuntar el primero.');
    }
  }

  // ── Eventos ─────────────────────────────────────────────────────────────────
  function conectarEventos() {
    ['fAnio', 'fTrim', 'fTipo', 'fCat', 'fEstado'].forEach((id) =>
      $('#' + id).addEventListener('change', () => {
        estado.pagina = 1;
        refrescar();
      })
    );

    let temporizador;
    $('#fBuscar').addEventListener('input', () => {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => {
        estado.pagina = 1;
        refrescar();
      }, 180);
    });

    $('#btnLimpiar').addEventListener('click', () => {
      estado.filtroGrafico = null;
      refrescar();
    });

    $('#btnPrev').addEventListener('click', () => {
      estado.pagina--;
      refrescar();
    });
    $('#btnNext').addEventListener('click', () => {
      estado.pagina++;
      refrescar();
    });

    document.querySelectorAll('#tabla thead th[data-col]').forEach((th) => {
      const ordenar = () => {
        const col = th.dataset.col;
        estado.orden = { col, dir: estado.orden.col === col && estado.orden.dir === 'desc' ? 'asc' : 'desc' };
        refrescar();
      };
      th.addEventListener('click', ordenar);
      th.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          ordenar();
        }
      });
    });

    // Tema
    const guardado = localStorage.getItem('panel-finanzas:tema');
    if (guardado) document.documentElement.dataset.tema = guardado;
    $('#btnTema').addEventListener('click', () => {
      const nuevo = document.documentElement.dataset.tema === 'claro' ? 'oscuro' : 'claro';
      document.documentElement.dataset.tema = nuevo;
      localStorage.setItem('panel-finanzas:tema', nuevo);
      if (estado.movimientos.length) refrescar();
    });

    // Carga manual
    const abrir = () => $('#inputArchivo').click();
    $('#btnArchivo').addEventListener('click', abrir);
    $('#btnArchivo2').addEventListener('click', abrir);
    $('#inputArchivo').addEventListener('change', async (e) => {
      const archivo = e.target.files[0];
      if (!archivo) return;
      try {
        await cargarDesdeBuffer(await archivo.arrayBuffer(), archivo.name);
      } catch (err) {
        mostrarVacio(`No he podido leer <code>${escapar(archivo.name)}</code>: ${escapar(err.message)}`);
      }
    });

    // Arrastrar y soltar
    const capa = $('#soltar');
    let arrastres = 0;
    window.addEventListener('dragenter', (e) => {
      e.preventDefault();
      arrastres++;
      capa.classList.add('visible');
    });
    window.addEventListener('dragover', (e) => e.preventDefault());
    window.addEventListener('dragleave', () => {
      if (--arrastres <= 0) capa.classList.remove('visible');
    });
    window.addEventListener('drop', async (e) => {
      e.preventDefault();
      arrastres = 0;
      capa.classList.remove('visible');
      const archivo = e.dataTransfer.files[0];
      if (!archivo) return;
      try {
        await cargarDesdeBuffer(await archivo.arrayBuffer(), archivo.name);
      } catch (err) {
        mostrarVacio(`No he podido leer <code>${escapar(archivo.name)}</code>: ${escapar(err.message)}`);
      }
    });
  }

  // ── Alta de movimientos ─────────────────────────────────────────────────────
  const LISTAS_POR_DEFECTO = {
    gasto: ['Hosting y dominios', 'Software y licencias', 'Publicidad', 'Formación', 'Material y equipo', 'Desplazamientos', 'Suministros oficina', 'Gestoría', 'Cuota autónomos', 'Comisiones bancarias', 'Subcontratación', 'Otros gastos'],
    ingreso: ['Diseño web', 'Mantenimiento web', 'SEO local', 'Automatizaciones', 'Fotografía / contenido', 'Consultoría', 'Otros ingresos'],
    metodos: ['Banco', 'Tarjeta', 'Efectivo', 'Bizum', 'Domiciliado'],
    estados: ['Cobrado', 'Pendiente', 'Pagado'],
  };

  let listas = LISTAS_POR_DEFECTO;

  const dlg = $('#dlgMovimiento');
  const form = $('#formMovimiento');

  function brindis(texto) {
    const el = $('#brindis');
    el.textContent = texto;
    el.classList.add('visible');
    clearTimeout(brindis.reloj);
    brindis.reloj = setTimeout(() => el.classList.remove('visible'), 2600);
  }

  const tipoElegido = () => form.querySelector('input[name="tipo"]:checked').value;

  function rellenarListasFormulario() {
    const esIngreso = tipoElegido() === 'Ingreso';
    const cats = esIngreso ? listas.ingreso : listas.gasto;
    $('#listaCategorias').innerHTML = cats.map((c) => `<option value="${escapar(c)}">`).join('');

    const gente = [...new Set(estado.movimientos.map((m) => m.quien).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
    $('#listaQuien').innerHTML = gente.map((g) => `<option value="${escapar(g)}">`).join('');

    const opciones = (sel, valores, elegido) => {
      sel.innerHTML = valores.map((v) => `<option${v === elegido ? ' selected' : ''}>${escapar(v)}</option>`).join('');
    };
    opciones($('#mMetodo'), listas.metodos, esIngreso ? 'Banco' : 'Tarjeta');
    opciones($('#mEstado'), listas.estados, esIngreso ? 'Pendiente' : 'Pagado');
    $('#mDeducible').value = esIngreso ? 'No' : 'Sí';
  }

  function actualizarResumen() {
    const base = aNumero(form.base.value);
    const ivaPct = Number(form.ivaPct.value) / 100;
    const repetir = Number(form.repetir.value);
    const cuota = base * (1 + ivaPct);

    if (!base) {
      $('#dlgResumen').textContent = '';
      return;
    }

    const partes = [
      `${tipoElegido()} de <b>${euroDec(base)}</b> + ${euroDec(base * ivaPct)} de IVA = <b>${euroDec(cuota)}</b>`,
    ];
    if (repetir > 1) {
      const desde = new Date(form.fecha.value + 'T00:00:00');
      const hasta = new Date(desde.getFullYear(), desde.getMonth() + repetir - 1, desde.getDate());
      const mes = (d) => d.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
      partes.push(`× ${repetir} meses (${mes(desde)} → ${mes(hasta)}) = <b>${euroDec(cuota * repetir)}</b>`);
    }
    $('#dlgResumen').innerHTML = partes.join(' · ');
  }

  function abrirDialogo() {
    form.reset();
    form.fecha.value = new Date().toISOString().slice(0, 10);
    rellenarListasFormulario();
    $('#dlgError').textContent = '';
    $('#dlgResumen').textContent = '';
    dlg.showModal();
    setTimeout(() => form.concepto.focus(), 40);
  }

  async function guardarMovimiento(evento) {
    evento.preventDefault();
    $('#dlgError').textContent = '';

    const base = aNumero(form.base.value);
    if (!base) {
      $('#dlgError').textContent = 'Pon un importe mayor que cero.';
      form.base.focus();
      return;
    }

    const repetir = Number(form.repetir.value);
    const [a, m, d] = form.fecha.value.split('-').map(Number);
    const comun = {
      tipo: tipoElegido(),
      concepto: form.concepto.value,
      categoria: form.categoria.value,
      quien: form.quien.value,
      base,
      ivaPct: Number(form.ivaPct.value),
      metodo: form.metodo.value,
      estado: form.estado.value,
      deducible: form.deducible.value,
      notas: form.notas.value,
    };

    // Mensualidades: mismo día de cada mes, ajustando si el mes es más corto.
    const lote = Array.from({ length: repetir }, (_, i) => {
      const ultimoDia = new Date(a, m - 1 + i + 1, 0).getDate();
      const dia = String(Math.min(d, ultimoDia)).padStart(2, '0');
      const fecha = new Date(a, m - 1 + i, 1);
      return { ...comun, fecha: `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${dia}` };
    });

    const boton = $('#btnGuardar');
    boton.disabled = true;
    boton.textContent = 'Guardando…';

    try {
      const r = await fetch('/api/movimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lote),
      });
      const cuerpo = await r.json();
      if (!r.ok) throw new Error(cuerpo.error || 'No se pudo guardar.');

      dlg.close();
      await cargarPorDefecto();
      brindis(repetir > 1 ? `${repetir} movimientos guardados en el Excel` : 'Movimiento guardado en el Excel');
    } catch (e) {
      $('#dlgError').textContent = e.message;
    } finally {
      boton.disabled = false;
      boton.textContent = 'Guardar';
    }
  }

  async function borrarFila(boton) {
    const filaExcel = Number(boton.dataset.fila);
    const mov = estado.movimientos.find((m) => m.filaExcel === filaExcel);
    if (!mov) return;

    const resumen = `${fmtFecha.format(mov.fecha)} · ${mov.concepto} · ${euroDec(mov.base)}`;
    if (!confirm(`¿Borrar este movimiento del Excel?\n\n${resumen}\n\nQueda una copia en datos/Finanzas.respaldo.xlsx.`)) return;

    boton.disabled = true;
    try {
      const r = await fetch('/api/movimientos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fila: filaExcel, concepto: mov.concepto, base: mov.base }),
      });
      const cuerpo = await r.json();
      if (!r.ok) throw new Error(cuerpo.error || 'No se pudo borrar.');

      await cargarPorDefecto();
      brindis('Movimiento borrado del Excel');
    } catch (e) {
      boton.disabled = false;
      brindis(e.message);
    }
  }

  async function conectarFormulario() {
    try {
      const r = await fetch('/api/listas');
      if (r.ok) {
        const l = await r.json();
        if (l && l.gasto?.length) listas = { ...LISTAS_POR_DEFECTO, ...l };
      }
    } catch {
      /* sin servidor propio: se usan las listas por defecto */
    }

    $('#btnNuevo').addEventListener('click', abrirDialogo);

    // Delegación: la tabla se repinta entera en cada refresco.
    $('#tbody').addEventListener('click', (e) => {
      const boton = e.target.closest('.borrar');
      if (boton) borrarFila(boton);
    });

    $('#btnCerrarDlg').addEventListener('click', () => dlg.close());
    $('#btnCancelar').addEventListener('click', () => dlg.close());
    form.addEventListener('submit', guardarMovimiento);

    form.querySelectorAll('input[name="tipo"]').forEach((r) =>
      r.addEventListener('change', () => {
        rellenarListasFormulario();
        actualizarResumen();
      })
    );
    ['base', 'ivaPct', 'repetir', 'fecha'].forEach((n) => form[n].addEventListener('input', actualizarResumen));

    // Atajo: N abre el alta, salvo mientras escribes en un campo.
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() !== 'n' || e.ctrlKey || e.altKey || e.metaKey) return;
      if (dlg.open || /^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement?.tagName)) return;
      e.preventDefault();
      abrirDialogo();
    });
  }

  conectarEventos();
  conectarFormulario();
  cargarPorDefecto();
})();
