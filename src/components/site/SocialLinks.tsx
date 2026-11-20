import { Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

export const INSTAGRAM_URL = "https://www.instagram.com/motibot.tr";
export const TIKTOK_URL = "https://www.tiktok.com/@motibot.tr";

export function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
    </svg>
  );
}

export function SocialLinks({ className, size = "md" }: { className?: string; size?: "md" | "lg" }) {
  const box = size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const icon = size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="MotiBot Instagram"
        className={cn(
          box,
          "inline-flex items-center justify-center rounded-full bg-mustard text-mustard-foreground transition hover:-translate-y-0.5",
        )}
      >
        <Instagram className={icon} />
      </a>
      <a
        href={TIKTOK_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="MotiBot TikTok"
        className={cn(
          box,
          "inline-flex items-center justify-center rounded-full bg-mustard text-mustard-foreground transition hover:-translate-y-0.5",
        )}
      >
        <TikTokIcon className={icon} />
      </a>
    </div>
  );
}
