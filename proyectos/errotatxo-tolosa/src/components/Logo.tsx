import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/images/logo-errotatxo.png"
      alt="Errotatxo"
      width={304}
      height={165}
      priority
      className={cn("h-10 w-auto object-contain", className)}
    />
  );
}
