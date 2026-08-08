/* Copia la biblioteca a la raíz como biblioteca.html, que es la que se
   sirve en https://oiwebstudio.com/biblioteca.html. Ejecutar después de
   tocar index.html para que la publicada no se quede atrás. */
const fs = require('fs');
const path = require('path');
const origen = path.join(__dirname, 'index.html');
const destino = path.join(__dirname, '..', 'biblioteca.html');
fs.copyFileSync(origen, destino);
const kb = Math.round(fs.statSync(destino).size / 1024);
console.log('biblioteca.html actualizado · ' + kb + ' KB');
