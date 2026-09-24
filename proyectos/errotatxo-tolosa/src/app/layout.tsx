import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import BackToTop from "@/components/BackToTop";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import NearestStore from "@/components/NearestStore";
import Noise from "@/components/Noise";
import PageDots from "@/components/PageDots";
import Providers from "@/components/Providers";
import ScrollProgress from "@/components/ScrollProgress";
import { OG_IMAGE, SITE_URL } from "@/lib/site";
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

// Valores por defecto; cada página define su título, descripción y canonical
// con pageMetadata() (lib/site.ts).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL + "/"),
  title: {
    default: "Panadería y cafetería en Tolosa y Anoeta | Errotatxo Okindegia",
    template: "%s | Errotatxo",
  },
  description:
    "Errotatxo: panadería y pastelería en Tolosa y Anoeta, con cafetería en San Frantzisko.",
  applicationName: "Errotatxo",
  openGraph: {
    siteName: "Errotatxo Okindegia",
    locale: "es_ES",
    type: "website",
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FDFBF7",
  viewportFit: "cover",
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
          <CustomCursor />
        </Providers>
      </body>
    </html>
  );
}
