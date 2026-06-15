import { createClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const { items, total, shipping } = await req.json();

    // Obtener usuario autenticado desde el JWT
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

    // Crear PaymentIntent en Stripe (server-side, clave secreta)
    const stripeRes = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("STRIPE_SECRET_KEY")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        amount: String(Math.round(total * 100)), // Stripe usa centavos
        currency: "mxn",
        "automatic_payment_methods[enabled]": "true",
        "metadata[user_id]": user.id,
        "metadata[customer_name]": shipping.name ?? "",
      }),
    });

    const pi = await stripeRes.json();
    if (pi.error) throw new Error(pi.error.message);

    // Guardar orden en Supabase con service role (bypass RLS)
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: order, error: dbErr } = await admin
      .from("orders")
      .insert({
        user_id: user.id,
        items,
        total,
        status: "pending",
        shipping_name: shipping.name,
        shipping_phone: shipping.phone,
        shipping_address: shipping.address,
        stripe_payment_intent_id: pi.id,
      })
      .select("id")
      .single();

    if (dbErr) throw dbErr;

    return new Response(
      JSON.stringify({ clientSecret: pi.client_secret, orderId: order.id }),
      { headers: { ...cors, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
});
