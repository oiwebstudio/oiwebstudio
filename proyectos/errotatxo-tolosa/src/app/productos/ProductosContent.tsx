"use client";

import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import SectionDivider from "@/components/SectionDivider";
import Galeria from "@/components/sections/Galeria";
import Productos from "@/components/sections/Productos";
import { useLocale } from "@/lib/i18n";

export default function ProductosContent() {
  const { t } = useLocale();
  const page = t.pages.productos;

  return (
    <PageTransition>
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        intro={page.intro}
        stats={page.stats}
      />
      <Productos />
      <SectionDivider />
      <Galeria />
    </PageTransition>
  );
}
