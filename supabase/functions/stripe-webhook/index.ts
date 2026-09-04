import Stripe from "stripe";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { markOrderPaid } from "../_shared/orders.ts";
import { sendOrderEmail } from "../_shared/email.ts";

// Fuente de verdad del cumplimiento de pagos.
// Sin JWT (lo llama Stripe); se valida con la firma stripe-signature.
// Requiere el secret STRIPE_WEBHOOK_SECRET (Dashboard -> Developers -> Webhooks).

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  httpClient: Stripe.createFetchHttpClient(),
});
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  if (!sig || !webhookSecret) return new Response("Firma ausente", { status: 400 });

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
  } catch (err) {
    console.error("firma inválida", (err as Error).message);
    return new Response("Firma inválida", { status: 400 });
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as Stripe.PaymentIntent;
      const admin = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      const paidId = await markOrderPaid(admin, { paymentIntentId: pi.id });
      if (paidId) {
        await sendOrderEmail(admin, paidId).catch((e) => console.error("notify email", e));
      }
    }
  } catch (err) {
    // No propagamos: si respondemos != 2xx Stripe reintenta en bucle.
    console.error("webhook handler", (err as Error).message);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
