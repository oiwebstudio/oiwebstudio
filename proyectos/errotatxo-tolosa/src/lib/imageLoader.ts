export default function imageLoader({ src }: { src: string }) {
  if (/^https?:\/\//.test(src)) return src;
  return `/demos/errotatxo${src}`;
}
