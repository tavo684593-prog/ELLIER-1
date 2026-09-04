# Edge Functions — despliegue y configuración

## Secrets requeridos

```bash
supabase secrets set \
  STRIPE_SECRET_KEY="sk_test_..." \
  STRIPE_WEBHOOK_SECRET="whsec_..." \
  RESEND_API_KEY="re_..." \
  ORDER_EMAIL_FROM="ELLIER <pedidos@tudominio.com>" \
  BRAND_EMAIL="ellier.agency@gmail.com" \
  ALLOWED_ORIGINS="https://TU-USUARIO.github.io,https://tudominio.com"
```

- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` los inyecta Supabase automáticamente.
- **`ALLOWED_ORIGINS`**: mientras no se configure, el CORS sigue abierto (como antes) pero
  se registra un aviso. Al configurarlo, solo esos orígenes (más `localhost`) podrán llamar
  a las funciones.
- **`STRIPE_WEBHOOK_SECRET`**: se obtiene al crear el endpoint del webhook (ver abajo).

## Desplegar

```bash
node scripts/gen-catalog.mjs           # regenera _shared/catalog.json desde products.js
supabase functions deploy create-payment-intent
supabase functions deploy confirm-order
supabase functions deploy stripe-webhook
```

> Corre `gen-catalog.mjs` siempre que cambien precios en `products.js`, y vuelve a
> desplegar `create-payment-intent`.

## Webhook de Stripe

1. Stripe Dashboard → Developers → Webhooks → *Add endpoint*.
2. URL: `https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook`
3. Eventos: `payment_intent.succeeded`.
4. Copia el *Signing secret* (`whsec_...`) a `STRIPE_WEBHOOK_SECRET` y redepliega.

Prueba local:

```bash
supabase functions serve stripe-webhook --no-verify-jwt
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
stripe trigger payment_intent.succeeded
```

## Migraciones RLS

`supabase/migrations/20260903000001_admins.sql` y `20260903000002_rls.sql` cierran el
acceso de escritura a `product_overrides`, `site_settings` y `orders`.

1. Revísalas contra tu esquema real.
2. Pruébalas en un proyecto de staging (`supabase db push`).
3. Da de alta al CEO en la tabla `admins` (SQL comentado al final de `..._admins.sql`).
4. Aplica en producción.

Sin las migraciones, el panel sigue funcionando por el respaldo de email en `Auth.isCEO()`.
