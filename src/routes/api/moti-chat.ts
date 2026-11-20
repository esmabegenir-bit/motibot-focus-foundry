import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { buildInstructions } from "@/lib/moti-assistant";

const body = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(2000) }))
    .min(1)
    .max(30),
});

export const Route = createFileRoute("/api/moti-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = body.safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
          return Response.json({ error: "Geçersiz istek" }, { status: 400 });
        }

        const { streamResponse, GatewayError } = await import("@lovable.dev/ai-gateway");

        try {
          const stream = await streamResponse(
            {
              model: "openai/gpt-6.1-sol",
              instructions: buildInstructions(),
              input: parsed.data.messages.map((m) => ({ role: m.role, content: m.content })),
              max_output_tokens: 600,
            },
            { signal: request.signal },
          );

          const encoder = new TextEncoder();
          const readable = new ReadableStream<Uint8Array>({
            async start(controller) {
              try {
                for await (const event of stream) {
                  if (event.type === "response.output_text.delta") {
                    controller.enqueue(encoder.encode(event.delta));
                  }
                }
              } catch (err) {
                console.error("moti-chat stream error", err);
                controller.enqueue(encoder.encode("\n\n_Bağlantı koptu, lütfen tekrar dener misin?_"));
              } finally {
                controller.close();
              }
            },
          });

          return new Response(readable, {
            headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
          });
        } catch (err) {
          if (err instanceof GatewayError) {
            console.error("moti-chat gateway error", err.code, err.httpStatus, err.ids);
            const status = err.httpStatus === 429 ? 429 : err.httpStatus === 402 ? 402 : 502;
            const message =
              status === 429
                ? "Şu an çok yoğunum, birkaç saniye sonra tekrar dener misin?"
                : "Moti Asistan şu an yanıt veremiyor. Biraz sonra tekrar deneyin.";
            return Response.json({ error: message }, { status });
          }
          console.error("moti-chat error", err);
          return Response.json({ error: "Beklenmeyen bir hata oluştu." }, { status: 500 });
        }
      },
    },
  },
});
