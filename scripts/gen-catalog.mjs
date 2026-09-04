// Genera supabase/functions/_shared/catalog.json a partir de products.js
// para que las Edge Functions recalculen precios sin confiar en el cliente.
//
//   node scripts/gen-catalog.mjs
//
// Se corre en "prebuild" (npm run build) y hay que correrlo tambien antes de
// `supabase functions deploy`.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = readFileSync(resolve(root, 'products.js'), 'utf8')

// products.js declara `const CATALOG` / `const CATALOG_SW_CATS` como script
// clasico. Lo evaluamos en un scope aislado sin tocar el archivo.
const factory = new Function(`${src}\n;return { CATALOG, CATALOG_SW_CATS };`)
const { CATALOG } = factory()

const out = {}
for (const p of CATALOG) {
  const price = parseInt(String(p.p ?? '').replace(/\D/g, ''), 10)
  if (!Number.isFinite(price) || price <= 0) {
    console.warn(`  aviso: ${p.id} sin precio valido (${p.p}) — omitido`)
    continue
  }
  out[p.id] = { p: price, cat: p.cat }
}

const destDir = resolve(root, 'supabase/functions/_shared')
mkdirSync(destDir, { recursive: true })
writeFileSync(resolve(destDir, 'catalog.json'), JSON.stringify(out, null, 2) + '\n')

console.log(`catalog.json generado — ${Object.keys(out).length} productos`)
