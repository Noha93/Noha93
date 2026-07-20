# Pharmacy E-commerce — WIP (paused)

Early scaffold for a pharmacy/medical-supplies e-commerce platform (10,000+ SKUs,
bulk Excel/CSV import, active-ingredient search). Work paused mid-scaffold to
prioritize the El Bashawat restaurant project — see `../el-bashawat-restaurant`.

## What exists so far
- `prisma/schema.prisma` — Product/Category/ActiveIngredient/Order/Prescription/ImportBatch models.
- `prisma/migrations/0_init/migration.sql` — pg_trgm indexes for typo-tolerant search.
- `src/lib/search.ts` — trigram-ranked search over product name + active ingredient.
- `src/lib/importProducts.ts` — bulk Excel/CSV import with flexible Arabic/English headers, upsert-by-SKU, audit log.

## Not built yet
Next.js app pages/routes (storefront, cart, prescription upload, admin), auth,
SEO scaffolding, package config beyond `package.json`. Resume by scaffolding
`src/app/` following the same pattern as `el-bashawat-restaurant`.
