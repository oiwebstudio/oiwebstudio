"use client";

import type { ReactNode } from "react";
import LenisProvider from "@/components/motion/LenisProvider";
import { LocaleProvider } from "@/lib/i18n";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <LenisProvider>{children}</LenisProvider>
    </LocaleProvider>
  );
}
