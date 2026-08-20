"use client";

import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import SectionDivider from "@/components/SectionDivider";
import Cronologia from "@/components/sections/Cronologia";
import Historia from "@/components/sections/Historia";
import Valores from "@/components/sections/Valores";
import { useLocale } from "@/lib/i18n";

export default function HistoriaContent() {
  const { t } = useLocale();
  const page = t.pages.historia;

  return (
    <PageTransition>
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        intro={page.intro}
        stats={page.stats}
      />
      <Historia />
      <Cronologia />
      <SectionDivider />
      <Valores />
    </PageTransition>
  );
}
