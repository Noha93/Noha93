import * as XLSX from "xlsx";
import Papa from "papaparse";
import slugify from "slugify";
import { z } from "zod";
import { db } from "./db";

// Column names an operations person will actually type in Excel — kept
// flexible (Arabic + English headers) instead of forcing a rigid template.
const ROW_ALIASES: Record<string, string[]> = {
  sku: ["sku", "code", "الكود"],
  name: ["name", "product name", "الاسم", "اسم المنتج"],
  price: ["price", "السعر"],
  stockQuantity: ["stock", "quantity", "qty", "الكمية"],
  activeIngredient: ["active ingredient", "المادة الفعالة"],
  category: ["category", "القسم", "التصنيف"],
  imageUrl: ["image", "image url", "الصورة"],
  requiresPrescription: ["prescription", "rx", "روشتة"],
};

const rowSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  price: z.coerce.number().positive(),
  stockQuantity: z.coerce.number().int().nonnegative().default(0),
  activeIngredient: z.string().optional(),
  category: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  requiresPrescription: z
    .union([z.boolean(), z.string(), z.number()])
    .optional()
    .transform((v) => v === true || v === "1" || v === "true" || v === "yes" || v === 1),
});

export type ParsedRow = z.infer<typeof rowSchema>;

export interface ImportResult {
  totalRows: number;
  createdCount: number;
  updatedCount: number;
  errorCount: number;
  errors: { row: number; message: string }[];
}

function normalizeHeader(header: string): string | null {
  const cleaned = header.trim().toLowerCase();
  for (const [field, aliases] of Object.entries(ROW_ALIASES)) {
    if (aliases.some((a) => a.toLowerCase() === cleaned)) return field;
  }
  return null;
}

function rawRowsFromBuffer(buffer: Buffer, fileName: string): Record<string, unknown>[] {
  if (fileName.endsWith(".csv")) {
    const text = buffer.toString("utf-8");
    const parsed = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
    return parsed.data;
  }
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}

/**
 * Parses an uploaded Excel/CSV file and upserts products by SKU.
 * Designed to run for a 10k-row file inside a single request; for larger
 * files this should move to a background job queue instead.
 */
export async function importProductsFromFile(buffer: Buffer, fileName: string): Promise<ImportResult> {
  const rawRows = rawRowsFromBuffer(buffer, fileName);
  const errors: ImportResult["errors"] = [];
  let createdCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < rawRows.length; i++) {
    const raw = rawRows[i];
    const normalized: Record<string, unknown> = {};
    for (const [header, value] of Object.entries(raw)) {
      const field = normalizeHeader(header);
      if (field) normalized[field] = value;
    }

    const parsed = rowSchema.safeParse(normalized);
    if (!parsed.success) {
      errors.push({ row: i + 2, message: parsed.error.issues.map((e) => e.message).join("; ") });
      continue;
    }
    const row = parsed.data;

    try {
      const category = row.category
        ? await db.category.upsert({
            where: { slug: slugify(row.category, { lower: true }) },
            update: {},
            create: { name: row.category, slug: slugify(row.category, { lower: true }) },
          })
        : null;

      const activeIngredient = row.activeIngredient
        ? await db.activeIngredient.upsert({
            where: { name: row.activeIngredient },
            update: {},
            create: { name: row.activeIngredient },
          })
        : null;

      const existing = await db.product.findUnique({ where: { sku: row.sku } });

      await db.product.upsert({
        where: { sku: row.sku },
        update: {
          name: row.name,
          price: row.price,
          stockQuantity: row.stockQuantity,
          imageUrl: row.imageUrl || undefined,
          requiresPrescription: row.requiresPrescription,
          categoryId: category?.id,
          activeIngredientId: activeIngredient?.id,
        },
        create: {
          sku: row.sku,
          name: row.name,
          slug: `${slugify(row.name, { lower: true })}-${row.sku.toLowerCase()}`,
          price: row.price,
          stockQuantity: row.stockQuantity,
          imageUrl: row.imageUrl || undefined,
          requiresPrescription: row.requiresPrescription,
          categoryId: category?.id,
          activeIngredientId: activeIngredient?.id,
        },
      });

      if (existing) updatedCount++;
      else createdCount++;
    } catch (err) {
      errors.push({ row: i + 2, message: err instanceof Error ? err.message : "Unknown error" });
    }
  }

  const result: ImportResult = {
    totalRows: rawRows.length,
    createdCount,
    updatedCount,
    errorCount: errors.length,
    errors: errors.slice(0, 200), // cap stored errors so a bad file doesn't bloat the log
  };

  await db.importBatch.create({
    data: {
      fileName,
      totalRows: result.totalRows,
      createdCount: result.createdCount,
      updatedCount: result.updatedCount,
      errorCount: result.errorCount,
      errors: result.errors,
    },
  });

  return result;
}
