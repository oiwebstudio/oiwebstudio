// errotatxo.com: sirve la web estática y manda www.errotatxo.com a la
// dirección sin www (una sola versión de cada página para Google).
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === "www.errotatxo.com") {
      url.hostname = "errotatxo.com";
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
