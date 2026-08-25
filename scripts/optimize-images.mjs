import sharp from 'sharp'
import { readdirSync, statSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { join, extname } from 'node:path'

const ROOT = new URL('../public/images', import.meta.url).pathname.replace(/^\/([a-zA-Z]:)/, '$1')
const MANIFEST = new URL('./.optimize-manifest.json', import.meta.url).pathname.replace(/^\/([a-zA-Z]:)/, '$1')

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else out.push(p)
  }
  return out
}

const done = existsSync(MANIFEST) ? new Set(JSON.parse(readFileSync(MANIFEST, 'utf8'))) : new Set()
const files = walk(ROOT).filter(f => ['.png', '.jpg', '.jpeg'].includes(extname(f).toLowerCase()))

let totalBefore = 0
let totalAfter = 0
let failed = []

async function writeWithRetry(file, out, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try { await writeFile(file, out); return true }
    catch (e) {
      if (i === tries - 1) throw e
      await new Promise(r => setTimeout(r, 300))
    }
  }
}

for (const file of files) {
  if (done.has(file)) continue
  const before = statSync(file).size
  try {
    const buf = await readFile(file)
    const ext = extname(file).toLowerCase()

    let out
    if (ext === '.png') {
      out = await sharp(buf).png({ palette: true, quality: 82, effort: 8 }).toBuffer()
    } else {
      out = await sharp(buf).jpeg({ quality: 82, mozjpeg: true }).toBuffer()
    }

    if (out.length < before) {
      await writeWithRetry(file, out)
      totalBefore += before
      totalAfter += out.length
      console.log(`${file.replace(ROOT, '')}: ${(before/1024).toFixed(0)}KB -> ${(out.length/1024).toFixed(0)}KB`)
    } else {
      totalBefore += before
      totalAfter += before
    }
    done.add(file)
    writeFileSync(MANIFEST, JSON.stringify([...done]))
  } catch (e) {
    console.error(`FAILED: ${file.replace(ROOT, '')}: ${e.message}`)
    failed.push(file)
    totalBefore += before
    totalAfter += before
  }
}

console.log(`\nTotal: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (saved ${(100 - totalAfter/totalBefore*100).toFixed(0)}%)`)
if (failed.length) console.log(`Failed (${failed.length}): ${failed.join(', ')}`)
