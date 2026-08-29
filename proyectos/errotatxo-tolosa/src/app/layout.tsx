import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import NearestStore from "@/components/NearestStore";
import Noise from "@/components/Noise";
import PageDots from "@/components/PageDots";
import Providers from "@/components/Providers";
import ScrollProgress from "@/components/ScrollProgress";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://errotatxotolosa.com"),
  title: {
    default: "Errotatxo | Panadería artesanal en Tolosa y Anoeta",
    template: "%s | Errotatxo",
  },
  description:
    "Pan artesanal elaborado cada día en nuestros obradores de Tolosa (Andia y San Frantzisko) y Anoeta. Tradición vasca, ingredientes de calidad y producto local desde siempre.",
  keywords: [
    "panadería Tolosa",
    "pan artesanal Gipuzkoa",
    "Errotatxo",
    "okindegia",
    "gozotegia",
    "pastelería Tolosa",
    "pan vasco",
    "panadería Anoeta",
  ],
  openGraph: {
    title: "Errotatxo | Panadería artesanal en Gipuzkoa",
    description:
      "Tradición, calidad y producto local en Tolosa y Anoeta. Pan artesanal elaborado cada día.",
    locale: "es_ES",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="bg-bg font-sans text-ink antialiased">
        <Providers>
          <Loader />
          <Noise />
          <ScrollProgress />
          <PageDots />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <BackToTop />
          <NearestStore />
        </Providers>
      </body>
    </html>
  );
}
