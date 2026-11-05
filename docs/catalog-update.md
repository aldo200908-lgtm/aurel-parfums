# Reference perfume catalog update

Goal: recreate one individual transparent product image for each distinct perfume supplied by the user and integrate every product into the existing GitHub Pages website.

- Generate 20 images from the nine supplied reference images. Preserve bottle shapes, colors, labels and branding. Deduplicate the repeated Le Male Elixir and Le Male Le Parfum. Treat Le Beau and Le Beau Le Parfum as separate references.
- Optimize the generated images as alpha WebP assets. Retain generation provenance and transparent originals outside the published source.
- Replace the five fictional CSS bottles with product images in the hero, catalog and detail modal. Generalize carousel arithmetic, accessible labels and counters to the actual catalog length.
- Use brand filters and text search. Show brand and visible bottle design in product details; do not invent scent notes, prices, stock or bottle sizes from the images.
- Adapt AUREL copy to a curated perfumery. Disclose generated product imagery and avoid implying official brand affiliation.
- Verify all 20 assets, alpha channels, product identity uniqueness, first/last carousel wrap, brand counts, keyboard interaction, details and live publication.

Implementation: catalog.js holds product metadata; app.js handles rendering and interaction; style.css fits distinct bottle silhouettes; index.html provides counters, search and accessible structure. Publish in one commit after verification, then test the deployed page.
