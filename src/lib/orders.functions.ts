import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getProduct } from "@/lib/products";
import { computeTotals } from "@/lib/pricing";
import { configName, configPrice, configSummary, motiConfigSchema } from "@/lib/customizer";

const CUSTOM_ID = "kendi-motibot";

export const DECLINED_TEST_CARD = "4000000000000002";

const orderInput = z.object({
  items: z
    .array(z.object({ productId: z.string().min(1).max(80), quantity: z.number().int().min(1).max(10), config: motiConfigSchema.optional() }))
    .min(1)
    .max(30),
  coupon: z.string().max(30).optional(),
  shipping: z.object({
    name: z.string().trim().min(3).max(120),
    phone: z.string().trim().min(10).max(20),
    address: z.string().trim().min(10).max(400),
    city: z.string().trim().min(2).max(60),
  }),
  card: z.object({
    holder: z.string().trim().min(3).max(120),
    number: z.string().regex(/^\d{16}$/),
    expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/),
    cvc: z.string().regex(/^\d{3}$/),
  }),
});

export const placeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: z.infer<typeof orderInput>) => orderInput.parse(input))
  .handler(async ({ data, context }) => {
    // Simulated payment: no real money moves. One test card always declines.
    if (data.card.number === DECLINED_TEST_CARD) {
      return { ok: false as const, error: "Kartınız bankanız tarafından reddedildi. Başka bir kart deneyin." };
    }

    const lines = data.items.flatMap((i) => {
      if (i.productId === CUSTOM_ID) {
        if (!i.config) return [];
        const summary = configSummary(i.config);
        return [{ productId: CUSTOM_ID, name: summary ? `${configName(i.config)} (${summary})` : configName(i.config), price: configPrice(i.config), quantity: i.quantity, digital: false, config: i.config }];
      }
      const p = getProduct(i.productId);
      return p
        ? [{ productId: p.id, name: p.name, price: p.price, quantity: i.quantity, digital: p.digital }]
        : [];
    });
    if (lines.length === 0) return { ok: false as const, error: "Sepetinizdeki ürünler bulunamadı." };

    const totals = computeTotals(lines, data.coupon);

    const { data: order, error } = await context.supabase
      .from("orders")
      .insert({
        user_id: context.userId,
        items: lines,
        subtotal: totals.subtotal,
        discount: totals.discount,
        shipping: totals.shipping,
        total: totals.total,
        coupon_code: totals.couponApplied,
        status: "paid",
        shipping_name: data.shipping.name,
        phone: data.shipping.phone,
        address: data.shipping.address,
        city: data.shipping.city,
        card_last4: data.card.number.slice(-4),
      })
      .select("id")
      .single();

    if (error || !order) {
      console.error("placeOrder insert failed", error);
      return { ok: false as const, error: "Sipariş kaydedilemedi, lütfen tekrar deneyin." };
    }
    return { ok: true as const, orderId: order.id };
  });
