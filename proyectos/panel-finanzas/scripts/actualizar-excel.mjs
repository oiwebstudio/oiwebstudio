// Añade a un Excel ya existente las hojas de la parte personal.
// No toca ninguna hoja que ya esté: tus movimientos se quedan como están.
//   npm run actualizar

import ExcelJS from 'exceljs';
import { copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ampliarLibro } from './hojas-vida.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LIBRO = resolve(RAIZ, 'datos', 'Finanzas.xlsx');
const RESPALDO = resolve(RAIZ, 'datos', 'Finanzas.antes-de-actualizar.xlsx');

if (!existsSync(LIBRO)) {
  console.error('\n  No existe datos/Finanzas.xlsx. Genéralo con: npm run excel\n');
  process.exit(1);
}

const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(LIBRO);

const nuevas = ampliarLibro(wb);

if (!nuevas.length) {
  console.log('\n  El libro ya está al día. No he tocado nada.\n');
  process.exit(0);
}

await copyFile(LIBRO, RESPALDO);
try {
  await wb.xlsx.writeFile(LIBRO);
} catch (e) {
  if (e.code === 'EBUSY' || e.code === 'EPERM') {
    console.error('\n  Tienes Finanzas.xlsx abierto en Excel. Ciérralo y vuelve a ejecutarlo.\n');
    process.exit(1);
  }
  throw e;
}

console.log('\n  Cambios aplicados:');
nuevas.forEach((c) => console.log(`   · ${c}`));
console.log(`  Copia previa en: ${RESPALDO}\n`);
