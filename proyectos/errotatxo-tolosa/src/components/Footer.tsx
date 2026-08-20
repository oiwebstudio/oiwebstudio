"use client";

import { Facebook, Instagram, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { businessInfo, socialLinks } from "@/lib/data";
import { useLocale } from "@/lib/i18n";

const socialIcons: Record<string, typeof Instagram> = { Instagram, Facebook };

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="bg-[#2B2019] text-[#F7F1E6]">
      <div className="container-edge grid gap-12 py-20 sm:grid-cols-2 md:grid-cols-4 md:py-24">
        <div>
          <div className="mb-4 w-fit rounded-md bg-[#F7F2EA] p-2">
            <Logo className="h-12" />
          </div>
          <p className="text-sm leading-relaxed text-[#F5EFE4]/50">
            Okindegia &amp; Gozotegia
            <br />
            {t.footer.tagline}
          </p>
        </div>

        <div>
          <p className="mb-5 text-xs uppercase tracking-widest2 text-[#C79764]">
            {t.footer.horario}
          </p>
          <ul className="space-y-2 text-sm text-[#F5EFE4]/60">
            {t.ubicacion.hours.map((h) => (
              <li key={h.day}>
                {h.day}: {h.time}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-5 text-xs uppercase tracking-widest2 text-[#C79764]">
            {t.footer.navegacion}
          </p>
          <ul className="space-y-2 text-sm">
            {t.nav.sections.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  data-cursor="hover"
                  className="text-[#F5EFE4]/60 transition-colors hover:text-[#F5EFE4]"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-5 text-xs uppercase tracking-widest2 text-[#C79764]">
            {t.footer.contacto}
          </p>
          <ul className="space-y-3 text-sm text-[#F5EFE4]/60">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              {businessInfo.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0" />
              {businessInfo.phone}
            </li>
          </ul>
          <div className="mt-6 flex gap-4">
            {socialLinks.map((s) => {
              const Icon = socialIcons[s.label];
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  data-cursor="hover"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F5EFE4]/20 transition-colors duration-300 hover:bg-[#F5EFE4] hover:text-[#2B2019]"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-[#F5EFE4]/10 px-6 py-6 md:px-12">
        <p className="text-center text-xs text-[#F5EFE4]/35">
          © {new Date().getFullYear()} Errotatxo Tolosa. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
