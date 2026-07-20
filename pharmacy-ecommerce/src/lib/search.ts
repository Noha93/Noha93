import { db } from "./db";
import { Prisma } from "@prisma/client";

export interface ProductSearchResult {
  id: string;
  name: string;
  slug: string;
  price: Prisma.Decimal;
  imageUrl: string | null;
  activeIngredientName: string | null;
  score: number;
}

/**
 * Ranks products by trigram similarity against both the product name and its
 * active ingredient, so "بندول" and "paracetamol" both surface the same items.
 * pg_trgm tolerates typos/partial words, which a plain ILIKE search does not.
 */
export async function searchProducts(query: string, limit = 24): Promise<ProductSearchResult[]> {
  const term = query.trim();
  if (!term) return [];

  return db.$queryRaw<ProductSearchResult[]>`
    SELECT
      p.id,
      p.name,
      p.slug,
      p.price,
      p."imageUrl",
      ai.name AS "activeIngredientName",
      GREATEST(
        similarity(p.name, ${term}),
        similarity(COALESCE(ai.name, ''), ${term})
      ) AS score
    FROM "Product" p
    LEFT JOIN "ActiveIngredient" ai ON ai.id = p."activeIngredientId"
    WHERE p."isActive" = true
      AND (
        p.name ILIKE '%' || ${term} || '%'
        OR ai.name ILIKE '%' || ${term} || '%'
        OR similarity(p.name, ${term}) > 0.2
        OR similarity(COALESCE(ai.name, ''), ${term}) > 0.2
      )
    ORDER BY score DESC, p.name ASC
    LIMIT ${limit};
  `;
}
