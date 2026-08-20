// Servidor estático mínimo para el panel. Solo escucha en 127.0.0.1.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  actualizarObjetivo,
  anadirMovimientos,
  anadirObjetivo,
  borrarMovimiento,
  borrarObjetivo,
  guardarHabitosDelDia,
  guardarPresupuestos,
  importarMovimientos,
  leerHabitos,
  leerListas,
  leerPresupuestos,
} from './scripts/movimientos.mjs';

const RAIZ = dirname(fileURLToPath(import.meta.url));
const PUERTO = Number(process.env.PORT) || 4400;

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const json = (res, codigo, cuerpo) => {
  res.writeHead(codigo, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(cuerpo));
};

const leerCuerpo = (req) =>
  new Promise((cumple, falla) => {
    let datos = '';
    req.on('data', (trozo) => {
      datos += trozo;
      if (datos.length > 1e6) falla(new Error('Petición demasiado grande.'));
    });
    req.on('end', () => cumple(datos));
    req.on('error', falla);
  });

const servidor = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PUERTO}`);
    const pedido = decodeURIComponent(url.pathname);

    // ── API ─────────────────────────────────────────────────────────────────
    if (pedido === '/api/listas' && req.method === 'GET') {
      try {
        return json(res, 200, await leerListas());
      } catch (e) {
        return json(res, 500, { error: e.message });
      }
    }

    if (pedido === '/api/movimientos' && req.method === 'POST') {
      try {
        const cuerpo = JSON.parse((await leerCuerpo(req)) || 'null');
        if (!cuerpo) return json(res, 400, { error: 'Cuerpo vacío.' });
        const escritas = await anadirMovimientos(cuerpo);
        console.log(`  + ${escritas.map((m) => `${m.tipo} ${m.base} € · ${m.concepto}`).join(' | ')}`);
        return json(res, 201, { ok: true, escritas });
      } catch (e) {
        return json(res, 400, { error: e.message });
      }
    }

    if (pedido === '/api/movimientos' && req.method === 'DELETE') {
      try {
        const cuerpo = JSON.parse((await leerCuerpo(req)) || '{}');
        const { borrado, quedan } = await borrarMovimiento(cuerpo.fila, cuerpo);
        console.log(`  − ${borrado.tipo} ${borrado.base} € · ${borrado.concepto} (quedan ${quedan})`);
        return json(res, 200, { ok: true, borrado, quedan });
      } catch (e) {
        return json(res, 400, { error: e.message });
      }
    }

    if (pedido === '/api/objetivos' && req.method === 'POST') {
      try {
        const obj = await anadirObjetivo(JSON.parse((await leerCuerpo(req)) || '{}'));
        console.log(`  + objetivo: ${obj.nombre}`);
        return json(res, 201, { ok: true, objetivo: obj });
      } catch (e) {
        return json(res, 400, { error: e.message });
      }
    }

    if (pedido === '/api/objetivos' && req.method === 'PATCH') {
      try {
        const cuerpo = JSON.parse((await leerCuerpo(req)) || '{}');
        const obj = await actualizarObjetivo(cuerpo.fila, cuerpo);
        console.log(`  ~ objetivo: ${obj.nombre} → ${obj.progreso}/${obj.meta} (${obj.estado})`);
        return json(res, 200, { ok: true, objetivo: obj });
      } catch (e) {
        return json(res, 400, { error: e.message });
      }
    }

    if (pedido === '/api/objetivos' && req.method === 'DELETE') {
      try {
        const cuerpo = JSON.parse((await leerCuerpo(req)) || '{}');
        const { borrado, quedan } = await borrarObjetivo(cuerpo.fila, cuerpo);
        console.log(`  − objetivo: ${borrado.nombre} (quedan ${quedan})`);
        return json(res, 200, { ok: true, borrado, quedan });
      } catch (e) {
        return json(res, 400, { error: e.message });
      }
    }

    if (pedido === '/api/presupuestos' && req.method === 'GET') {
      try {
        return json(res, 200, await leerPresupuestos());
      } catch (e) {
        return json(res, 500, { error: e.message });
      }
    }

    if (pedido === '/api/presupuestos' && req.method === 'PUT') {
      try {
        const cuerpo = JSON.parse((await leerCuerpo(req)) || '{}');
        const { tocados } = await guardarPresupuestos(cuerpo);
        console.log(`  ~ presupuestos: ${tocados} categoría(s)`);
        return json(res, 200, { ok: true, tocados });
      } catch (e) {
        return json(res, 400, { error: e.message });
      }
    }

    if (pedido === '/api/importar' && req.method === 'POST') {
      try {
        const cuerpo = JSON.parse((await leerCuerpo(req)) || '[]');
        const resultado = await importarMovimientos(cuerpo);
        console.log(`  ↥ importados ${resultado.importados}, repetidos ${resultado.repetidos}`);
        return json(res, 201, { ok: true, ...resultado });
      } catch (e) {
        return json(res, 400, { error: e.message });
      }
    }

    if (pedido === '/api/habitos' && req.method === 'GET') {
      try {
        return json(res, 200, await leerHabitos());
      } catch (e) {
        return json(res, 500, { error: e.message });
      }
    }

    if (pedido === '/api/habitos' && req.method === 'PUT') {
      try {
        const cuerpo = JSON.parse((await leerCuerpo(req)) || '{}');
        const r = await guardarHabitosDelDia(cuerpo.fecha, cuerpo.hechos || []);
        console.log(`  ✓ hábitos ${r.fecha}: ${r.hechos.join(', ') || 'ninguno'}`);
        return json(res, 200, { ok: true, ...r });
      } catch (e) {
        return json(res, 400, { error: e.message });
      }
    }

    if (pedido.startsWith('/api/')) return json(res, 404, { error: 'Endpoint desconocido.' });

    // La raíz es la portada: entres por donde entres, aterrizas en Inicio.
    const relativo = normalize(pedido === '/' ? 'inicio.html' : pedido).replace(/^(\.\.[/\\])+/, '');
    const ruta = resolve(join(RAIZ, relativo));

    // Nada fuera de la carpeta del proyecto.
    if (!ruta.startsWith(RAIZ)) {
      res.writeHead(403).end('Prohibido');
      return;
    }

    const info = await stat(ruta);
    if (info.isDirectory()) {
      res.writeHead(404).end('No encontrado');
      return;
    }

    const cuerpo = await readFile(ruta);
    res.writeHead(200, {
      'Content-Type': TIPOS[extname(ruta).toLowerCase()] || 'application/octet-stream',
      // El service worker ya gestiona su propia caché; el navegador siempre pregunta.
      'Cache-Control': 'no-store',
      ...(relativo === 'sw.js' ? { 'Service-Worker-Allowed': '/' } : {}),
    });
    res.end(cuerpo);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('No encontrado');
  }
});

servidor.listen(PUERTO, '127.0.0.1', () => {
  console.log(`\n  Panel de finanzas → http://localhost:${PUERTO}`);
  console.log('  Ctrl+C para parar.\n');
});
