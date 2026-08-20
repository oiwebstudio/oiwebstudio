"use client";

import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import Horarios from "@/components/sections/Horarios";
import Mapa from "@/components/sections/Mapa";
import Tiendas from "@/components/sections/Tiendas";
import { useLocale } from "@/lib/i18n";

export default function TiendasContent() {
  const { t } = useLocale();
  const page = t.pages.tiendas;

  return (
    <PageTransition>
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        intro={page.intro}
        stats={page.stats}
      />
      <Tiendas />
      <Mapa />
      <Horarios />
    </PageTransition>
  );
}
