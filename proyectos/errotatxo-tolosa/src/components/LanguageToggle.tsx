"use client";

import { useLocale } from "@/lib/i18n";

export default function LanguageToggle({ light = true }: { light?: boolean }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className={`flex items-center gap-1 text-xs uppercase tracking-widest2 ${
        light ? "text-ink" : "text-current"
      }`}
    >
      <button
        type="button"
        data-cursor="hover"
        onClick={() => setLocale("es")}
        aria-current={locale === "es"}
        className={`transition-opacity duration-300 ${locale === "es" ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
      >
        ES
      </button>
      <span className="opacity-30">/</span>
      <button
        type="button"
        data-cursor="hover"
        onClick={() => setLocale("eu")}
        aria-current={locale === "eu"}
        className={`transition-opacity duration-300 ${locale === "eu" ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
      >
        EU
      </button>
    </div>
  );
}
