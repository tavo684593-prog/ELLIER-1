import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { computeTotal } from "../_shared/pricing.ts";

Deno.serve(async (req) => {
  const cors = corsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...cors, "Content-Type": "application/json" },
    });

  try {
    const { items, shipping } = await req.json();

    // Usuario autenticado desde el JWT
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) return json({ error: "No autorizado" }, 401);

    // Datos de envío
    const name = String(shipping?.name ?? "").trim().slice(0, 120);
    const phone = String(shipping?.phone ?? "").trim().slice(0, 40);
    const address = String(shipping?.address ?? "").trim().slice(0, 300);
    if (!name || !phone || !address) {
      return json({ error: "Datos de envío incompletos" }, 400);
    }
    if (!Array.isArray(items) || items.length === 0) {
      return json({ error: "Carrito vacío" }, 400);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Precios de referencia: overrides del panel CEO + descuento global
    const [{ data: ovRows }, { data: settings }] = await Promise.all([
      admin.from("product_overrides").select("id,p,disc,deleted"),
      admin.from("site_settings").select("global_discount").eq("id", 1).maybeSingle(),
    ]);
    const overrides: Record<string, unknown> = {};
    for (const r of ovRows ?? []) overrides[(r as { id: string }).id] = r;
    const gd = settings?.global_discount as { on?: boolean; pct?: number } | null;
    const globalDisc = gd?.on ? Number(gd.pct) || 0 : 0;

    // Total recalculado en el servidor — se ignora cualquier "total" del cliente
    let total: number;
    try {
      total = computeTotal(items, overrides, globalDisc);
    } catch (e) {
      return json({ error: (e as Error).message }, 400);
    }

    // PaymentIntent en Stripe (clave secreta, server-side)
    const stripeRes = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("STRIPE_SECRET_KEY")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        amount: String(Math.round(total * 100)), // centavos
        currency: "mxn",
        "automatic_payment_methods[enabled]": "true",
        "metadata[user_id]": user.id,
        "metadata[customer_name]": name,
      }),
    });
    const pi = await stripeRes.json();
    if (pi.error) throw new Error(pi.error.message);

    // Guardar orden (service role, bypass RLS)
    const { data: order, error: dbErr } = await admin
      .from("orders")
      .insert({
        user_id: user.id,
        items,
        total,
        status: "pending",
        shipping_name: name,
        shipping_phone: phone,
        shipping_address: address,
        stripe_payment_intent_id: pi.id,
      })
      .select("id")
      .single();
    if (dbErr) throw dbErr;

    return json({
      clientSecret: pi.client_secret,
      orderId: order.id,
      paymentIntentId: pi.id,
    });
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
});
