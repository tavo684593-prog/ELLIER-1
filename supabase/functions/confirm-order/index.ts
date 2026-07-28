import { createClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function money(n: number) {
  return "$" + Number(n || 0).toLocaleString("es-MX") + " MXN";
}

function esc(v: unknown) {
  return String(v ?? "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[m] || m));
}

async function sendOrderEmail(admin: any, orderId: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return;

  const { data: order, error } = await admin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();
  if (error || !order) {
    console.error("notify order lookup", error);
    return;
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const tracking = "#" + String(order.id).slice(-6).toUpperCase();
  const rows = items.map((item: any, i: number) => {
    const desc = item.requestDesc || (item.custom ? "Producto personalizado" : "Sin descripcion adicional");
    return `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #eee">${i + 1}. ${esc(item.n || item.id)}</td>
        <td style="padding:10px;border-bottom:1px solid #eee">${esc(item.qty || 1)}</td>
        <td style="padding:10px;border-bottom:1px solid #eee">${esc(item.p || "")}</td>
        <td style="padding:10px;border-bottom:1px solid #eee">${esc(desc)}</td>
      </tr>`;
  }).join("");

  const attachments = items
    .filter((item: any) => typeof item.requestImg === "string" && item.requestImg.startsWith("data:"))
    .slice(0, 8)
    .map((item: any, i: number) => {
      const [, data = ""] = item.requestImg.split(",");
      const mime = item.requestImg.match(/^data:([^;]+)/)?.[1] || "image/png";
      const ext = mime.includes("jpeg") ? "jpg" : mime.includes("webp") ? "webp" : "png";
      return {
        filename: `${tracking.replace("#", "ELL-")}-${i + 1}.${ext}`,
        content: data,
      };
    });

  const html = `
    <div style="font-family:Arial,sans-serif;color:#111">
      <h2>Nuevo pedido ELLIER ${tracking}</h2>
      <p><strong>Cliente:</strong> ${esc(order.shipping_name || "Cliente")}</p>
      <p><strong>Telefono:</strong> ${esc(order.shipping_phone || "")}</p>
      <p><strong>Direccion:</strong> ${esc(order.shipping_address || "")}</p>
      <p><strong>Total:</strong> ${money(order.total)}</p>
      <p><strong>Payment Intent:</strong> ${esc(order.stripe_payment_intent_id || "")}</p>
      <table style="border-collapse:collapse;width:100%;font-size:13px">
        <thead><tr><th align="left">Producto</th><th align="left">Cant.</th><th align="left">Precio</th><th align="left">Descripcion</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: Deno.env.get("ORDER_EMAIL_FROM") || "ELLIER <onboarding@resend.dev>",
      to: [Deno.env.get("BRAND_EMAIL") || "ellier.agency@gmail.com"],
      subject: `Nuevo pedido ELLIER ${tracking}`,
      html,
      attachments,
    }),
  });

  if (!res.ok) console.error("notify email failed", await res.text());
}

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
    if (status === "paid") await sendOrderEmail(admin, orderId).catch((e) => console.error("notify email", e));

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
