import { describe, expect, it } from "vitest";
import { computeTotals } from "./pricing";
import { getProduct } from "./products";

describe("MotiBot pricing", () => {
  it("lists MotiBot Lite at 4.499 TL and MotiBot Pro at 8.999 TL", () => {
    expect(getProduct("motibot-lite")?.price).toBe(4499);
    expect(getProduct("motibot-pro")?.price).toBe(8999);
  });

  it("charges 99 TL shipping below 1.500 TL", () => {
    expect(computeTotals([{ price: 749, quantity: 1, digital: false }]).shipping).toBe(99);
  });

  it("ships free at 1.500 TL and above", () => {
    expect(computeTotals([{ price: 750, quantity: 2, digital: false }]).shipping).toBe(0);
  });

  it("does not charge shipping for digital-only carts", () => {
    expect(computeTotals([{ price: 199, quantity: 1, digital: true }]).shipping).toBe(0);
  });

  it("MOTI10 takes 10% off the subtotal", () => {
    const t = computeTotals([{ price: 4499, quantity: 1, digital: false }], "moti10");
    expect(t.discount).toBe(449.9);
    expect(t.total).toBe(4049.1);
  });

  it("ignores unknown coupon codes", () => {
    expect(computeTotals([{ price: 8999, quantity: 1, digital: false }], "FAKE").discount).toBe(0);
  });
});
