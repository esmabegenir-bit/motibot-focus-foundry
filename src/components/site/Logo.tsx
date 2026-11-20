import { Link } from "@tanstack/react-router";
import avatar from "@/assets/moti-avatar.png";
import { cn } from "@/lib/utils";

export function Logo({ className, tone = "navy" }: { className?: string; tone?: "navy" | "cream" }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)} aria-label="MotiBot ana sayfa">
      <img src={avatar} alt="" className="h-9 w-9 rounded-full" width={36} height={36} />
      <span
        className={cn(
          "font-display text-xl font-extrabold tracking-tight",
          tone === "navy" ? "text-navy" : "text-navy-foreground",
        )}
      >
        Moti<span className="text-mustard">Bot</span>
      </span>
    </Link>
  );
}
