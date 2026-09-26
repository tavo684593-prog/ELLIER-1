// Quita el fondo de las imágenes que el cliente sube en el personalizador —
// 100% en el navegador (@imgly/background-removal corre local vía WASM/ONNX),
// la imagen nunca sale del dispositivo del cliente.
//
// Se carga bajo demanda (import dinámico) para no pesarle a quien no personaliza
// nada. El modelo (~40MB) se descarga la primera vez que se usa y luego el
// navegador lo cachea.
//
// Expone window.ellierRemoveBackground para que public/main.js (script clásico,
// sin bundlear) lo pueda llamar sin necesidad de convertirlo a módulo.

let _removeBackground = null;

async function loadLib() {
  if (!_removeBackground) {
    const mod = await import('@imgly/background-removal');
    _removeBackground = mod.default;
  }
  return _removeBackground;
}

/**
 * @param {File|Blob} input
 * @param {{onProgress?: (key: string, current: number, total: number) => void}} [opts]
 * @returns {Promise<Blob>} PNG con el fondo ya quitado
 */
window.ellierRemoveBackground = async function (input, opts = {}) {
  const removeBackground = await loadLib();
  const config = {
    model: 'isnet_quint8', // versión chica (~40MB) — prioriza velocidad sobre el modelo default
    output: { format: 'image/png' },
  };
  if (opts.onProgress) config.progress = opts.onProgress;
  return removeBackground(input, config);
};
