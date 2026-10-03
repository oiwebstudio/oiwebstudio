import Image from "next/image";
import { cn } from "@/lib/utils";

export default function RevealImage({
  src,
  alt,
  className,
  imgClassName,
  priority,
  sizes = "100vw",
  panelClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  delay?: number;
  panelClassName?: string;
}) {
  void panelClassName;
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover", imgClassName)}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon/20 via-transparent to-madera/[0.06] mix-blend-multiply" />
    </div>
  );
}
