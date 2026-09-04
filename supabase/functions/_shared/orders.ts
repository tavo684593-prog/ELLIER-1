// Marcado de orden como pagada, idempotente.
// Solo devuelve el id cuando hubo transición real a "paid"
// (para enviar el correo una sola vez, lo llame confirm-order o el webhook).

type MarkArgs = {
  orderId?: string | null;
  paymentIntentId?: string | null;
  userId?: string | null;
};

// deno-lint-ignore no-explicit-any
export async function markOrderPaid(admin: any, args: MarkArgs): Promise<string | null> {
  const { orderId, paymentIntentId, userId } = args;

  let q = admin.from("orders").update({ status: "paid" }).neq("status", "paid");
  if (orderId) q = q.eq("id", orderId);
  else if (paymentIntentId) q = q.eq("stripe_payment_intent_id", paymentIntentId);
  else throw new Error("Falta orderId o paymentIntentId");
  if (userId) q = q.eq("user_id", userId);

  const { data, error } = await q.select("id").maybeSingle();
  if (error) throw error;
  return data?.id ?? null;
}
