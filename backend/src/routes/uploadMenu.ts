import type { Env } from "../types/env";
import { BusinessSchema } from "../schemas/business/businessSchema";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * POST /api/business/menu/upload
 * Body: multipart/form-data
 * Field: file (PDF)
 * Query: businessId
 *
 * Regole:
 * - 1 PDF per business
 * - overwrite sicuro
 * - stato business: draft → active
 */
export async function uploadBusinessMenu(
  request: Request,
  env: Env
) {
  const url = new URL(request.url);
  const businessId = url.searchParams.get("businessId");

  if (!businessId) {
    return json({ error: "Missing businessId" }, 400);
  }

  const storedBusiness = await env.BUSINESS_KV.get(`BUSINESS:${businessId}`);
  if (!storedBusiness) {
    return json({ error: "Business not found" }, 404);
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return json({ error: "Missing PDF file" }, 400);
  }

  if (file.type !== "application/pdf") {
    return json({ error: "Only PDF allowed" }, 400);
  }

  // 🔒 key deterministica → overwrite automatico
  const key = `menu-${businessId}.pdf`;

  await env.BUSINESS_MENU_BUCKET.put(key, file.stream(), {
    httpMetadata: {
      contentType: "application/pdf",
    },
  });

  const menuPdfUrl = `${env.R2_PUBLIC_BASE_URL}/${key}`;

  // 🔒 validazione business esistente
  const parsed = BusinessSchema.parse(JSON.parse(storedBusiness));

  // ✅ update coerente con schema
  const updatedBusiness = {
    ...parsed,
    menuPdfUrl,
    status: "active", // ⬅️ AUTO ATTIVAZIONE
  };

  await env.BUSINESS_KV.put(
    `BUSINESS:${businessId}`,
    JSON.stringify(updatedBusiness)
  );

  return json({
    ok: true,
    businessId,
    menuPdfUrl,
    status: "active",
  });
}
