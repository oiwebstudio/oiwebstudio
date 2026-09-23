/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/demos/errotatxo",
  assetPrefix: "/demos/errotatxo/",
  trailingSlash: true,
  images: {
    // Las fotos ya van en WebP y como mucho a 1600 px (public/images), así
    // que se sirven tal cual. Loader propio: antepone el basePath, que
    // next/image no añade solo en export estático.
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
  },
};

export default nextConfig;
