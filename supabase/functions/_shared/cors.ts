// CORS con allowlist en vez de "*".
//
// Configura los orígenes de producción en la variable de entorno ALLOWED_ORIGINS
// (separados por coma), p. ej.:
//   supabase secrets set ALLOWED_ORIGINS="https://tusitio.github.io,https://ellier.mx"
//
// Si ALLOWED_ORIGINS no está configurada, se falla cerrado: no se refleja
// ningún origen de producción (solo quedan permitidos los orígenes locales
// de desarrollo) y se registra un aviso en los logs.

const LOCAL_DEFAULTS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
];

const BASE_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

let warned = false;

export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin") ?? "";
  const configured = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
    .split(",").map((s) => s.trim()).filter(Boolean);

  const headers = { ...BASE_HEADERS };

  if (configured.length === 0 && !warned) {
    console.warn("ALLOWED_ORIGINS no configurada — CORS cerrado salvo orígenes locales. Configúrala en producción.");
    warned = true;
  }

  const allow = [...LOCAL_DEFAULTS, ...configured];
  if (allow.includes(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}
