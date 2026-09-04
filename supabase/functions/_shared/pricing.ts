// Recalculo de totales del lado del servidor.
// El precio que manda el navegador NO se usa nunca para cobrar.

import catalog from "./catalog.json" with { type: "json" };

export const CUSTOM_PRICE = 580; // diseño personalizado desde cero
const MAX_QTY = 20;
const MAX_ITEMS = 50;
const MAX_TOTAL = 500_000; // tope de cordura en MXN

type CartItem = { id?: unknown; qty?: unknown; custom?: unknown };
type Override = { p?: unknown; disc?: unknown; deleted?: unknown };

const CATALOG = catalog as Record<string, { p: number; cat: string }>;

function toInt(v: unknown): number {
  return parseInt(String(v ?? "").replace(/\D/g, ""), 10);
}

/**
 * Suma el total real a partir de los ítems del carrito, los overrides del panel
 * CEO y el descuento global. Lanza si algún ítem es inválido o desconocido.
 */
export function computeTotal(
  items: unknown,
  overrides: Record<string, Override> = {},
  globalDiscountPct = 0,
): number {
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS) {
    throw new Error("Carrito inválido");
  }

  let total = 0;
  for (const raw of items as CartItem[]) {
    const qty = Number(raw?.qty ?? 1);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
      throw new Error(`Cantidad inválida para "${String(raw?.id ?? "producto")}"`);
    }

    let base: number;
    let disc = 0;

    if (raw?.custom) {
      base = CUSTOM_PRICE; // sin descuento sobre personalizados
    } else {
      const id = String(raw?.id ?? "");
      const ov = overrides[id];
      if (ov?.deleted) throw new Error(`Producto no disponible: ${id}`);

      const ovPrice = ov?.p != null ? toInt(ov.p) : NaN;
      const catPrice = CATALOG[id]?.p;
      base = Number.isFinite(ovPrice) ? ovPrice : catPrice;
      if (!Number.isFinite(base)) throw new Error(`Precio no encontrado: ${id}`);

      const ovDisc = Number(ov?.disc ?? 0);
      disc = ovDisc > 0 ? ovDisc : (globalDiscountPct || 0);
    }

    if (!Number.isFinite(disc) || disc < 0 || disc > 90) disc = 0;
    total += Math.round(base * (1 - disc / 100)) * qty;
  }

  if (!Number.isFinite(total) || total <= 0 || total > MAX_TOTAL) {
    throw new Error("Total fuera de rango");
  }
  return total;
}
