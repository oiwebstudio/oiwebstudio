import type { Metadata } from "next";
import Link from "next/link";
import { businessInfo } from "@/lib/data";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Aviso legal, privacidad y cookies",
    description: "Titular de errotatxo.com, condiciones de uso, privacidad y cookies.",
    path: "/legal/",
  }),
  // Página obligatoria (LSSI), pero no aporta nada en Google.
  robots: { index: false, follow: true },
};

const H2 = "mt-12 font-serif text-2xl text-ink md:text-3xl";

export default function Page() {
  return (
    <main className="bg-bg pb-24 pt-32 md:pt-40">
      <article className="container-edge max-w-2xl space-y-4 text-[0.95rem] leading-relaxed text-ink/75">
        <p className="eyebrow">Lege-oharra · Aviso legal</p>
        <h1 className="font-serif text-4xl text-ink md:text-5xl">Aviso legal, privacidad y cookies</h1>

        <h2 className={H2}>Titular de la web</h2>
        <p>
          En cumplimiento del artículo 10 de la Ley 34/2002 (LSSI), estos son los datos del titular
          de errotatxo.com:
        </p>
        <ul className="space-y-1">
          <li><strong className="text-ink">Razón social:</strong> {businessInfo.legalName}</li>
          <li><strong className="text-ink">CIF:</strong> {businessInfo.cif}</li>
          <li><strong className="text-ink">Domicilio:</strong> {businessInfo.address}</li>
          <li>
            <strong className="text-ink">Email:</strong>{" "}
            <a href={`mailto:${businessInfo.email}`} className="underline underline-offset-4 hover:text-ink">
              {businessInfo.email}
            </a>
          </li>
          <li>
            <strong className="text-ink">Teléfono:</strong>{" "}
            <a href={`tel:+34${businessInfo.phone.replace(/\s/g, "")}`} className="underline underline-offset-4 hover:text-ink">
              {businessInfo.phone}
            </a>
          </li>
        </ul>

        <h2 className={H2}>Uso de la web</h2>
        <p>
          Esta web informa sobre las tiendas, horarios y productos de Errotatxo. Los horarios y
          productos pueden cambiar; ante la duda, llama a la tienda. Los textos, fotos y el logotipo
          son de {businessInfo.legalName} y no se pueden reutilizar sin permiso.
        </p>

        <h2 className={H2}>Privacidad</h2>
        <p>
          La web no tiene formularios ni registro: no recogemos datos personales a través de ella. Si
          nos escribes por email, llamas o nos mandas un mensaje por Facebook, usaremos tus datos solo
          para contestarte y no los cederemos a nadie. Responsable: {businessInfo.legalName}.
        </p>
        <p>
          Puedes pedir el acceso, la rectificación o la supresión de tus datos escribiendo a{" "}
          {businessInfo.email}, y reclamar ante la Agencia Española de Protección de Datos
          (aepd.es) si no quedas conforme.
        </p>

        <h2 className={H2}>Cookies</h2>
        <p>
          No usamos cookies de análisis ni de publicidad, por eso no verás ningún aviso de cookies.
          El navegador solo guarda el idioma que eliges (castellano o euskera), que es necesario para
          que la web funcione como pides. El mapa de las tiendas carga sus imágenes desde CARTO y
          OpenStreetMap, que pueden ver tu dirección IP como cualquier web que visitas.
        </p>

        <p className="pt-10">
          <Link href="/" className="underline underline-offset-4 hover:text-ink">
            ← Volver al inicio
          </Link>
        </p>
      </article>
    </main>
  );
}
