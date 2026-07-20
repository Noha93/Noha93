-- Enables fast, typo-tolerant search over product name / active ingredient.
-- Run after `prisma migrate dev` has created the base tables.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS product_name_trgm_idx
  ON "Product" USING GIN (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS active_ingredient_name_trgm_idx
  ON "ActiveIngredient" USING GIN (name gin_trgm_ops);
