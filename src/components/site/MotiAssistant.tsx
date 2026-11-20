import { lazy, Suspense, useState } from "react";
import { X } from "lucide-react";
import avatar from "@/assets/moti-avatar.png";
import { cn } from "@/lib/utils";

const MotiAssistantPanel = lazy(() => import("./MotiAssistantPanel"));

export function MotiAssistant() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  return (
    <>
      {mounted && (
        <div
          className={cn(
            "fixed inset-x-3 bottom-24 z-50 flex h-[min(620px,calc(100dvh-8rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-lift transition sm:inset-x-auto sm:right-6 sm:w-[400px]",
            open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
          )}
          role="dialog"
          aria-label="Moti Asistan"
          aria-hidden={!open}
        >
          <Suspense fallback={<div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">Moti uyanıyor…</div>}>
            <MotiAssistantPanel open={open} onClose={() => setOpen(false)} />
          </Suspense>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setMounted(true);
          setOpen((o) => !o);
        }}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-navy py-2 pl-2 pr-4 text-navy-foreground shadow-lift transition hover:-translate-y-0.5 sm:right-6"
        aria-label={open ? "Moti Asistan'ı kapat" : "Moti Asistan'ı aç"}
      >
        {open ? (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mustard text-mustard-foreground">
            <X className="h-5 w-5" />
          </span>
        ) : (
          <img src={avatar} alt="" className="h-10 w-10 rounded-full ring-2 ring-mustard" width={40} height={40} />
        )}
        <span className="text-sm font-bold">{open ? "Kapat" : "Moti Asistan"}</span>
      </button>
    </>
  );
}
