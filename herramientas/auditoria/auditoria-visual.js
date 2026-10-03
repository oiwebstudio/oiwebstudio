/**
 * Auditoría visual de una demo, para pegar en la consola del navegador.
 *
 * herramientas/auditoria/auditoria.mjs mira el HTML en frío: enlaces, títulos, JSON-LD. Esto
 * mira lo que de verdad se pinta, que es donde salieron los fallos que más
 * caros habrían sido: texto oscuro sobre fondo oscuro dentro de .oscura,
 * enlaces de 35 px y desbordamiento horizontal en móvil. Ninguno se ve leyendo
 * el fichero, porque dependen de qué token gana en cascada.
 *
 * Uso: abrir la demo, consola, pegar y ejecutar. Devuelve JSON con el orden de
 * secciones, cuáles quedaron oscuras, si hay dos oscuras seguidas, fallos de
 * contraste AA, zonas táctiles por debajo de 44 px y scroll horizontal.
 *
 * Las secciones con una capa de foto absoluta salen en "sinMedir": su color de
 * fondo real lo pone un degradado en un ::after, que no se puede leer
 * recorriendo el DOM. Esas se revisan a mano, una vez.
 */
(function(){
function lum(c){
  /* getComputedStyle devuelve dos formatos distintos: "rgb(21, 23, 15)" con
     valores de 0 a 255, y —desde que la cabecera y la barra usan color-mix—
     "color(srgb 0.956863 0.956863 0.945098 / 0.92)" con valores de 0 a 1.
     Leer el segundo como si fuera el primero daba casi negro, y con eso el
     medidor inventaba fallos de contraste donde no los había. */
  var n=(c.match(/[\d.]+/g)||[0,0,0]).map(Number);
  var esCero1=/^color\(/.test(c);
  var f=n.slice(0,3).map(function(v){
    v=esCero1?v:v/255;
    return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);
  });
  return .2126*f[0]+.7152*f[1]+.0722*f[2];
}
function fondo(e){var n=e;while(n&&n!==document.documentElement){var b=getComputedStyle(n).backgroundColor;if(b&&!/rgba\(0, 0, 0, 0\)|transparent/.test(b))return b;n=n.parentElement;}return "rgb(255,255,255)";}
function ratio(a,b){var l1=lum(a),l2=lum(b);return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);}
/* Una sección con una capa de foto absoluta debajo del texto no se puede medir
   recorriendo el DOM: el color real lo pone un degradado en un ::after, que
   getComputedStyle del padre no devuelve. Se marcan aparte y se revisan a mano
   una vez, en vez de contarlas como fallo en cada pasada. */
function conFoto(sec){
  var capa=sec.querySelector('[class*="__foto"],[class*="__media"],[class*="__img"]');
  return !!(capa && getComputedStyle(capa).position==="absolute");
}
var malos=[],sinMedir=[];
document.querySelectorAll("main *,body>section *").forEach(function(e){
  var t=[].slice.call(e.childNodes).some(function(n){return n.nodeType===3&&n.textContent.trim()});
  if(!t)return; var cs=getComputedStyle(e);
  if(cs.visibility==="hidden"||cs.display==="none")return;
  var sec=e.closest("section");
  if(sec&&conFoto(sec)){ if(sinMedir.indexOf(sec.className.split(" ")[0])<0)sinMedir.push(sec.className.split(" ")[0]); return; }
  var px=parseFloat(cs.fontSize),g=px>=24||(px>=18.66&&+cs.fontWeight>=700);
  var r=ratio(cs.color,fondo(e)); if(r<(g?3:4.5))malos.push(e.tagName+"."+String(e.className).slice(0,24)+" "+r.toFixed(2));
});
var chicos=[];
document.querySelectorAll("a,button,input,select").forEach(function(e){
  var r=e.getBoundingClientRect(); if(!r.width)return;
  if(r.height<44)chicos.push((e.textContent||e.type).trim().slice(0,16)+" "+Math.round(r.height));
});
var osc=[].slice.call(document.querySelectorAll("main>section.oscura,body>section.oscura")).map(function(s){return s.className.split(" ")[0]});
var todas=[].slice.call(document.querySelectorAll("main>section,body>section")).map(function(s){return s.className.split(" ")[0]});
var seg=[]; for(var i=1;i<todas.length;i++){ if(osc.indexOf(todas[i])>=0&&osc.indexOf(todas[i-1])>=0) seg.push(todas[i-1]+"+"+todas[i]); }
return JSON.stringify({orden:todas.join(" "),oscuras:osc.join("+"),seguidas:seg,h1:document.querySelectorAll("h1").length,
  scroll:document.documentElement.scrollWidth+"/"+document.documentElement.clientWidth,
  contraste:malos.length,malos:malos.slice(0,5),sinMedir:sinMedir,tactil:chicos.length,chicos:chicos.slice(0,3)});
})()
