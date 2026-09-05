// Correos de pedido (Resend). Compartido por confirm-order y stripe-webhook.
//
// sendOrderEmail() dispara DOS correos cuando un pedido pasa a "paid":
//   1. Aviso interno a BRAND_EMAIL (con los diseños adjuntos) para producción.
//   2. Confirmación de compra al cliente (a su email de cuenta).
//
// El correo al cliente requiere un dominio verificado en Resend y que
// ORDER_EMAIL_FROM apunte a ese dominio (p. ej. "ELLIÉR <pedidos@ellier.com.mx>").
// Con el remitente de prueba onboarding@resend.dev Resend solo entrega a la
// propia cuenta, así que el correo al cliente fallará silenciosamente hasta
// verificar el dominio.

export function money(n: number): string {
  return "$" + Number(n || 0).toLocaleString("es-MX") + " MXN";
}

export function esc(v: unknown): string {
  return String(v ?? "").replace(/[&<>"']/g, (m) => (({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  } as Record<string, string>)[m] || m));
}

function fromAddress(): string {
  return Deno.env.get("ORDER_EMAIL_FROM") || "ELLIER <onboarding@resend.dev>";
}

async function sendViaResend(payload: Record<string, unknown>): Promise<void> {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) {
    console.warn("RESEND_API_KEY no configurada — se omite el correo");
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.error("resend failed", res.status, await res.text());
  }
}

type Item = Record<string, unknown>;

function trackingCode(orderId: string): string {
  return "#" + String(orderId).slice(-6).toUpperCase();
}

// ── 1. Aviso interno para producción ────────────────────────────
// deno-lint-ignore no-explicit-any
async function sendOpsEmail(order: any): Promise<void> {
  const items: Item[] = Array.isArray(order.items) ? order.items : [];
  const tracking = trackingCode(order.id);

  const rows = items.map((item, i) => {
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
    .filter((item) => typeof item.requestImg === "string" && (item.requestImg as string).startsWith("data:"))
    .slice(0, 8)
    .map((item, i) => {
      const img = item.requestImg as string;
      const [, data = ""] = img.split(",");
      const mime = img.match(/^data:([^;]+)/)?.[1] || "image/png";
      const ext = mime.includes("jpeg") ? "jpg" : mime.includes("webp") ? "webp" : "png";
      return { filename: `${tracking.replace("#", "ELL-")}-${i + 1}.${ext}`, content: data };
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

  await sendViaResend({
    from: fromAddress(),
    to: [Deno.env.get("BRAND_EMAIL") || "ellier.agency@gmail.com"],
    subject: `Nuevo pedido ELLIER ${tracking}`,
    html,
    attachments,
  });
}

// ── 2. Confirmación de compra para el cliente ───────────────────
// deno-lint-ignore no-explicit-any
async function sendCustomerReceipt(admin: any, order: any): Promise<void> {
  if (!order.user_id) return;

  const { data, error } = await admin.auth.admin.getUserById(order.user_id);
  const email: string | undefined = data?.user?.email;
  if (error || !email) {
    console.error("customer email lookup", error);
    return;
  }

  const items: Item[] = Array.isArray(order.items) ? order.items : [];
  const tracking = trackingCode(order.id);
  const nombre = String(order.shipping_name || data?.user?.user_metadata?.name || "").split(" ")[0];

  const rows = items.map((item) => {
    const extra = item.requestDesc
      ? ` <span style="color:#888">— ${esc(item.requestDesc)}</span>`
      : (item.custom ? ` <span style="color:#888">— personalizado</span>` : "");
    return `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #eee">${esc(item.n || item.id)}${extra}</td>
        <td style="padding:12px 0;border-bottom:1px solid #eee;text-align:center;white-space:nowrap">x${esc(item.qty || 1)}</td>
        <td style="padding:12px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap">${esc(item.p || "")}</td>
      </tr>`;
  }).join("");

  const html = `
  <div style="background:#f5f4f0;padding:32px 0;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;color:#0a0a0a">
    <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #e0dedd;border-radius:8px;overflow:hidden">
      <div style="background:#0a0a0a;color:#fff;padding:22px 28px;letter-spacing:.28em;font-size:13px;text-transform:uppercase">ELLIÉR</div>
      <div style="padding:28px">
        <h1 style="font-size:20px;font-weight:500;margin:0 0 6px">${nombre ? `Gracias, ${esc(nombre)}.` : "Gracias por tu compra."}</h1>
        <p style="color:#6a6a6a;font-size:14px;line-height:1.6;margin:0 0 22px">
          Recibimos tu pago y tu pedido <strong>${tracking}</strong> ya está en preparación.
          Te avisaremos por aquí cuando salga a envío.
        </p>
        <table style="border-collapse:collapse;width:100%;font-size:14px">
          <tbody>${rows}</tbody>
          <tfoot>
            <tr>
              <td style="padding:14px 0 0;font-weight:600">Total</td>
              <td></td>
              <td style="padding:14px 0 0;text-align:right;font-weight:600">${money(order.total)}</td>
            </tr>
          </tfoot>
        </table>
        <div style="margin-top:24px;padding-top:18px;border-top:1px solid #eee;color:#6a6a6a;font-size:13px;line-height:1.7">
          <div style="text-transform:uppercase;letter-spacing:.12em;font-size:10px;color:#b0b0b0;margin-bottom:6px">Envío a</div>
          ${esc(order.shipping_name || "")}<br>
          ${esc(order.shipping_address || "")}<br>
          ${esc(order.shipping_phone || "")}
        </div>
      </div>
      <div style="padding:18px 28px;background:#faf9f7;color:#b0b0b0;font-size:11px;line-height:1.6;border-top:1px solid #eee">
        ¿Dudas con tu pedido? Responde a este correo o escríbenos y menciona ${tracking}.
      </div>
    </div>
  </div>`;

  await sendViaResend({
    from: fromAddress(),
    to: [email],
    reply_to: Deno.env.get("BRAND_EMAIL") || "ellier.agency@gmail.com",
    subject: `Confirmación de tu pedido ELLIÉR ${tracking}`,
    html,
  });
}

// ── Punto de entrada ───────────────────────────────────────────
// deno-lint-ignore no-explicit-any
export async function sendOrderEmail(admin: any, orderId: string): Promise<void> {
  const { data: order, error } = await admin
    .from("orders").select("*").eq("id", orderId).single();
  if (error || !order) {
    console.error("notify order lookup", error);
    return;
  }

  const results = await Promise.allSettled([
    sendOpsEmail(order),
    sendCustomerReceipt(admin, order),
  ]);
  for (const r of results) {
    if (r.status === "rejected") console.error("order email", r.reason);
  }
}
