"use client";

import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import Contacto from "@/components/sections/Contacto";
import { useLocale } from "@/lib/i18n";

export default function ContactoContent() {
  const { t } = useLocale();
  const page = t.pages.contacto;

  return (
    <PageTransition>
      <PageHeader eyebrow={page.eyebrow} title={page.title} intro={page.intro} />
      <Contacto />
    </PageTransition>
  );
}
