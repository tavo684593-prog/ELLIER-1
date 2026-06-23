// ─────────────────────────────────────────────────────────────
// ELLIÉR — Catálogo unificado de productos
//
// Para agregar un producto nuevo:
//   1. Copia uno de los objetos de abajo según el tipo.
//   2. Guarda este archivo.
//   3. El producto aparece automáticamente en la página principal
//      Y en el catálogo completo, sin tocar nada más.
// ─────────────────────────────────────────────────────────────

const CATALOG_SW_CATS = new Set(['joggers','sudaderas','pans','playeras','chamarras']);

const CATALOG = [

  // ── JOGGERS ─────────────────────────────────────────────────

  {id:'sw5', n:'Jogger Relaxed', cat:'joggers', p:'$490', tag:'new',
   clrs:['#8a9485','#3a3730','#1a1a1a'],
   desc:'Jogger relajado para uso diario y streetwear.',
   img:'images/jogger-verde.png',
   svg:`<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="5" width="80" height="90" rx="10" fill="{C}" opacity=".9"/><rect x="10" y="5" width="80" height="16" rx="5" fill="rgba(0,0,0,.18)"/><line x1="50" y1="21" x2="50" y2="95" stroke="rgba(255,255,255,.07)" stroke-width="1.5"/><rect x="8" y="95" width="36" height="20" rx="5" fill="{C}" opacity=".85"/><rect x="56" y="95" width="36" height="20" rx="5" fill="{C}" opacity=".85"/></svg>`},

  {id:'sw21', n:'Jogger Negro', cat:'joggers', p:'$490', tag:'new',
   clrs:['#1a1a1a','#8a9485'],
   desc:'Jogger negro con corte relajado y estilo urbano.',
   img:'images/jogger-negro.png',
   svg:`<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="5" width="80" height="90" rx="8" fill="{C}" opacity=".9"/><rect x="10" y="5" width="80" height="14" rx="4" fill="rgba(0,0,0,.2)"/><line x1="50" y1="19" x2="50" y2="95" stroke="rgba(255,255,255,.08)" stroke-width="1"/><rect x="8" y="95" width="36" height="20" rx="4" fill="{C}" opacity=".85"/><rect x="56" y="95" width="36" height="20" rx="4" fill="{C}" opacity=".85"/></svg>`},

  // ── SUDADERAS ────────────────────────────────────────────────

  {id:'sw2', n:'Sudadera Árbol', cat:'sudaderas', p:'$680',
   clrs:['#2d5e3a','#1a1a1a'],
   desc:'Sudadera con estampado árbol, corte cómodo y tela suave.',
   img:'images/sudadera-arbol.png',
   svg:`<svg viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 20 L10 45 L25 47 L25 105 L75 105 L75 47 L90 45 L80 20 L65 30 Q50 38 35 30 Z" fill="{C}"/><path d="M35 30 Q50 38 65 30 L65 38 Q50 46 35 38 Z" fill="rgba(0,0,0,.15)"/></svg>`},

  {id:'sw6', n:'Sudadera Dragón', cat:'sudaderas', p:'$720', tag:'bs',
   clrs:['#1a1a1a','#c4b8a2'],
   desc:'Sudadera con gráfico de dragón y silueta oversize.',
   img:'images/sudadera-dragon.png',
   svg:`<svg viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 22 L5 48 L22 50 L22 106 L78 106 L78 50 L95 48 L85 22 L68 32 Q50 40 32 32 Z" fill="{C}"/><path d="M32 32 Q50 40 68 32 L68 40 Q50 48 32 40 Z" fill="rgba(0,0,0,.15)"/></svg>`},

  {id:'sw9', n:'Sudadera Angel', cat:'sudaderas', p:'$820',
   clrs:['#1a1a1a','#8a8578'],
   desc:'Sudadera premium con detalles bordados y actitud urbana.',
   img:'images/sudadera-angel.png',
   svg:`<svg viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 20 L10 45 L25 47 L25 105 L75 105 L75 47 L90 45 L80 20 L65 30 Q50 38 35 30 Z" fill="{C}"/></svg>`},

  {id:'sw10', n:'Sudadera Ángel Blagro', cat:'sudaderas', p:'$780',
   clrs:['#1a1a1a'],
   desc:'Sudadera con diseño Blagro y sensación premium.',
   img:'images/sudadera-angel-blagro.png',
   svg:`<svg viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 20 L10 45 L25 47 L25 105 L75 105 L75 47 L90 45 L80 20 L65 30 Q50 38 35 30 Z" fill="{C}"/></svg>`},

  {id:'sw11', n:'Sudadera Frase Espada', cat:'sudaderas', p:'$760',
   clrs:['#121212'],
   desc:'Sudadera con frase espada para un look urbano con actitud.',
   img:'images/sudadera-frase-espada.png',
   svg:`<svg viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 20 L10 45 L25 47 L25 105 L75 105 L75 47 L90 45 L80 20 L65 30 Q50 38 35 30 Z" fill="{C}"/></svg>`},

  {id:'sw12', n:'Sudadera Frase Zamu', cat:'sudaderas', p:'$760',
   clrs:['#8a9485'],
   desc:'Sudadera con diseño Zamu y estilo contemporáneo.',
   img:'images/sudadera-frase-zamu.png',
   svg:`<svg viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 20 L10 45 L25 47 L25 105 L75 105 L75 47 L90 45 L80 20 L65 30 Q50 38 35 30 Z" fill="{C}"/></svg>`},

  {id:'sw13', n:'Sudadera Frase 1', cat:'sudaderas', p:'$740',
   clrs:['#1a1a1a'],
   desc:'Sudadera con frase gráfica minimalista en frente.',
   img:'images/sudadera-frase1.png',
   svg:`<svg viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 20 L10 45 L25 47 L25 105 L75 105 L75 47 L90 45 L80 20 L65 30 Q50 38 35 30 Z" fill="{C}"/></svg>`},

  {id:'sw14', n:'Sudadera Frase 2', cat:'sudaderas', p:'$740',
   clrs:['#2a2a2a'],
   desc:'Sudadera con diseño tipográfico y corte contemporáneo.',
   img:'images/sudadera-frase2.png',
   svg:`<svg viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 20 L10 45 L25 47 L25 105 L75 105 L75 47 L90 45 L80 20 L65 30 Q50 38 35 30 Z" fill="{C}"/></svg>`},

  // ── PANS ─────────────────────────────────────────────────────

  {id:'sw3', n:'Pan Cargo', cat:'pans', p:'$560', tag:'bs',
   clrs:['#3a3730','#1a1a1a'],
   desc:'Pantalón cargo de corte slim con bolsillos laterales.',
   img:'images/pans-negro-ancestral.png',
   svg:`<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 5 L80 5 L80 20 L85 95 L65 115 L55 70 L45 70 L35 115 L15 95 L20 20 Z" fill="{C}"/><rect x="60" y="40" width="18" height="24" rx="3" fill="rgba(0,0,0,.2)"/><rect x="20" y="40" width="18" height="24" rx="3" fill="rgba(0,0,0,.2)"/></svg>`},

  {id:'sw7', n:'Pan Slim', cat:'pans', p:'$530',
   clrs:['#f4f1ec','#1a1a1a'],
   desc:'Pantalón slim de silueta limpia.',
   img:'images/pans-blanco-juicio.png',
   svg:`<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 5 L78 5 L78 20 L82 98 L63 118 L53 72 L47 72 L37 118 L18 98 L22 20 Z" fill="{C}"/></svg>`},

  {id:'sw15', n:'Pan Espada', cat:'pans', p:'$560',
   clrs:['#f4f1ec'],
   desc:'Pantalón blanco con gráfico espada y corte moderno.',
   img:'images/pans-blanco-espada.png',
   svg:`<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 5 L78 5 L78 20 L82 98 L63 118 L53 72 L47 72 L37 118 L18 98 L22 20 Z" fill="{C}"/></svg>`},

  {id:'sw16', n:'Pan Fénix', cat:'pans', p:'$560',
   clrs:['#1a1a1a'],
   desc:'Pantalón negro con diseño Fénix y estilo urbano.',
   img:'images/pans-negro-fenix.png',
   svg:`<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 5 L78 5 L78 20 L82 98 L63 118 L53 72 L47 72 L37 118 L18 98 L22 20 Z" fill="{C}"/></svg>`},

  {id:'sw17', n:'Pan Sangre', cat:'pans', p:'$560',
   clrs:['#1a1a1a'],
   desc:'Pantalón negro con detalle rojo y actitud arriesgada.',
   img:'images/pans-negro-sangre.png',
   svg:`<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 5 L78 5 L78 20 L82 98 L63 118 L53 72 L47 72 L37 118 L18 98 L22 20 Z" fill="{C}"/></svg>`},

  // ── PLAYERAS ─────────────────────────────────────────────────

  {id:'sw4', n:'Playera Core', cat:'playeras', p:'$380',
   clrs:['#f0ede6','#1a1a1a','#c4b8a2'],
   desc:'Camiseta en jersey de algodón peinado.',
   img:'images/playera-ellier-blanca.png',
   model3d:'render3d/playeras/blanco/blanco.gltf',
   models3d:{'#f0ede6':'render3d/playeras/blanco/blanco.gltf','#1a1a1a':'render3d/playeras/negro/negro.gltf','#c4b8a2':'render3d/playeras/gris/gris.gltf'},
   svg:`<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 20 L5 40 L20 45 L20 95 L80 95 L80 45 L95 40 L80 20 L65 28 Q50 35 35 28 Z" fill="{C}"/><path d="M35 28 Q50 35 65 28 L65 35 Q50 42 35 35 Z" fill="rgba(0,0,0,.12)"/></svg>`},

  {id:'sw8', n:'Playera Edición', cat:'playeras', p:'$420', tag:'new',
   clrs:['#9a6050','#1a1a1a','#f0ede6'],
   desc:'Playera de edición con identidad ELLIÉR.',
   img:'images/playera-azul.png',
   model3d:'render3d/playeras/rojo/rojo.gltf',
   models3d:{'#9a6050':'render3d/playeras/rojo/rojo.gltf','#1a1a1a':'render3d/playeras/negro/negro.gltf','#f0ede6':'render3d/playeras/blanco/blanco.gltf'},
   svg:`<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 20 L5 40 L20 45 L20 95 L80 95 L80 45 L95 40 L80 20 L65 28 Q50 35 35 28 Z" fill="{C}"/><text x="50" y="68" text-anchor="middle" font-size="9" fill="rgba(255,255,255,.28)" font-family="Helvetica">ELLIÉR</text></svg>`},

  {id:'sw18', n:'Playera Corazón', cat:'playeras', p:'$420',
   clrs:['#f0c0d0'],
   desc:'Playera con estampado de corazón para un look casual y romántico.',
   img:'images/playera-corazon.png',
   svg:`<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 20 L5 40 L20 45 L20 95 L80 95 L80 45 L95 40 L80 20 L65 28 Q50 35 35 28 Z" fill="{C}"/></svg>`},

  {id:'sw19', n:'Playera Los Ángeles', cat:'playeras', p:'$420',
   clrs:['#1a1a1a'],
   desc:'Playera negra con texto Los Ángeles, estilo urbano y fresco.',
   img:'images/playera-los-angeles.png',
   svg:`<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 20 L5 40 L20 45 L20 95 L80 95 L80 45 L95 40 L80 20 L65 28 Q50 35 35 28 Z" fill="{C}"/></svg>`},

  {id:'sw20', n:'Playera Rosa', cat:'playeras', p:'$420',
   clrs:['#f0a8dd'],
   desc:'Playera rosa con corte cómodo y actitud vibrante.',
   img:'images/playera-rosa.png',
   svg:`<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 20 L5 40 L20 45 L20 95 L80 95 L80 45 L95 40 L80 20 L65 28 Q50 35 35 28 Z" fill="{C}"/></svg>`},

  // ── CHAMARRAS ────────────────────────────────────────────────

  {id:'sw22', n:'Chamarra ELLIÉR', cat:'chamarras', p:'$980', tag:'new',
   clrs:['#1a1a1a'],
   desc:'Chamarra ELLIÉR con diseño exclusivo y acabado premium.',
   img:'images/chamarra-ellier.png',
   svg:`<svg viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 22 L5 48 L22 50 L22 106 L78 106 L78 50 L95 48 L85 22 L68 32 Q50 40 32 32 Z" fill="{C}"/></svg>`},

  // ── TERMOS Y TAZAS ──────────────────────────────────────────

  {id:'t1', n:'Termo Negro 500ml', cat:'termos', p:'$320',
   oz:'17oz / 500ml', clr:'#1a1a1a',
   desc:'Acero 304 · Doble pared · 8h caliente · 20h frío',
   img:'images/termo-negro-30-oz.png'},

  {id:'t2', n:'Termo Arena 500ml', cat:'termos', p:'$320',
   oz:'17oz / 500ml', clr:'#c4b8a2',
   desc:'Sellado al vacío · Tapa antigoteo · Premium',
   img:'images/termo-del-chisme.png'},

  {id:'t3', n:'Termo Gris Titanio', cat:'termos', p:'$380',
   oz:'20oz / 600ml', clr:'#8a8578',
   desc:'Acabado titanio cepillado · Edición limitada',
   img:'images/termos-oz.png'},

  {id:'t6', n:'Termo Café 750ml', cat:'termos', p:'$440',
   oz:'25oz / 750ml', clr:'#3a2a1a',
   desc:'Gran capacidad · Tapa de presión · Café oscuro',
   img:'images/termos-oz.png'},

  {id:'t4', n:'Taza Matte Negro', cat:'tazas', p:'$220',
   oz:'11oz / 330ml', clr:'#2a2a2a',
   desc:'Cerámica premium · Apto microondas · Matte',
   img:'images/tazas.png'},

  {id:'t5', n:'Taza Latte Beige', cat:'tazas', p:'$220',
   oz:'11oz / 330ml', clr:'#d4c4a8',
   desc:'Color latte minimalista · Personalizable',
   img:'images/taza-termo.png'},

  // ── AGREGA NUEVOS PRODUCTOS AQUÍ ────────────────────────────
  // Ejemplo ropa con foto:
  // {id:'sw23', n:'Nombre', cat:'playeras', p:'$XXX', tag:'new',
  //  clrs:['#1a1a1a'], desc:'Descripción breve.',
  //  img:'images/nombre-foto.png',
  //  svg:`...`},
  //
  // Ejemplo termo nuevo:
  // {id:'t7', n:'Termo Rojo 500ml', cat:'termos', p:'$340',
  //  oz:'17oz / 500ml', clr:'#8b1a1a',
  //  desc:'Edición especial roja · Acero 304',
  //  img:'images/termo-rojo.png'},
];
