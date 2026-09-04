import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { markOrderPaid } from "../_shared/orders.ts";
import { sendOrderEmail } from "../_shared/email.ts";

// Confirmación best-effort desde el navegador. La fuente de verdad del
// cumplimiento es stripe-webhook; esto solo acelera la actualización de la UI.

Deno.serve(async (req) => {
  const cors = corsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...cors, "Content-Type": "application/json" },
    });

  try {
    const { orderId, paymentIntentId } = await req.json();
    if (!orderId && !paymentIntentId) {
      return json({ error: "Falta orderId o paymentIntentId" }, 400);
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) return json({ error: "No autorizado" }, 401);

    // Verificar el PaymentIntent con Stripe antes de tocar la orden
    const piId = paymentIntentId ??
      (orderId ? await orderPaymentIntent(orderId, user.id) : null);
    if (!piId) return json({ error: "Orden no encontrada" }, 404);

    const stripeRes = await fetch(
      `https://api.stripe.com/v1/payment_intents/${piId}`,
      { headers: { Authorization: `Bearer ${Deno.env.get("STRIPE_SECRET_KEY")}` } },
    );
    const pi = await stripeRes.json();
    if (pi.error) throw new Error(pi.error.message);

    if (pi.status !== "succeeded") return json({ status: "pending" });

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const paidId = await markOrderPaid(admin, {
      orderId: orderId ?? null,
      paymentIntentId: piId,
      userId: user.id,
    });
    if (paidId) await sendOrderEmail(admin, paidId).catch((e) => console.error("notify email", e));

    return json({ status: "paid" });
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
});

async function orderPaymentIntent(orderId: string, userId: string): Promise<string | null> {
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { data } = await admin
    .from("orders")
    .select("stripe_payment_intent_id")
    .eq("id", orderId)
    .eq("user_id", userId)
    .maybeSingle();
  return data?.stripe_payment_intent_id ?? null;
}
