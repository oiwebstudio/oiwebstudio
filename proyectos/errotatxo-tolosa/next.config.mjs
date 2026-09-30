/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // Se publica en la raíz de errotatxo.com (Cloudflare Pages). Hasta el
  // 30/09/2026 vivía en oiwebstudio.com/demos/errotatxo/ con basePath.
  trailingSlash: true,
  images: {
    // Las fotos ya van en WebP y como mucho a 1600 px (public/images), así
    // que se sirven tal cual, sin redimensionar.
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
  },
};

export default nextConfig;
