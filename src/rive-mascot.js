// Mascota animada del hero vía Rive (https://rive.app) — interactiva y liviana
// (canvas + WASM, no video). Si el .riv no carga por cualquier motivo (sin
// conexión, navegador viejo, archivo movido) se queda la imagen estática de
// respaldo (el fox-head actual), así el hero nunca se rompe.
//
// public/rive/mascot-demo.riv es un demo PÚBLICO de Rive (un vehículo) que
// solo sirve para probar que la integración funciona de principio a fin.
// Para poner el personaje real: exporta el .riv desde el editor de Rive,
// reemplaza ese archivo (mismo nombre) y ya — no hace falta tocar este script.

import { Rive, Layout, Fit, Alignment, RuntimeLoader } from '@rive-app/canvas';

// Auto-hospedado (en vez del CDN unpkg.com por defecto) — es una copia manual
// de node_modules/@rive-app/canvas/rive.wasm. Si se actualiza el paquete
// @rive-app/canvas, hay que volver a copiar este archivo para que coincidan
// las versiones del runtime JS y el WASM.
RuntimeLoader.setWasmUrl('/rive/rive.wasm');

const canvas = document.getElementById('hmasc-rive');
const fallbackImg = document.getElementById('hmasc-fallback-img');

if (canvas) {
  try {
    const r = new Rive({
      src: '/rive/mascot-demo.riv',
      canvas,
      autoplay: true,
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
      onLoad: () => {
        r.resizeDrawingSurfaceToCanvas();
        canvas.style.display = 'block';
        if (fallbackImg) fallbackImg.style.display = 'none';
      },
      onLoadError: () => {
        // se queda la imagen estática de respaldo
      },
    });
    window.addEventListener('resize', () => r.resizeDrawingSurfaceToCanvas(), { passive: true });
  } catch {
    // se queda la imagen estática de respaldo
  }
}
