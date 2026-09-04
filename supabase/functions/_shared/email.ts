// Correo de notificación de pedido (Resend). Compartido por confirm-order y
// stripe-webhook para no duplicar la plantilla.

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

// deno-lint-ignore no-explicit-any
export async function sendOrderEmail(admin: any, orderId: string): Promise<void> {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return;

  const { data: order, error } = await admin
    .from("orders").select("*").eq("id", orderId).single();
  if (error || !order) {
    console.error("notify order lookup", error);
    return;
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const tracking = "#" + String(order.id).slice(-6).toUpperCase();

  const rows = items.map((item: Record<string, unknown>, i: number) => {
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
    .filter((item: Record<string, unknown>) =>
      typeof item.requestImg === "string" && (item.requestImg as string).startsWith("data:"))
    .slice(0, 8)
    .map((item: Record<string, unknown>, i: number) => {
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

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
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
