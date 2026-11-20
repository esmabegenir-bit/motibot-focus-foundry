import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import avatar from "@/assets/moti-avatar.png";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { extractProductTags, type ChatTurn } from "@/lib/moti-assistant";
import { formatPrice, getProduct } from "@/lib/products";

type Status = "ready" | "submitted" | "streaming" | "error";

const SUGGESTIONS = [
  "Ders çalışırken odaklanamıyorum",
  "Uzaktan çalışıyorum, bütçem 10.000 TL",
  "İş arkadaşıma hediye arıyorum",
];

function RecommendedProduct({ slug }: { slug: string }) {
  const product = getProduct(slug);
  const { add } = useCart();
  if (!product) return null;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-background p-2">
      <img src={product.image} alt={product.name} className="h-14 w-14 rounded-xl object-cover" />
      <div className="min-w-0 flex-1">
        <Link to="/urun/$slug" params={{ slug: product.slug }} className="block truncate text-sm font-bold text-navy hover:underline">
          {product.name}
        </Link>
        <p className="text-sm font-semibold text-muted-foreground">{formatPrice(product.price)}</p>
      </div>
      <Button
        size="icon-sm"
        variant="mustard"
        aria-label={`${product.name} sepete ekle`}
        onClick={() => {
          add(product.id);
          toast.success(`${product.name} sepete eklendi`);
        }}
      >
        <Plus />
      </Button>
    </div>
  );
}

export default function MotiAssistantPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [status, setStatus] = useState<Status>("ready");
  const abortRef = useRef<AbortController | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const focusInput = () => {
    requestAnimationFrame(() => wrapperRef.current?.querySelector("textarea")?.focus());
  };

  useEffect(() => {
    if (open) focusInput();
  }, [open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || status === "submitted" || status === "streaming") return;
    const history: ChatTurn[] = [...messages, { role: "user", content: trimmed }];
    setMessages(history);
    setStatus("submitted");
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/moti-chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-20) }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Moti Asistan şu an yanıt veremiyor.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      setStatus("streaming");
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const snapshot = acc;
        setMessages((m) => {
          const copy = m.slice();
          copy[copy.length - 1] = { role: "assistant", content: snapshot };
          return copy;
        });
      }
      setStatus("ready");
    } catch (err) {
      if (controller.signal.aborted) {
        setStatus("ready");
      } else {
        setStatus("error");
        toast.error(err instanceof Error ? err.message : "Bir hata oluştu.");
        setTimeout(() => setStatus("ready"), 1500);
      }
    } finally {
      abortRef.current = null;
      focusInput();
    }
  }

  const handleSubmit = (msg: PromptInputMessage) => {
    void send(msg.text);
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setStatus("ready");
    focusInput();
  };

  return (
    <div ref={wrapperRef} className="flex h-full flex-col">
      <div className="flex items-center gap-3 bg-navy px-4 py-3 text-navy-foreground">
        <img src={avatar} alt="" className="h-10 w-10 rounded-full ring-2 ring-mustard" />
        <div className="flex-1">
          <p className="font-display text-base font-bold leading-tight">Moti Asistan</p>
          <p className="text-xs text-navy-foreground/70">Sana uygun MotiBot'u birlikte bulalım</p>
        </div>
        <Button variant="ghost" size="icon-sm" className="text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground" onClick={reset} aria-label="Sohbeti sıfırla">
          <RotateCcw />
        </Button>
        <Button variant="ghost" size="icon-sm" className="text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground" onClick={onClose} aria-label="Kapat">
          <X />
        </Button>
      </div>

      <Conversation className="bg-card">
        <ConversationContent className="gap-5">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <img src={avatar} alt="" className="h-20 w-20 animate-float-soft rounded-full" />
              <div>
                <p className="font-display text-lg font-bold text-navy">Merhaba, ben Moti!</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Neye ihtiyacın olduğunu anlat, sana en uygun robotu ya da hediyeyi önereyim.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-navy transition hover:border-mustard hover:bg-mustard-soft"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => {
              if (m.role === "user") {
                return (
                  <Message key={i} from="user">
                    <MessageContent className="group-[.is-user]:rounded-2xl group-[.is-user]:bg-navy group-[.is-user]:text-navy-foreground">
                      {m.content}
                    </MessageContent>
                  </Message>
                );
              }
              const { clean, slugs } = extractProductTags(m.content);
              const isLast = i === messages.length - 1;
              return (
                <Message key={i} from="assistant">
                  <MessageContent className="w-full">
                    <MessageResponse isAnimating={isLast && status === "streaming"}>{clean}</MessageResponse>
                    {slugs.length > 0 && (!isLast || status !== "streaming") && (
                      <div className="mt-1 flex flex-col gap-2">
                        {slugs.map((s) => (
                          <RecommendedProduct key={s} slug={s} />
                        ))}
                      </div>
                    )}
                  </MessageContent>
                </Message>
              );
            })
          )}
          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer>Moti düşünüyor…</Shimmer>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border bg-card p-3">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea placeholder="Örn: Ders çalışırken çabuk sıkılıyorum…" className="min-h-12 text-sm" />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit
              status={status}
              onStop={() => abortRef.current?.abort()}
              className="bg-navy text-navy-foreground hover:bg-navy/90"
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
