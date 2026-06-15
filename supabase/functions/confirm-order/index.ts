import { createClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const { orderId, paymentIntentId } = await req.json();

    // Verificar usuario
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // Verificar el PaymentIntent con Stripe antes de marcar como pagado
    const stripeRes = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}`, {
      headers: { Authorization: `Bearer ${Deno.env.get("STRIPE_SECRET_KEY")}` },
    });

    const pi = await stripeRes.json();
    if (pi.error) throw new Error(pi.error.message);

    // Solo marcar como paid si Stripe confirma el pago
    const status = pi.status === "succeeded" ? "paid" : "pending";

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: dbErr } = await admin
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .eq("user_id", user.id);

    if (dbErr) throw dbErr;

    return new Response(
      JSON.stringify({ status }),
      { headers: { ...cors, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
});
