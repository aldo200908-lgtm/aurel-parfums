# AUREL — Perfumería

Galería de 20 perfumes de las referencias del propietario: diseñador, Jean Paul Gaultier y perfumería árabe. Imágenes de producto individuales recreadas mediante generación de imágenes desde las nueve referencias. Sus marcas y diseños se mantienen; AUREL actúa como catálogo de exhibición, sin venta activa ni afiliación oficial declarada.

HTML, CSS y JavaScript sin compilación. GitHub Pages desde `main` y la carpeta raíz.

- 20 imágenes WebP con transparencia: `assets/perfumes/`.
- Catálogo de productos: `catalog.js`.
- Carrusel circular con cinco posiciones visibles; navegación por botones, teclado y gesto táctil.
- Filtros por selección y búsqueda de nombre o marca, sin distinción de tildes.
- Fichas con descripciones visuales basadas en las referencias; no se inventan notas, stock, precios ni tamaños.
- Reproducción opcional, pausa al cambiar de pestaña, movimiento reducido.

Iniciar localmente: `python3 -m http.server 8000`.

Comprobaciones de catálogo y carrusel: `node --test tests/catalog.test.cjs`.
